export interface Cafe {
  id: string;
  name: string;
  description: string;
  employees: number;
  logo?: string;
  location: string;
}

export interface Employee {
  id: string;
  name: string;
  email_address: string;
  phone_number: string;
  gender: 'Male' | 'Female';
  days_worked: number;
  cafe: string;
}
