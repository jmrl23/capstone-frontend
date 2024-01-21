import Loading from '@/routes/Loading';
import NotFound from '@/routes/Notfound';
import Container from '@/components/globals/container';
import { useDevices } from '@/hooks/useDevices';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon, ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { default as moment } from 'moment';
import { useContext, useEffect, useState } from 'react';
import { WsContext } from '@/contexts/ws';
import { MqttTopics } from '@/lib/constants';
import { subDays } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { DatePickerWithRange } from '@/components/ui/date-range';
import { useDeviceDataPressList } from '@/hooks/useDeviceDataPressList';
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function Device() {
  const params = useParams<{ id: string }>();
  const { data: devices, isLoading, refetch } = useDevices();
  const socket = useContext(WsContext);
  const device = devices.find((device) => device.id === params.id);
  const usageGraphData = device?.DeviceData.DeviceDataPress.reduce(
    (result, press) => {
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
    },
    [] as Array<{ name: string; total: number }>,
  );
  const now = new Date();
  const [logsTableDate, setLogsTableDate] = useState<DateRange | undefined>({
    from: subDays(now, 6),
    to: now,
  });
  const { data: logsTableData, refetch: refetchDeviceDataPressList } =
    useDeviceDataPressList(
      device?.id ?? '123e4567-e89b-12d3-a456-426614174000',
      logsTableDate?.from?.toISOString(),
      logsTableDate?.to?.toISOString(),
    );

  useEffect(() => {
    const callback = (data: MqttMessage) => {
      if (data.topic.parsed === MqttTopics.A_SYNC) {
        refetch();
        refetchDeviceDataPressList();
        return;
      }
    };

    socket?.on('mqtt:message', callback);
    return () => {
      socket?.off('mqtt:message', callback);
    };
  }, [refetch, refetchDeviceDataPressList, socket]);

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
      <UsageGraph data={usageGraphData} />
      <LogsTable
        date={logsTableDate}
        setDate={setLogsTableDate}
        data={logsTableData}
      />
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
      label: 'Mild',
      message: 'your astma is mild',
    },
    {
      fill: 'orange',
      min: 11,
      label: 'Moderate',
      message: 'your astma is moderate',
    },
    {
      fill: 'red',
      min: 31,
      label: 'Severe',
      message: 'your astma is severe',
    },
  ];

  const getStatus = (n: number) => {
    let _status = status[0];

    for (const s of status) {
      if (n >= s.min) {
        _status = s;
      }
    }

    return _status;
  };

  const getStatusFill = (n: number): string => {
    const fill = getStatus(n).fill;

    return fill;
  };

  return (
    <div className='m-4'>
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>
            Number of presses for the last 5 months
          </CardDescription>
          <div className='flex flex-col gap-y-2 pt-4 text-xs text-gray-600 items-end'>
            {status.map((e, i) => (
              <div
                className='flex gap-x-2 justify-between items-center w-[80px]'
                key={i}
              >
                <div
                  className='w-4 h-4 rounded'
                  style={{ backgroundColor: e.fill }}
                />
                <span className='font-bold'>{e.label}</span>
              </div>
            ))}
          </div>
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
              <Bar
                dataKey='total'
                radius={[2, 2, 0, 0]}
                onMouseEnter={(e) => console.log(e)}
              >
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

function LogsTable({
  date,
  setDate,
  data,
}: {
  date?: DateRange;
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>;
  data: DeviceDataPress[];
}) {
  const [pageIndex, setPageIndex] = useState<number>(0);
  const selectedData = data.slice(pageIndex, pageIndex + 10);

  return (
    <div className='m-4'>
      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <CardDescription>View usage logs on a date range</CardDescription>
        </CardHeader>
        <DatePickerWithRange className='mx-4' date={date} setDate={setDate} />
        <p className='p-4 text-right font-bold text-gray-600 text-xs'>
          Total: {data.length}
        </p>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className='max-h-[400px] overflow-y-hidden'>
            {selectedData.map((press) => (
              <TableRow key={press.id}>
                <TableCell>
                  {moment(press.createdAt).format('MMM DD, YYYY')}
                </TableCell>
                <TableCell>
                  {moment(press.createdAt).format('hh:mm A')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className='flex gap-x-2 p-4 justify-end border border-top'>
          <Button
            variant={'outline'}
            onClick={() => {
              if (pageIndex <= 0) return;
              setPageIndex((value) => value - 10);
            }}
            title='Previous'
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant={'outline'}
            onClick={() => {
              if (pageIndex + 10 >= data.length) return;
              setPageIndex((value) => value + 10);
            }}
            title='Next'
          >
            <ChevronRightIcon />
          </Button>
        </div>
      </Card>
    </div>
  );
}
