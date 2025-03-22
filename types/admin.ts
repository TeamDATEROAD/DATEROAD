export interface AdminUserResponse {
  id: number;
  email: string;
  name: string;
  nickname: string;
  profileImage: string | null;
  status: 'ACTIVE' | 'BANNED';
  warningCount: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface CourseResponse {
  id: number;
  title: string;
  description: string;
  thumbnail: string | null;
  country: string;
  city: string;
  cost: number;
  time: string;
  date: string;
  startAt: string;
  userId: number;
  userName: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
} 