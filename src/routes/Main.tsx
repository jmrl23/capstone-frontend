import { useContext, useEffect, useState } from 'react';
import { WsContext } from '@/contexts/ws';
import { useDevices } from '@/hooks/useDevices';
import { NavigationContents, MqttTopics } from '@/lib/constants';
import Container from '@/components/globals/container';
import Header from '@/components/globals/header';
import Loading from '@/routes/Loading';
import Navigation from '@/components/globals/navigation';
import Devices from '@/components/contents/devices';
import Learn from '@/components/contents/learn';

export default function Main(props: Props) {
  const [content, setContent] = useState<NavigationContents>(
    NavigationContents.devices,
  );
  const socket = useContext(WsContext);
  const { data: devices, isLoading, refetch } = useDevices();

  useEffect(() => {
    for (const device of devices) {
      for (const topic in MqttTopics) {
        socket?.emit('mqtt:subscribe', `${topic}:${device.deviceKey}`);
      }
    }
  }, [devices, socket]);

  useEffect(() => {
    const callback = (data: MqttMessage) => {
      if (data.topic.parsed === MqttTopics.A_SYNC) return refetch();
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
      <div className='p-4 mb-14'>
        {content === NavigationContents.devices && (
          <Devices devices={devices} refetch={refetch} />
        )}
        {content === NavigationContents.learn && <Learn />}
      </div>
      <Navigation setContent={setContent} />
    </Container>
  );
}

export interface Props {
  user: User;
  refetch: () => void;
}
