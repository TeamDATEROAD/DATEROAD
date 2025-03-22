'use client';

import { useEffect, useState } from 'react';
import { AdminUserResponse, CourseResponse } from '@/types/admin';
import { getUserDetail, getUserCourses } from '@/lib/api/admin';
import Image from 'next/image';
import { formatDate } from '@/lib/utils';

interface UserDetailModalProps {
  userId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function UserDetailModal({ userId, isOpen, onClose }: UserDetailModalProps) {
  const [user, setUser] = useState<AdminUserResponse | null>(null);
  const [courses, setCourses] = useState<CourseResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !userId) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [userDetail, userCourses] = await Promise.all([
          getUserDetail(userId),
          getUserCourses(userId)
        ]);
        setUser(userDetail);
        setCourses(userCourses);
      } catch (err) {
        setError(err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">사용자 상세 정보</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <span className="sr-only">닫기</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">{error}</div>
        ) : user ? (
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <Image
                src={user.profileImage || '/default-avatar.png'}
                alt={user.name}
                width={64}
                height={64}
                className="rounded-full"
              />
              <div>
                <h3 className="text-xl font-semibold">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-gray-600">닉네임</p>
                <p className="font-medium">{user.nickname}</p>
              </div>
              <div>
                <p className="text-gray-600">상태</p>
                <p className={`font-medium ${user.status === 'BANNED' ? 'text-red-500' : 'text-green-500'}`}>
                  {user.status === 'BANNED' ? '정지됨' : '활성'}
                </p>
              </div>
              <div>
                <p className="text-gray-600">경고 횟수</p>
                <p className="font-medium">{user.warningCount}</p>
              </div>
              <div>
                <p className="text-gray-600">가입일</p>
                <p className="font-medium">{formatDate(user.createdAt)}</p>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-3">작성한 코스 ({courses.length})</h4>
              <div className="space-y-4">
                {courses.map(course => (
                  <div key={course.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h5 className="font-medium">{course.title}</h5>
                        <p className="text-sm text-gray-600">
                          {course.country}, {course.city}
                        </p>
                        <p className="text-sm text-gray-600">
                          {formatDate(course.date)} {course.time}
                        </p>
                      </div>
                      <p className="text-lg font-semibold">
                        {course.cost.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
} 