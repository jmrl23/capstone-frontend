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
import { useContext, useEffect } from 'react';
import { WsContext } from '@/contexts/ws';
import moment from 'moment';

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
      if (value >= level.max) {
        selected = level;
      }
    }

    return selected;
  };

  const socket = useContext(WsContext);

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
          <CardTitle>Usage</CardTitle>
          <CardDescription>
            Number of presses for the last 5 months
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
                  <Cell key={name} fill={getLevel(total).color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}

export interface Props {
  device: Device;
  refetch: () => void;
}
