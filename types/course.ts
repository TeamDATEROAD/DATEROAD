export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  cost: number;
  time: string;
  date: string;
  startAt: string;
  country: string;
  city: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  user: {
    id: number;
    name: string;
    email: string;
  };
} 