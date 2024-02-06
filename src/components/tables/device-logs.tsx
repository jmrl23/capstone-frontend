import { subDays } from 'date-fns';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CircleSlashIcon,
  Loader2Icon,
} from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { DatePickerWithRange } from '@/components/ui/date-range';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from '@/components/ui/table';
import { useDeviceDataPressList } from '@/hooks/useDeviceDataPressList';
import { useContext, useEffect, useState } from 'react';
import { WsContext } from '@/contexts/ws';
import { MqttTopics } from '@/lib/constants';
import moment from 'moment';

export default function DeviceLogsTable({ device }: Props) {
  const now = new Date();
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(now, 6),
    to: now,
  });
  const { data, refetch, isLoading } = useDeviceDataPressList(
    device.id,
    date?.from?.toISOString(),
    date?.to?.toISOString(),
  );
  const [page, setPage] = useState<number>(0);
  const selectedData = data.slice(page, page + 10);
  const socket = useContext(WsContext);

  useEffect(() => {
    setPage(0);
  }, [date]);

  useEffect(() => {
    const callback = (data: MqttMessage) => {
      if (data.topic.parsed === MqttTopics.A_SYNC) {
        refetch();
        return;
      }
    };

    socket?.on('mqtt:message', callback);
    return () => {
      socket?.off('mqtt:message', callback);
    };
  }, [refetch, socket]);

  return (
    <div className='m-4'>
      <Card>
        <CardHeader>
          <CardTitle>Logs</CardTitle>
          <CardDescription>View usage logs on a date range</CardDescription>
        </CardHeader>
        <DatePickerWithRange className='mx-4' date={date} setDate={setDate} />
        {isLoading && (
          <p className='text-sm text-muted-foreground font-bold p-4'>
            <Loader2Icon className='animate-spin inline-block' />
            <span className='inline-block ml-2'>Loading..</span>
          </p>
        )}
        {!isLoading && selectedData.length < 1 && (
          <p className='text-sm text-muted-foreground font-bold p-4'>
            <CircleSlashIcon className='inline-block mr-2' />
            Not available
          </p>
        )}
        {!isLoading && selectedData.length > 0 && (
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
        )}
        <div className='flex gap-x-2 p-4 pb-2 justify-end border-t'>
          <p className='p-4 text-right font-bold text-gray-600 text-xs'>
            Total: {data.length}
          </p>
          <Button
            variant={'outline'}
            onClick={() => {
              if (page <= 0) return;
              setPage((value) => value - 10);
            }}
            title='Previous'
          >
            <ChevronLeftIcon />
          </Button>
          <Button
            variant={'outline'}
            onClick={() => {
              if (page + 10 >= data.length) return;
              setPage((value) => value + 10);
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

export interface Props {
  device: Device;
}
