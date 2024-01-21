import { request } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useHax } from '@/hooks/useHax';

export function useDeviceDataPressList(
  deviceId: string,
  createdAtFrom?: string,
  createdAtTo?: string,
) {
  const hax = useHax();
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['device', 'press-list', deviceId, createdAtFrom, createdAtTo],
    queryFn: () =>
      request<{ list: DeviceDataPress[] }>(
        fetch(`${import.meta.env.VITE_BACKEND_URL}/device/press-list`, {
          method: 'POST',
          credentials: 'include',
          cache: 'no-cache',
          headers: {
            'Content-Type': 'application/json',
            ...hax.value,
          },
          body: JSON.stringify({
            device_id: deviceId,
            created_at_from: createdAtFrom,
            created_at_to: createdAtTo,
          }),
        }),
      ),
  });

  const devices = data instanceof Error ? [] : data?.list ?? [];

  return {
    data: devices.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    ),
    isLoading,
    refetch,
    isFetching,
    error,
  };
}
