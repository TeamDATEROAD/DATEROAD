import { fetchWithAuth } from '@/lib/fetch';
import { AdminUserResponse, CourseResponse } from '@/types/admin';

// 사용자 상세 정보 조회
export const getUserDetail = async (userId: number): Promise<AdminUserResponse> => {
  console.log('getUserDetail 호출:', userId);
  const response = await fetchWithAuth(`/api/admin/users/${userId}/detail`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '사용자 정보를 불러오는데 실패했습니다.');
  }
  return response.json();
};

// 사용자의 코스 목록 조회
export const getUserCourses = async (userId: number): Promise<CourseResponse[]> => {
  console.log('getUserCourses 호출:', userId);
  const response = await fetchWithAuth(`/api/admin/users/${userId}/courses`);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || '사용자의 코스 목록을 불러오는데 실패했습니다.');
  }
  return response.json();
}; 