import client from './client';
import type { Employee } from '@/types';

export const getEmployees = async (cafe?: string): Promise<Employee[]> => {
  const res = await client.get('/employees', { params: cafe ? { cafe } : {} });
  return res.data.data;
};

export const createEmployee = async (data: Record<string, unknown>): Promise<Employee> => {
  const res = await client.post('/employees', data);
  return res.data.data;
};

export const updateEmployee = async (id: string, data: Record<string, unknown>): Promise<Employee> => {
  const res = await client.put(`/employees/${id}`, data);
  return res.data.data;
};

export const deleteEmployee = async (id: string): Promise<void> => {
  await client.delete(`/employees/${id}`);
};
