import { request } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

export function useUser() {
  const { data, isLoading, refetch, isFetching, error } = useQuery({
    queryKey: ['user', 'session'],
    queryFn: () =>
      request<{ user: User | null }>(
        fetch('/api/user/session', {
          credentials: 'include',
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
