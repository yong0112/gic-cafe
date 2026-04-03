import client from './client';
import type { Cafe } from '@/types';

export const getCafes = async (location?: string): Promise<Cafe[]> => {
  const res = await client.get('/cafes', { params: location ? { location } : {} });
  return res.data.data;
};

export const createCafe = async (data: FormData): Promise<Cafe> => {
  const res = await client.post('/cafes', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

export const updateCafe = async (id: string, data: FormData): Promise<Cafe> => {
  const res = await client.put(`/cafes/${id}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

export const deleteCafe = async (id: string): Promise<void> => {
  await client.delete(`/cafes/${id}`);
};
