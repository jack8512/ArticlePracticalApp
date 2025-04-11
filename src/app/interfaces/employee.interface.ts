export interface Employee {
  last_name: string;
  phone: string;
  first_name: string;
  birth_date: string;  // 可以根據需求使用 Date 類型
  salary: number;
  department: string;
  created_at: string;  // 如果需要處理日期，可以考慮使用 Date 類型
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
  employees: Employee[];
  message?: any;
}
