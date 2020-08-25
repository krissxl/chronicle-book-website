export interface Entry {
  id?: string;
  title?: string;
  text: string;
  created_at: Date;
  updated_at?: Date;
  time: Date;
  tags?: string[];
}

export interface User {
  id: string,
  name: string,
  email: string,
  entriesCount: {[key: string]: number}
}

export interface BackendResponse {
  error: boolean,
  message: string,
  code?: string,
  data?: any;
}