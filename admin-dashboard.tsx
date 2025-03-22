"use client"

import { useState, useEffect } from "react"
import { Search, LogOut, Trash2, ChevronLeft, ChevronRight, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { config } from "@/lib/config"

interface Course {
  id: string | number;
  course_id?: string;
  title: string;
  thumbnail?: string;
  createdAt: string;
  cost: number;
  user: {
    name: string;
  };
}

// Mock data for testing when API is not available
const mockCourses = [
  {
    id: 1,
    title: "서울 한강 데이트 코스",
    createdAt: "2023-05-15T14:30:00",
    cost: 50000,
    user: { name: "김철수" },
  },
  {
    id: 2,
    title: "부산 해운대 데이트 코스",
    createdAt: "2023-06-20T10:15:00",
    cost: 70000,
    user: { name: "이영희" },
  },
  {
    id: 3,
    title: "제주도 여행 코스",
    createdAt: "2023-07-05T09:45:00",
    cost: 150000,
    user: { name: "박지민" },
  },
  {
    id: 4,
    title: "강원도 스키 데이트",
    createdAt: "2023-12-10T08:30:00",
    cost: 120000,
    user: { name: "최수진" },
  },
  {
    id: 5,
    title: "인천 차이나타운 맛집 투어",
    createdAt: "2024-01-25T12:00:00",
    cost: 60000,
    user: { name: "정민준" },
  },
]

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [courseToDelete, setCourseToDelete] = useState<string | number | null>(null)
  const [adminName, setAdminName] = useState("")
  const [error, setError] = useState("")
  const [useMockData, setUseMockData] = useState(false)
  const [retryCount, setRetryCount] = useState(0)

  const pageSize = 10

  useEffect(() => {
    checkAuth()
    const storedName = localStorage.getItem("adminName")
    if (storedName) {
      setAdminName(storedName)
    }
  }, [])

  // 데이터 로딩 효과
  useEffect(() => {
    loadCourses()
  }, [currentPage, useMockData, retryCount])

  // 인증 체크
  function checkAuth() {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      window.location.href = "/login"
      return
    }
  }

  // 로그아웃
  function logout() {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("adminName")
    window.location.href = "/login"
  }

  // API 호출을 위한 기본 설정
  function getHeaders() {
    const token = localStorage.getItem("adminToken")
    return {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    }
  }

  // API 호출 함수들
  async function loadCourses() {
    if (useMockData) {
      // Use mock data if API is not available
      setCourses(mockCourses)
      setTotalPages(1)
      return
    }

    setLoading(true)
    setError("")

    try {
      // Call our Next.js API route instead of calling the external API directly
      const url = `/api/courses?page=${currentPage}&size=${pageSize}${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`
      console.log("Fetching from URL:", url)

      const response = await fetch(url, {
        headers: getHeaders(),
        cache: "no-store",
      })

      // Log the response status
      console.log("Response status:", response.status)

      // Get the response data
      let data
      try {
        data = await response.json()
        console.log("Response data:", data)
      } catch (e) {
        console.error("Error parsing JSON:", e)
        throw new Error("응답 데이터를 파싱하는 중 오류가 발생했습니다.")
      }

      if (!response.ok) {
        throw new Error(data.error || data.message || `HTTP error ${response.status}`)
      }

      // Check if the response has the expected structure
      if (data && Array.isArray(data.content)) {
        setCourses(data.content)
        setTotalPages(data.totalPages || 1)
      } else {
        console.error("Unexpected API response format:", data)
        setCourses([])
        setTotalPages(0)
        setError("API 응답 형식이 올바르지 않습니다.")
      }
    } catch (error) {
      console.error("코스 로딩 중 에러 발생:", error)
      setError(error instanceof Error ? error.message : "코스를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setLoading(false)
    }
  }

  async function deleteCourse(courseId: string | number) {
    if (useMockData) {
      // Simulate deletion with mock data
      setCourses(courses.filter((course) => course.id !== courseId))
      alert("코스가 성공적으로 삭제되었습니다.")
      return
    }

    try {
      // Call our Next.js API route instead of calling the external API directly
      const url = `/api/courses/${courseId}`
      console.log("Deleting course at URL:", url)

      const response = await fetch(url, {
        method: "DELETE",
        headers: getHeaders(),
        cache: "no-store",
      })

      // Log the response status
      console.log("Delete response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || errorData.message || `HTTP error ${response.status}`)
      }

      alert("코스가 성공적으로 삭제되었습니다.")
      loadCourses()
    } catch (error) {
      console.error("코스 삭제 중 에러 발생:", error)
      alert(error instanceof Error ? error.message : "코스 삭제 중 오류가 발생했습니다.")
    }
  }

  function confirmDelete(courseId: string | number) {
    setCourseToDelete(courseId)
    setShowDeleteModal(true)
  }

  function handleDeleteConfirm() {
    if (courseToDelete) {
      deleteCourse(courseToDelete)
      setShowDeleteModal(false)
      setCourseToDelete(null)
    }
  }

  function changePage(page: number) {
    setCurrentPage(page)
  }

  function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchQuery(e.target.value)
    setCurrentPage(0)

    // Debounce search
    const timeoutId = setTimeout(() => {
      loadCourses()
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  function formatDate(dateString: string) {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "날짜 정보 없음"
    }
  }

  // Function to retry loading courses
  function retryLoading() {
    setError("")
    setRetryCount((prev) => prev + 1)
  }

  // Toggle between real API and mock data
  function toggleMockData() {
    setUseMockData(!useMockData)
  }

  // 코스 데이터 필드 안전하게 접근
  function safeGetCourseField(course: Course, field: string, defaultValue: any = "") {
    const fields = field.split(".");
    let value: any = course;
    
    for (const f of fields) {
      value = value?.[f];
      if (value === undefined) return defaultValue;
    }
    
    return value;
  }

  // 관리자 대시보드의 배경과 컴포넌트 스타일을 밝은 테마로 변경

  // 헤더 부분 변경
  return (
    <div className="min-h-screen bg-white text-gray-800">
      {/* Header */}
      <header className="border-b border-purple-200 bg-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-purple-600">데이트로드 관리자 페이지</h1>
          <div className="flex items-center gap-4">
            {adminName && <span className="text-purple-600">{adminName}님 환영합니다</span>}
            <Button
              variant="outline"
              className="border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-700"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search Bar and Mock Data Toggle */}
        <div className="mb-6 flex gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-purple-500" />
            </div>
            <Input
              type="text"
              placeholder="코스 제목 또는 작성자 검색..."
              className="pl-10 bg-white border-purple-200 text-gray-800 focus:border-purple-500 focus:ring-purple-500"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Button
            variant={useMockData ? "default" : "outline"}
            className={
              useMockData
                ? "bg-purple-600 hover:bg-purple-700 text-white"
                : "border-purple-300 text-purple-600 hover:bg-purple-50"
            }
            onClick={toggleMockData}
          >
            {useMockData ? "실제 데이터 사용" : "테스트 데이터 사용"}
          </Button>
        </div>

        {/* Error Message */}
        {error && !useMockData && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-800">
            <p className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2" />
              {error}
            </p>
            <div className="mt-2 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="border-red-300 text-red-700 hover:bg-red-50"
                onClick={retryLoading}
              >
                다시 시도
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
                onClick={toggleMockData}
              >
                테스트 데이터로 전환
              </Button>
            </div>
          </div>
        )}

        {/* Course List */}
        <Card className="bg-white border-purple-200 mb-6">
          <CardContent className="p-0">
            {loading && !useMockData ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
              </div>
            ) : courses.length > 0 ? (
              <div className="divide-y divide-purple-100">
                {courses.map((course) => (
                  <div
                    key={safeGetCourseField(course, "id", course.course_id || Math.random().toString())}
                    className="p-4 flex justify-between items-center hover:bg-purple-50 transition-colors"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{safeGetCourseField(course, "title")}</h3>
                      <p className="text-sm text-gray-600">
                        작성자: {safeGetCourseField(course, "user.name")} | 생성일:{" "}
                        {formatDate(safeGetCourseField(course, "createdAt"))} | 비용:{" "}
                        {safeGetCourseField(course, "cost", 0)}원
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="bg-red-100 hover:bg-red-200 text-red-700"
                      onClick={() => confirmDelete(safeGetCourseField(course, "id", course.course_id))}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      삭제
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-gray-500">
                {error && !useMockData ? "데이터를 불러올 수 없습니다." : "검색 결과가 없습니다."}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="flex justify-center gap-2">
            {currentPage > 0 && (
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
                onClick={() => changePage(currentPage - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
                이전
              </Button>
            )}

            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i}
                variant={i === currentPage ? "default" : "outline"}
                size="sm"
                className={
                  i === currentPage
                    ? "bg-purple-600 hover:bg-purple-700 text-white"
                    : "border-purple-300 text-purple-600 hover:bg-purple-50"
                }
                onClick={() => changePage(i)}
              >
                {i + 1}
              </Button>
            ))}

            {currentPage < totalPages - 1 && (
              <Button
                variant="outline"
                size="sm"
                className="border-purple-300 text-purple-600 hover:bg-purple-50"
                onClick={() => changePage(currentPage + 1)}
              >
                다음
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="bg-white border-purple-200 text-gray-800">
          <DialogHeader>
            <DialogTitle className="text-purple-600">삭제 확인</DialogTitle>
            <DialogDescription className="text-gray-600">정말로 이 코스를 삭제하시겠습니까?</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
              onClick={() => setShowDeleteModal(false)}
            >
              취소
            </Button>
            <Button
              variant="destructive"
              className="bg-red-100 hover:bg-red-200 text-red-700"
              onClick={handleDeleteConfirm}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

