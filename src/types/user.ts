
export interface User {
  id: string;
  email?: string;
  created_at?: string;
  user_metadata?: {
    [key: string]: any;
  };
}
