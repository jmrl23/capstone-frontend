import { useDevices } from '@/hooks/useDevices';
import { Link, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import Loading from '@/routes/Loading';
import NotFound from '@/routes/Notfound';
import Container from '@/components/globals/container';
import DeviceUsageGraph from '@/components/graphs/device-usage';
import DeviceLogsTable from '@/components/tables/device-logs';
import MedicationsTable from '@/components/tables/medications';

export default function Device() {
  const params = useParams<{ id: string }>();
  const { data: devices, isLoading, refetch: refetchDevice } = useDevices();
  const device = devices.find((device) => device.id === params.id);

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
      <DeviceUsageGraph device={device} refetch={refetchDevice} />
      <MedicationsTable />
      <DeviceLogsTable device={device} />
    </Container>
  );
}
