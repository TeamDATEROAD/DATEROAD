"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminNav } from "@/components/admin-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
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
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-[auto,1fr]">
      <AdminNav adminName={adminName} onLogout={logout} />
      <main className="min-h-screen bg-gray-50">
        {children}
      </main>
    </div>
  )
} 