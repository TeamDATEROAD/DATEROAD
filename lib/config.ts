// API URL 설정
export const config = {
  // API 기본 URL
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.dateroad-main.p-e.kr',
  
  // API 엔드포인트
  endpoints: {
    login: "/api/v1/admin/login",
    adminPage: "/api/v1/admin",
    courses: "/api/v1/admin/courses",
    users: "/api/v1/admin/users",
    warnings: "/api/v1/admin/warnings",
    stats: "/api/v1/admin/stats",
    userCourses: (userId: string) => `/api/v1/admin/users/${userId}/courses`,
    userBan: (userId: string) => `/api/v1/admin/users/${userId}/ban`,
    course: (courseId: string) => `/api/v1/admin/courses/${courseId}`,
    adminUserDetail: (userId: string) => `/api/v1/admin/users/${userId}/detail`,
  },

  // API URL 생성 함수
  getApiUrl: function(endpoint: string) {
    return this.apiBaseUrl + endpoint;
  }
}; 