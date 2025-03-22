"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, AlertTriangle, LogOut, Menu, X } from "lucide-react"

const navItems = [
  {
    title: "코스 관리",
    href: "/admin/courses",
    icon: BookOpen,
  },
  {
    title: "사용자 관리",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "신고 관리",
    href: "/admin/warnings",
    icon: AlertTriangle,
  },
]

interface AdminNavProps {
  adminName: string;
  onLogout: () => void;
}

export function AdminNav({ adminName, onLogout }: AdminNavProps) {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <>
      {/* 모바일 헤더 */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
          <h2 className="font-bold text-purple-600 text-lg">데이트로드</h2>
        </div>
        <p className="text-sm text-gray-600">{adminName}님</p>
      </div>

      {/* 모바일 메뉴 오버레이 */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <div className={cn(
        "fixed lg:sticky top-0 left-0 h-full w-64 border-r bg-white z-50 transform transition-transform duration-200 ease-in-out",
        "lg:transform-none",
        isMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-4 lg:p-6 border-b hidden lg:block">
            <h2 className="text-xl lg:text-2xl font-bold text-purple-600">데이트로드 관리자</h2>
            <p className="text-sm text-gray-600 mt-1">안녕하세요, {adminName}님</p>
          </div>
          <div className="flex-1 p-4 overflow-y-auto pt-20 lg:pt-4">
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
                      pathname === item.href
                        ? "bg-purple-50 text-purple-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4 flex-shrink-0" />
                    <span>{item.title}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="p-4 border-t mt-auto">
            <Button
              variant="outline"
              className="w-full justify-start gap-2"
              onClick={onLogout}
            >
              <LogOut className="h-4 w-4" />
              로그아웃
            </Button>
          </div>
        </div>
      </div>
    </>
  )
} 