export interface User {
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
  token?:string
}

export interface ApiResponse {
  message?: any;
  status?:boolean;
  token?: any;
  data?: any
}

export interface Article{
  _id?: string;
  title: string;
  author: string;
  content: string;
  date: Date | string;
  userId?: string | null;
}

