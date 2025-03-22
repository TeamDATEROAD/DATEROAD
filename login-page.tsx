"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { config } from "@/lib/config"

export default function LoginPage() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "로그인에 실패했습니다.")
      }

      if (data && data.token && data.token.accessToken) {
        localStorage.setItem("adminToken", data.token.accessToken)
        if (data.token.refreshToken) {
          localStorage.setItem("refreshToken", data.token.refreshToken)
        }
        localStorage.setItem("adminName", data.name || "관리자")
        window.location.href = "/"
      } else {
        throw new Error("로그인 응답에 토큰이 없습니다.")
      }
    } catch (error) {
      console.error("로그인 중 오류 발생:", error)
      setError(error instanceof Error ? error.message : "로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  // Demo login function for testing
  const handleDemoLogin = () => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Store mock token and name
      localStorage.setItem("adminToken", "mock-token-for-testing")
      localStorage.setItem("adminName", "테스트 관리자")

      // Redirect to admin dashboard
      window.location.href = "/"
    }, 1000)
  }

  // 로그인 페이지의 배경과 카드 스타일을 밝은 테마로 변경
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-8 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md bg-white border-purple-300 text-gray-800 mx-4 sm:mx-0">
        <CardHeader className="space-y-1 text-center p-4 sm:p-6">
          <CardTitle className="text-xl sm:text-2xl font-bold text-purple-600">데이트로드 관리자</CardTitle>
          <CardDescription className="text-sm sm:text-base text-gray-600">관리자 계정으로 로그인하세요</CardDescription>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="username" className="text-sm sm:text-base text-gray-700">
                아이디
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-9 sm:h-10 bg-white border-gray-300 text-gray-800 focus:border-purple-500 text-sm sm:text-base"
              />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="password" className="text-sm sm:text-base text-gray-700">
                비밀번호
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-9 sm:h-10 bg-white border-gray-300 text-gray-800 focus:border-purple-500 text-sm sm:text-base"
              />
            </div>

            {error && (
              <Alert variant="destructive" className="bg-red-100 border-red-300 text-red-800 text-sm sm:text-base p-3 sm:p-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full bg-purple-600 hover:bg-purple-700 text-white h-9 sm:h-10 text-sm sm:text-base" 
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2 h-3 w-3 sm:h-4 sm:w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  로그인 중...
                </span>
              ) : (
                "로그인"
              )}
            </Button>

            <div className="text-center">
              <Button
                type="button"
                variant="link"
                className="text-purple-600 hover:text-purple-700 text-sm sm:text-base p-0 h-auto"
                onClick={handleDemoLogin}
              >
                테스트 모드로 입장
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

