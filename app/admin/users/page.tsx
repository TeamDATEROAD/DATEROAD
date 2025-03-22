"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Ban, Eye } from "lucide-react"
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

interface User {
  id: string
  name: string
  email: string
  nickname: string
  profileImage?: string
  role: "USER" | "ADMIN"
  status: "ACTIVE" | "BANNED"
  warningCount: number
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

interface Course {
  id: string
  title: string
  thumbnail?: string
  description?: string
  cost: number
  time: number
  date: string
  startAt: string
  country: string
  city: string
  createdAt: string
  updatedAt: string
  deletedAt?: string
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("ko-KR")
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<User[]>([])
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userCourses, setUserCourses] = useState<Course[]>([])
  const pageSize = 10

  useEffect(() => {
    loadUsers()
  }, [currentPage, searchQuery])

  const loadUsers = async () => {
    setLoading(true)
    setError("")

    try {
      const response = await fetch(
        `/api/users?page=${currentPage}&size=${pageSize}${
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
        throw new Error(data.message || "사용자 목록을 불러오는데 실패했습니다.")
      }

      const data = await response.json()
      setUsers(data.content || [])
      setTotalPages(data.totalPages || 1)
    } catch (error) {
      console.error("Error loading users:", error)
      setError(error instanceof Error ? error.message : "사용자 목록을 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  const loadUserCourses = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}/courses`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })

      if (!response.ok) {
        throw new Error("사용자의 코스 목록을 불러오는데 실패했습니다.")
      }

      const data = await response.json()
      setUserCourses(data || [])
    } catch (error) {
      console.error("Error loading user courses:", error)
      setError(error instanceof Error ? error.message : "사용자의 코스 목록을 불러오는데 실패했습니다.")
    }
  }

  const handleUserClick = async (user: User) => {
    setSelectedUser(user)
    await loadUserCourses(user.id)
  }

  const handleBanUser = async (userId: string) => {
    if (!window.confirm("정말로 이 사용자를 정지하시겠습니까?")) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}/ban`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "사용자 정지에 실패했습니다.")
      }

      await loadUsers()
      if (selectedUser?.id === userId) {
        setSelectedUser(null)
      }
    } catch (error) {
      console.error("Error banning user:", error)
      setError(error instanceof Error ? error.message : "사용자 정지에 실패했습니다.")
    }
  }

  const viewCourse = (courseId: string) => {
    router.push(`/admin/courses/${courseId}`)
  }

  return (
    <div className="p-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>사용자 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              type="text"
              placeholder="사용자 검색..."
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
        ) : users.length > 0 ? (
          users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-lg shadow p-4 flex items-center gap-4 hover:bg-purple-50 transition-colors cursor-pointer"
              onClick={() => handleUserClick(user)}
            >
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-gray-800">
                  {user.name} ({user.nickname})
                </h3>
                <p className="text-sm text-gray-600">
                  이메일: {user.email} | 역할: {user.role === "ADMIN" ? "관리자" : "일반 사용자"} | 
                  상태: {user.status === "BANNED" ? "정지됨" : "활성"} | 
                  경고: {user.warningCount}회
                </p>
                <p className="text-sm text-gray-500">
                  가입일: {formatDate(user.createdAt)}
                  {user.deletedAt && ` | 탈퇴일: ${formatDate(user.deletedAt)}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-100 hover:bg-red-200 text-red-700"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleBanUser(user.id)
                  }}
                >
                  <Ban className="h-4 w-4 mr-1" />
                  정지
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">사용자가 없습니다.</div>
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

      {/* User Detail Modal */}
      <Dialog open={selectedUser !== null} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
              {selectedUser?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>닉네임:</strong> {selectedUser?.nickname}
              </div>
              <div>
                <strong>이름:</strong> {selectedUser?.name}
              </div>
              <div>
                <strong>역할:</strong> {selectedUser?.role === "ADMIN" ? "관리자" : "일반 사용자"}
              </div>
              <div>
                <strong>상태:</strong> {selectedUser?.status === "BANNED" ? "정지됨" : "활성"}
              </div>
              <div>
                <strong>경고:</strong> {selectedUser?.warningCount}회
              </div>
              <div>
                <strong>가입일:</strong> {selectedUser && formatDate(selectedUser.createdAt)}
              </div>
              {selectedUser?.deletedAt && (
                <div>
                  <strong>탈퇴일:</strong> {formatDate(selectedUser.deletedAt)}
                </div>
              )}
              <div>
                <strong>최근 수정일:</strong> {selectedUser && formatDate(selectedUser.updatedAt)}
              </div>
            </div>
            
            <div className="mt-6">
              <h4 className="font-semibold mb-2">작성한 코스</h4>
              {userCourses.length > 0 ? (
                <div className="space-y-2">
                  {userCourses.map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <div>
                        <p className="font-medium">{course.title}</p>
                        <p className="text-sm text-gray-500">
                          위치: {course.country} {course.city} | 
                          비용: {course.cost}원 | 
                          시간: {course.time}시간 |
                          작성일: {formatDate(course.createdAt)}
                          {course.deletedAt && ` | 삭제일: ${formatDate(course.deletedAt)}`}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewCourse(course.id)}
                          className="bg-blue-50 hover:bg-blue-100 text-blue-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          보기
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">작성한 코스가 없습니다.</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 