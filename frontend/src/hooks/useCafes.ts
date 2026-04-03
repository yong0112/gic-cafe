import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCafes, createCafe, updateCafe, deleteCafe } from '@/api/cafes';

export const useCafes = (location?: string) =>
  useQuery({
    queryKey: ['cafes', location],
    queryFn: () => getCafes(location),
  });

export const useCreateCafe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createCafe,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cafes'] }),
  });
};

export const useUpdateCafe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: FormData }) => updateCafe(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cafes'] }),
  });
};

export const useDeleteCafe = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteCafe,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cafes'] }),
  });
};
