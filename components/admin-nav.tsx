"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Users, BookOpen, AlertTriangle, LogOut } from "lucide-react"

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

  return (
    <div className="flex flex-col h-full border-r bg-white">
      <div className="p-6 border-b">
        <h2 className="text-2xl font-bold text-purple-600">데이트로드 관리자</h2>
        <p className="text-sm text-gray-600 mt-1">안녕하세요, {adminName}님</p>
      </div>
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                  pathname === item.href
                    ? "bg-purple-50 text-purple-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="p-4 border-t">
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
  )
} 