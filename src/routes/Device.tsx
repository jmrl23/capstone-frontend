import Loading from '@/routes/Loading';
import NotFound from '@/routes/Notfound';
import Container from '@/components/globals/container';
import { useDevices } from '@/hooks/useDevices';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { default as moment } from 'moment';
import {
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  BarChart,
  Cell,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useContext, useEffect } from 'react';
import { WsContext } from '@/contexts/ws';
import { MqttTopics } from '@/lib/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Device() {
  const params = useParams<{ id: string }>();
  const { data: devices, isLoading, refetch } = useDevices();
  const socket = useContext(WsContext);
  const device = devices.find((device) => device.id === params.id);
  const usage = device?.DeviceData.DeviceDataPress.reduce((result, press) => {
    const month = moment(press.createdAt).format('MMMM');
    const index = result.findIndex((item) => item.name === month);

    if (index < 0) {
      result.push({
        name: month,
        total: 1,
      });
    } else {
      result[index].total++;
    }

    return result;
  }, [] as Array<{ name: string; total: number }>);

  useEffect(() => {
    const callback = (data: MqttMessage) => {
      if (data.topic.parsed === MqttTopics.A_SYNC) return refetch();
    };

    socket?.on('mqtt:message', callback);
    return () => {
      socket?.off('mqtt:message', callback);
    };
  }, [refetch, socket]);

  if (isLoading) return <Loading />;
  if (!device) return <NotFound />;

  return (
    <Container>
      <header className='p-4 bg-primary-foreground flex items-center shadow gap-x-4 rounded-b-lg mx-4'>
        <Link to='/'>
          <Button variant='secondary'>
            <ArrowLeftIcon />
          </Button>
        </Link>
        <div>
          <h3 className='font-extrabold text-lg'>Device Information</h3>
          <div className='text-muted-foreground ml-auto font-mono font-bold text-xs'>
            {device.deviceKey}
          </div>
        </div>
      </header>
      <UsageGraph data={usage} />
    </Container>
  );
}

function UsageGraph({
  data,
}: {
  data?: {
    name: string;
    total: number;
  }[];
}) {
  const status = [
    {
      fill: 'green',
      min: 0,
      name: 'normal',
    },
    {
      fill: 'yellow',
      min: 100,
      name: 'warning',
    },
    {
      fill: 'red',
      min: 200,
      name: 'danger',
    },
  ];

  const getStatusFill = (n: number): string => {
    let fill = status[0].fill;

    for (const e of status) {
      if (n >= e.min) {
        fill = e.fill;
      }
    }

    return fill;
  };

  return (
    <div className='m-4'>
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>
            Number of presses for the last 5 months
            <br />
            <div className='flex flex-col gap-y-2 my-2'>
              {status.map((e, i) => (
                <div className='flex gap-x-2 items-center'>
                  <div
                    key={i}
                    className='w-4 h-4'
                    style={{ backgroundColor: e.fill }}
                  />
                  <span>{e.name}</span>
                </div>
              ))}
            </div>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width='100%' height={250}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray='3 3' />
              <XAxis
                dataKey='name'
                className='stroke-muted-foreground'
                fontSize={12}
                tickLine={false}
                axisLine={true}
              />
              <YAxis
                className='stroke-muted-foreground'
                fontSize={12}
                tickLine={true}
                axisLine={true}
                tickFormatter={(value) => value}
              />
              <Tooltip />
              <Bar dataKey='total' radius={[2, 2, 0, 0]}>
                {data?.map(({ total, name }) => (
                  <Cell key={name} fill={getStatusFill(total)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
