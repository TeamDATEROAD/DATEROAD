import { fetchWithAuth } from '@/lib/fetch';
import { AdminUserResponse, CourseResponse } from '@/types/admin';

export const getUserDetail = async (userId: number): Promise<AdminUserResponse> => {
  const response = await fetchWithAuth(`/api/admin/users/${userId}/detail`);
  if (!response.ok) throw new Error('사용자 정보를 불러오는데 실패했습니다.');
  return response.json();
};

export const getUserCourses = async (userId: number): Promise<CourseResponse[]> => {
  const response = await fetchWithAuth(`/api/admin/users/${userId}/courses`);
  if (!response.ok) throw new Error('사용자의 코스 목록을 불러오는데 실패했습니다.');
  return response.json();
}; 