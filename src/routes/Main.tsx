import { useContext, useEffect } from 'react';
import { WsContext } from '@/contexts/ws';
import { useDevices } from '@/hooks/useDevices';
import { TOPICS } from '@/lib/constants';
import Container from '@/components/global/container';
import Header from '@/components/global/header';

export default function Main(props: Props) {
  const socket = useContext(WsContext);
  const { data: devices } = useDevices();

  useEffect(() => {
    for (const device of devices) {
      socket?.emit('mqtt:subscribe', `${TOPICS.I_PRESS}:${device.device_key}`);
      socket?.emit('mqtt:subscribe', `${TOPICS.A_RING}:${device.device_key}`);
      socket?.emit('mqtt:subscribe', `${TOPICS.B_SYNC}:${device.device_key}`);
      socket?.emit('mqtt:subscribe', `${TOPICS.I_SYNC}:${device.device_key}`);
      socket?.emit('mqtt:subscribe', `${TOPICS.A_SYNC}:${device.device_key}`);
    }
  }, [socket, devices]);

  return (
    <Container>
      <Header {...props} />
    </Container>
  );
}

export interface Props {
  user: User;
  refetch: () => void;
}
