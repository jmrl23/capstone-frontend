import { request } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export function useDevices() {
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['device', 'list'],
    queryFn: () =>
      request<{ devices: Device[] }>(
        fetch('/api/device/list', {
          credentials: 'include',
        }),
      ),
  });

  const devices = data instanceof Error ? [] : data?.devices ?? [];
  console.log(devices);
  return {
    data: devices,
    isLoading,
    refetch,
    isFetching,
    error,
  };
}
