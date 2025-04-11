export interface Employee {
  last_name: string;
  phone: string;
  first_name: string;
  birth_date: string;
  salary: number;
  department: string;
  created_at: string;
  email: string;
  id: number;
  address: string;
  gender: string;
  experience: number;
  is_married: boolean;
  updated_at: string;
  username: string;
  password: string;
}

export interface ApiResponse {
  employees: Employee;
  message?: any;
}
