import { request } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { useHax } from '@/hooks/useHax';

export function useUser() {
  const hax = useHax();
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['user', 'session'],
    queryFn: () =>
      request<{ user: User | null }>(
        fetch(`${import.meta.env.VITE_BACKEND_URL}/user/session`, {
          credentials: 'include',
          cache: 'no-cache',
          headers: { ...hax.value },
        }),
      ),
  });

  const user = data instanceof Error ? null : data?.user ?? null;

  return {
    data: user,
    isLoading,
    refetch,
    isFetching,
    error,
  };
}
