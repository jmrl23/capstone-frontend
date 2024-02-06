import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MqttTopics, levels } from '@/lib/constants';
import { useContext, useEffect, useState } from 'react';
import { WsContext } from '@/contexts/ws';
import { CircleSlashIcon } from 'lucide-react';
import moment from 'moment';
import SummaryDialog from '../dialogs/summary';

export default function DeviceUsageGraph({ device, refetch }: Props) {
  const data: Array<{ name: string; total: number }> =
    device.DeviceData.DeviceDataPress.reduce((result, press) => {
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
    }, [] as typeof data);

  const getLevel = (value: number) => {
    let selected = levels[0];

    for (const level of levels) {
      if (value >= level.min) {
        selected = level;
      }
    }

    return selected;
  };

  const socket = useContext(WsContext);
  const [selectedData, setSelectedData] = useState<{
    name: string;
    total: number;
  } | null>(null);
  const [summaryDialogIsOpen, setSummaryDialogIsOpen] =
    useState<boolean>(false);

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

  useEffect(() => {
    setSummaryDialogIsOpen(selectedData !== null);
  }, [selectedData]);

  return (
    <div className='m-4'>
      <Card>
        <CardHeader>
          <CardTitle>Usage</CardTitle>
          <CardDescription>
            Number of presses for the last 5 months
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.length < 1 && (
            <p className='text-sm text-muted-foreground font-bold'>
              <CircleSlashIcon className='inline-block mr-2' />
              Not available
            </p>
          )}
          {data.length > 1 && (
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
                    setSelectedData({
                      name: e.name,
                      total: e.total,
                    });
                  }}
                  onBlur={() => setSelectedData(null)}
                >
                  {data?.map((data) => (
                    <Cell key={data.name} fill={getLevel(data.total).color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          <SummaryDialog
            data={selectedData}
            isOpen={summaryDialogIsOpen}
            onOpenChange={setSummaryDialogIsOpen}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export interface Props {
  device: Device;
  refetch: () => void;
}
