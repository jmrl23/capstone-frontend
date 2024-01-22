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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

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
      // just a placeholder UUID to prevent error 400 on request
      device?.id ?? 'a2b56e25-6c01-4eb2-9b1b-66de8acbfda0',
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
      <RecordSummary />
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
      message: (
        <>
          Use a rescue inhaler as needed and consider a low-dose inhaled
          corticosteroid, working with your healthcare provider to create an
          asthma action plan.
        </>
      ),
    },
    {
      fill: 'orange',
      min: 11,
      label: 'Moderate',
      message: (
        <>
          Combine a rescue inhaler with daily inhaled corticosteroids, and
          follow your action plan for symptom management, monitoring symptoms
          and peak flow as directed.
        </>
      ),
    },
    {
      fill: 'red',
      min: 31,
      label: 'Severe',
      message: (
        <>
          Combine quick-acting bronchodilators with high-dose inhaled
          corticosteroids and possibly other medications; regularly monitor
          symptoms, perform lung function tests, and work closely with a
          specialist to adjust your treatment plan, following your personalized
          asthma action plan for effective management.
        </>
      ),
    },
  ];

  const getStatus = (n: number) => {
    let target = status[0];

    for (const s of status) {
      if (n >= s.min) {
        target = s;
      }
    }

    return target;
  };

  const getStatusFill = (n: number): string => {
    const fill = getStatus(n).fill;

    return fill;
  };

  const [targetStatus, setTargetStatus] = useState<{
    fill: string;
    min: number;
    label: string;
    message: React.ReactNode;
    name: string;
  } | null>(null);

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
                onClick={(e) => {
                  const status = getStatus(e.payload.total);
                  setTargetStatus({ ...status, name: e.name });
                }}
                onBlur={() => {
                  setTargetStatus(null);
                }}
              >
                {data?.map(({ total, name }) => (
                  <Cell key={name} fill={getStatusFill(total)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
        <p className='text-justify px-4 pb-4 text-xs text-gray-600'>
          {!targetStatus && <span className='invisible'>—</span>}
          {targetStatus && (
            <>
              <span className='font-extrabold'>{targetStatus.name}: </span>
              <span>{targetStatus.message}</span>
            </>
          )}
        </p>
      </Card>
    </div>
  );
}

function RecordSummary() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className='m-4'>
      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
          <CardDescription>Summary report for the last month</CardDescription>
        </CardHeader>
        <CardContent className='border-t'>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <div className='flex justify-end mt-6'>
              <DialogTrigger asChild>
                <Button variant={'outline'} title='View report'>
                  View report
                </Button>
              </DialogTrigger>
            </div>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Summary</DialogTitle>
                <DialogDescription>
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit.
                  Unde, consectetur.
                </DialogDescription>
              </DialogHeader>
              <div>
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Qui
                  autem nobis at fuga soluta veritatis repellendus odio, vitae
                  quae ullam magni culpa voluptatum laboriosam quisquam
                  provident similique nulla. Neque iste amet velit ex vero
                  corporis id delectus inventore, omnis repellat.
                </p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>a</TableHead>
                      <TableHead>b</TableHead>
                      <TableHead>c</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>data 1 a</TableCell>
                      <TableCell>data 1 b</TableCell>
                      <TableCell>data 1 c</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>data 2 a</TableCell>
                      <TableCell>data 2 b</TableCell>
                      <TableCell>data 2 c</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>data 3 a</TableCell>
                      <TableCell>data 3 b</TableCell>
                      <TableCell>data 3 c</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <div className='flex justify-end border-t pt-6'>
                  <Button
                    variant={'outline'}
                    title='close'
                    onClick={() => setIsOpen(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
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
        <Table className='border-t mt-4'>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
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
        <div className='flex gap-x-2 p-4 justify-end border-t'>
          <p className='p-4 text-right font-bold text-gray-600 text-xs'>
            Total: {data.length}
          </p>
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
