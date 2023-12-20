import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export const useHax = create<HaxProps>()(
  persist(
    (set) => ({
      value: {},
      setValue: (cid) =>
        set({
          value: {
            Authorization: `Bearer ${cid}`,
          },
        }),
      reset: () => set({ value: {} }),
    }),
    {
      name: 'hax',
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export interface HaxProps {
  value:
    | {
        Authorization: string;
      }
    | Record<string, string>;
  setValue: (cid: string) => void;
  reset: () => void;
}
