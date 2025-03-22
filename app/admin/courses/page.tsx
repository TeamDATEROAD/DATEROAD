"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Trash2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import UserDetailModal from '@/components/admin/UserDetailModal'

interface Course {
  id?: string
  course_id?: string
  title?: string
  thumbnail?: string
  description?: string
  user?: {
    id?: string
    name?: string
  }
  createdAt?: string
  cost?: number
  time?: number
  date?: string
  startAt?: string
  country?: string
  city?: string
}

const safeGetCourseField = (course: Course | null, field: string, defaultValue: any = "") => {
  if (!course) return defaultValue;
  const fields = field.split(".")
  let value: any = course
  
  for (const f of fields) {
    value = value?.[f]
    if (value === undefined) return defaultValue
  }
  
  return value
}

const formatDate = (dateString?: string) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString("ko-KR")
}

// Base64로 인코딩된 기본 이미지 (회색 배경의 이미지 아이콘)
const DEFAULT_IMAGE_BASE64 = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0iIzljYTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=="

export default function CoursesPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const pageSize = 10

  useEffect(() => {
    loadCourses()
  }, [currentPage, searchQuery])

  const loadCourses = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `/api/courses?page=${currentPage}&size=${pageSize}${
          searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "코스 목록을 불러오는데 실패했습니다.")
      }

      const data = await response.json()
      setCourses(data.content || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Error loading courses:", error)
      setError(error instanceof Error ? error.message : "코스 목록을 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const confirmDelete = async (courseId: string) => {
    if (!window.confirm("정말로 이 코스를 삭제하시겠습니까?")) {
      return
    }

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "코스 삭제에 실패했습니다.")
      }

      await loadCourses()
    } catch (error) {
      console.error("Error deleting course:", error)
      setError(error instanceof Error ? error.message : "코스 삭제에 실패했습니다.")
    }
  }

  const viewUserDetails = (userId: string) => {
    router.push(`/admin/users/${userId}`)
  }

  const handleUserClick = (userId: string) => {
    console.log('사용자 버튼 클릭:', userId);
    if (!userId) {
      console.error('사용자 ID가 없습니다.');
      return;
    }
    setSelectedUserId(parseInt(userId));
    setIsUserModalOpen(true);
  }

  return (
    <div className="p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>코스 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              type="text"
              placeholder="코스 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          </div>
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={safeGetCourseField(course, "id", course.course_id || Math.random().toString())}
              className="bg-white rounded-lg shadow p-4 flex items-center gap-4 hover:bg-purple-50 transition-colors cursor-pointer"
              onClick={() => setSelectedCourse(course)}
            >
              <div className="w-16 h-16 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
                {safeGetCourseField(course, "thumbnail") ? (
                  <Image
                    src={safeGetCourseField(course, "thumbnail")}
                    alt={safeGetCourseField(course, "title")}
                    width={64}
                    height={64}
                    className="object-cover"
                    unoptimized
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null;
                      target.src = DEFAULT_IMAGE_BASE64;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-800">
                  {safeGetCourseField(course, "title")}
                </h3>
                <p className="text-sm text-gray-600">
                  작성자: {safeGetCourseField(course, "user.name")} | 생성일:{" "}
                  {formatDate(safeGetCourseField(course, "createdAt"))} | 비용:{" "}
                  {safeGetCourseField(course, "cost", 0)}원
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    const userId = course.user?.id;
                    console.log('코스:', course);
                    console.log('사용자 ID:', userId);
                    if (userId) {
                      handleUserClick(userId);
                    } else {
                      console.error('사용자 ID를 찾을 수 없습니다:', course);
                    }
                  }}
                >
                  <User className="h-4 w-4 mr-1" />
                  사용자
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-100 hover:bg-red-200 text-red-700"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmDelete(safeGetCourseField(course, "id", course.course_id));
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  삭제
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">코스가 없습니다.</div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage - 1)}
            disabled={currentPage === 0}
          >
            이전
          </Button>
          <span className="py-2 px-4 bg-white rounded">
            {currentPage + 1} / {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(currentPage + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            다음
          </Button>
        </div>
      )}

      {/* Course Detail Modal */}
      <Dialog open={selectedCourse !== null} onOpenChange={(open) => !open && setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {safeGetCourseField(selectedCourse, "title")}
            </DialogTitle>
            <DialogDescription>
              작성자: {safeGetCourseField(selectedCourse, "user.name")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedCourse?.thumbnail && (
              <div className="relative w-full h-64 rounded-lg overflow-hidden">
                <Image
                  src={selectedCourse.thumbnail}
                  alt={selectedCourse.title || ""}
                  fill
                  className="object-cover"
                  unoptimized
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.onerror = null;
                    target.src = "https://via.placeholder.com/600x400?text=No+Image";
                  }}
                />
              </div>
            )}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>위치:</strong> {safeGetCourseField(selectedCourse, "country")} {safeGetCourseField(selectedCourse, "city")}
              </div>
              <div>
                <strong>비용:</strong> {safeGetCourseField(selectedCourse, "cost", 0)}원
              </div>
              <div>
                <strong>소요 시간:</strong> {safeGetCourseField(selectedCourse, "time")}시간
              </div>
              <div>
                <strong>시작 시간:</strong> {safeGetCourseField(selectedCourse, "startAt")}
              </div>
              <div>
                <strong>날짜:</strong> {formatDate(safeGetCourseField(selectedCourse, "date"))}
              </div>
              <div>
                <strong>생성일:</strong> {formatDate(safeGetCourseField(selectedCourse, "createdAt"))}
              </div>
            </div>
            {selectedCourse?.description && (
              <div className="mt-4">
                <strong>설명:</strong>
                <p className="mt-1 text-gray-600 whitespace-pre-wrap">
                  {selectedCourse.description}
                </p>
              </div>
            )}
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  const userId = safeGetCourseField(selectedCourse, "user.id");
                  if (userId) {
                    setSelectedCourse(null);
                    viewUserDetails(userId);
                  }
                }}
              >
                <User className="h-4 w-4 mr-2" />
                사용자 정보 보기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 상세 정보 모달 */}
      {selectedUserId !== null && (
        <UserDetailModal
          userId={selectedUserId}
          isOpen={isUserModalOpen}
          onClose={() => {
            console.log('모달 닫기');
            setIsUserModalOpen(false);
            setSelectedUserId(null);
          }}
        />
      )}
    </div>
  )
} 