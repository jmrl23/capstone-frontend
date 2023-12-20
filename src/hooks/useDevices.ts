import { request } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useHax } from '@/hooks/useHax';

export function useDevices() {
  const hax = useHax();
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['device', 'list'],
    queryFn: () =>
      request<{ devices: Device[] }>(
        fetch(`${import.meta.env.VITE_BACKEND_URL}/device/list`, {
          credentials: 'include',
          cache: 'no-cache',
          headers: { ...hax.value },
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
