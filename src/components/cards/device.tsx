import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { default as moment } from 'moment';
import { Button } from '@/components/ui/button';
import { BarChart4Icon, BellRingIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useContext } from 'react';
import { WsContext } from '@/contexts/ws';
import { TOPICS } from '@/lib/constants';
import { Link } from 'react-router-dom';
import DeviceUnbindDialog from '@/components/dialogs/device-unbind';

export default function Device({ device, refetch }: Props) {
  const socket = useContext(WsContext);

  return (
    <Card className='mb-4'>
      <CardHeader>
        <CardTitle>{device.deviceKey}</CardTitle>
        <CardDescription>
          Date activated: {moment(device.createdAt).format('YYYY-MM-DD')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className='flex justify-end gap-x-4'>
          <DeviceUnbindDialog device={device} refetch={refetch} />
          <Link to={`/device/${device.id}`}>
            <Button className='md:pl-3' title='Data'>
              <BarChart4Icon className='w-6 h-6 md:mr-2' />
              <span className='hidden md:inline'>Data</span>
            </Button>
          </Link>
          <Button
            className='md:pl-3'
            onClick={() =>
              socket?.emit(
                'mqtt:publish',
                `${TOPICS.A_RING}:${device.deviceKey}`,
                device.DeviceData.isRinging ? 'OFF' : 'ON',
              )
            }
            title='Ring'
          >
            <BellRingIcon
              className={cn(
                'w-6 h-6 md:mr-2',
                device.DeviceData.isRinging && 'animate-pulse text-yellow-400',
              )}
            />
            <span className='hidden md:inline'>Ring</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export interface Props {
  device: Device;
  refetch: () => void;
}
