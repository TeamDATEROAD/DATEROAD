"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Stats {
  totalUsers: number
  totalCourses: number
  totalReports: number
  activeUsers: number
  bannedUsers: number
  pendingReports: number
}

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalCourses: 0,
    totalReports: 0,
    activeUsers: 0,
    bannedUsers: 0,
    pendingReports: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const response = await fetch("/api/admin/stats", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      })

      if (!response.ok) {
        throw new Error("통계 정보를 불러오는데 실패했습니다.")
      }

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error("Error loading stats:", error)
      setError(error instanceof Error ? error.message : "통계 정보를 불러오는데 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-8">
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-6">대시보드</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg">총 사용자</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalUsers}</div>
            <div className="text-sm text-gray-500 mt-2">
              활성: {stats.activeUsers} | 정지: {stats.bannedUsers}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg">총 코스</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalCourses}</div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg">신고</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.totalReports}</div>
            <div className="text-sm text-gray-500 mt-2">
              처리 대기: {stats.pendingReports}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg">최근 활동</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">준비 중입니다...</p>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="text-lg">시스템 상태</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">준비 중입니다...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 