import { request } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export function useDevices() {
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['device', 'list'],
    queryFn: () =>
      request<{ devices: Device[] }>(
        fetch(`${import.meta.env.VITE_BACKEND_URL}/device/list`, {
          credentials: 'include',
          cache: 'no-cache',
        }),
      ),
  });

  const devices = data instanceof Error ? [] : data?.devices ?? [];

  return {
    data: devices,
    isLoading,
    refetch,
    isFetching,
    error,
  };
}
