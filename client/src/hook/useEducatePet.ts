import {
  useMutation,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import axios, { type AxiosError } from 'axios';
import type { IPet } from './usePet.ts';

export const useEducatePet = (): UseMutationResult<
  IPet,
  AxiosError,
  string,
  unknown
> => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (petId: string) => {
      const res = await axios.post<IPet>(
        `${import.meta.env.VITE_URL_SERVER}/api/pets/educate`,
        { petId },
      );
      return res.data;
    },
    onSettled: (data) => {
      if (data?.ownerId) {
        queryClient.invalidateQueries({
          queryKey: ['Pet', data.ownerId],
        });
      }
    },
  });
};
