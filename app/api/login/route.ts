import { NextResponse } from "next/server"
import { config } from "@/lib/config"

// API configuration
const API_BASE_URL = "https://api.date-road.p-e.kr"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()
    const { username, password } = body

    // Forward the request to the actual API
    const response = await fetch(`${config.apiBaseUrl}${config.endpoints.login}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    })

    if (!response.ok) {
      const data = await response.json()
      return NextResponse.json(
        { message: data.message || "로그인에 실패했습니다." },
        { status: response.status }
      )
    }

    // Get the response data
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in login POST route:", error)
    return NextResponse.json(
      { message: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

