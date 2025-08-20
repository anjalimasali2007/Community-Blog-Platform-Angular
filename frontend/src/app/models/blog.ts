export interface Blog {
  id?: number;
  title: string;
  content: string;
  author?: string;
  createdAt?: string | Date; // ISO string from backend
  updatedAt?: string;
}
