import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';

export interface AuthState {
  id: string;
  telegramId: string;
  username: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
  language: string;
  isPremium: boolean;
  coins: number;
  lastActive: string;
  createdAt: string;
  updatedAt: string;
}

export const useAuth = (
  webApp: WebApp | null,
): UseQueryResult<AuthState, AxiosError> => {
  return useQuery({
    queryKey: ['Auth', webApp?.initData],
    queryFn: async () => {
      const res = await axios.post(
        `${import.meta.env.VITE_URL_SERVER}/api/login`,
        {
          initData: webApp?.initData,
        },
      );
      return res.data;
    },
    enabled: !!webApp,
  });
};
