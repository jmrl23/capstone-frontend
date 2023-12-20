import Loading from '@/routes/Loading';
import NotFound from '@/routes/Notfound';
import Container from '@/components/global/container';
import { useDevices } from '@/hooks/useDevices';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import { default as moment } from 'moment';
import { Bar, ResponsiveContainer, XAxis, YAxis, BarChart } from 'recharts';
import { useContext, useEffect } from 'react';
import { WsContext } from '@/contexts/ws';
import { TOPICS } from '@/lib/constants';
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
      if (data.topic.parsed === TOPICS.A_SYNC) return refetch();
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
      <main className='m-4'>
        <Card>
          <CardHeader>
            <CardTitle>Usage</CardTitle>
            <CardDescription>
              Number of presses for the last 5 months
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width='100%' height={250}>
              <BarChart data={usage}>
                <XAxis
                  dataKey='name'
                  className='stroke-muted-foreground'
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  className='stroke-muted-foreground'
                  fontSize={12}
                  tickLine={true}
                  axisLine={false}
                  tickFormatter={(value) => value}
                />
                <Bar
                  dataKey='total'
                  className='fill-foreground'
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </main>
    </Container>
  );
}
