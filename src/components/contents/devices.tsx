import Device from '@/components/cards/device';
import NoDevice from '@/components/cards/no-device';

export default function Devices({ devices, refetch }: Props) {
  return (
    <>
      {devices.length < 1 && <NoDevice />}
      {devices.map((device) => (
        <Device key={device.id} device={device} refetch={refetch} />
      ))}
    </>
  );
}

export interface Props {
  devices: Device[];
  refetch: () => void;
}
