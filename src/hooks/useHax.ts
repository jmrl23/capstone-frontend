import { create } from 'zustand';

export const useHax = create<AuthorizationProps>()((set) => ({
  value: {},
  setValue: (cid) =>
    set({
      value: {
        Authorization: `Bearer ${cid}`,
      },
    }),
  reset: () => set({ value: {} }),
}));

export interface AuthorizationProps {
  value:
    | {
        Authorization: string;
      }
    | Record<string, string>;
  setValue: (cid: string) => void;
  reset: () => void;
}
