"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [adminName, setAdminName] = useState("")

  useEffect(() => {
    checkAuth()
    const storedName = localStorage.getItem("adminName")
    if (storedName) {
      setAdminName(storedName)
    }
  }, [])

  function checkAuth() {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/login")
      return
    }
  }

  function logout() {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("refreshToken")
    localStorage.removeItem("adminName")
    router.push("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-semibold text-purple-600">
                데이트로드 관리자
              </span>
              <div className="ml-10 flex items-baseline space-x-4">
                <a
                  href="/admin/dashboard"
                  className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  대시보드
                </a>
                <a
                  href="/admin/courses"
                  className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  코스 관리
                </a>
                <a
                  href="/admin/users"
                  className="text-gray-600 hover:text-purple-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  사용자 관리
                </a>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {adminName}님 환영합니다
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" />
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </nav>
      <main className="container mx-auto">{children}</main>
    </div>
  )
} 