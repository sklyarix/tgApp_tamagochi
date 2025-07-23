import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';

export interface IPet {
  id: string;
  name: string;
  level: number;
  hunger: number;
  happiness: number;
  energy: number;
  health: number;
  knowledge: number;
  feedBonus: number;
  happyBonus: number;
  lastFeed: string | null;
  lastPlay: string | null;
  lastSleep: string | null;
  lastEducate: string | null;
  accessories: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export const usePet = (
  userId: string | undefined,
): UseQueryResult<IPet, AxiosError> => {
  return useQuery({
    queryKey: ['Pet', userId],
    queryFn: async () => {
      const res = await axios.get<IPet>(
        `${import.meta.env.VITE_URL_SERVER}/api/pets/my?userId=${userId}`,
      );
      return res.data;
    },
    enabled: !!userId,
  });
};
