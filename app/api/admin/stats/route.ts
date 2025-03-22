import { NextResponse } from "next/server"
import { config } from "@/lib/config"

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 })
    }

    const response = await fetch(
      `${config.apiBaseUrl}${config.endpoints.stats}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || "통계 정보를 불러오는데 실패했습니다." },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in admin stats GET route:", error)
    return NextResponse.json(
      { message: "통계 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
} 