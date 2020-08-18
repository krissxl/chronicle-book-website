export interface Entry {
  id?: string;
  title?: string;
  text: string;
  created_at: Date;
  updated_at?: Date;
}

export interface User {
  id: string | null,
  name: string | null,
  email: string | null
}

export interface BackendResponse {
  error: boolean,
  message: string,
  code?: string,
  data?: any;
}