export interface Entry {
  id?: Number;
  title?: String;
  text: String;
  created_at: Date;
  updated_at?: Date;
}

export interface User {
  id: String | null,
  name: String | null,
  email: String | null
}

export interface BackendResponse {
  error: Boolean,
  message: String,
  code?: String,
  data?: any;
}