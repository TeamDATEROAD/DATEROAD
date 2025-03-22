import { NextResponse } from "next/server"
import { config } from "@/lib/config"

// API configuration
const API_BASE_URL = "https://api.date-road.p-e.kr"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 })
    }

    const response = await fetch(
      `${config.apiBaseUrl}${config.endpoints.course(params.id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || "코스 삭제에 실패했습니다." },
        { status: response.status }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in course DELETE route:", error)
    return NextResponse.json(
      { message: "코스 삭제에 실패했습니다." },
      { status: 500 }
    )
  }
}

