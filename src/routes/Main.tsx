import { useContext, useEffect } from 'react';
import { WsContext } from '@/contexts/ws';
import { useDevices } from '@/hooks/useDevices';
import { TOPICS } from '@/lib/constants';
import Container from '@/components/global/container';
import Header from '@/components/global/header';
import Device from '@/components/cards/device';
import NoDevice from '@/components/cards/no-device';
import Loading from '@/routes/Loading';

export default function Main(props: Props) {
  const socket = useContext(WsContext);
  const { data: devices, isLoading, refetch } = useDevices();

  useEffect(() => {
    for (const device of devices) {
      for (const topic in TOPICS) {
        socket?.emit('mqtt:subscribe', `${topic}:${device.deviceKey}`);
      }
    }
  }, [devices, socket]);

  useEffect(() => {
    const callback = (data: MqttMessage) => {
      if (data.topic.parsed === TOPICS.A_SYNC) return refetch();
    };

    socket?.on('mqtt:message', callback);

    return () => {
      socket?.off('mqtt:message', callback);
    };
  }, [socket, refetch]);

  if (isLoading) return <Loading />;

  return (
    <Container>
      <Header
        user={props.user}
        refetchUser={props.refetch}
        refetchDevices={refetch}
      />
      <div className='p-4'>
        {devices.length < 1 && <NoDevice />}
        {devices.map((device) => (
          <Device key={device.id} device={device} refetch={refetch} />
        ))}
      </div>
    </Container>
  );
}

export interface Props {
  user: User;
  refetch: () => void;
}
