import { SafeHtml } from "@angular/platform-browser";

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
}

export interface ApiResponse {
  user: User;
  message?: any;
  token?: any;
}

export interface Article{
  id: number;
  title: string;
  author: string;
  content: string;
  date: Date | string;
}

