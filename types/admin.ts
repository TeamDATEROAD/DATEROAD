export interface AdminUserResponse {
  id: number;
  name: string;
  platformUserId: string;
  platForm: string;
  imageUrl: string | null;
  profileImage: string | null;
  status: string;
  free: number;
  totalPoint: number;
  createdAt: string;
  lastModifiedAt: string;
}

export interface CourseResponse {
  id: string;
  title: string;
  country: string;
  city: string;
  date: string;
  time: string;
  cost: number;
} 