import { NextResponse } from "next/server"
import config from "@/lib/config"

// API configuration
const API_BASE_URL = "https://api.date-road.p-e.kr"

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json()

    // Forward the request to the actual API
    const response = await fetch(config.getApiUrl(config.endpoints.login), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })

    // Get the response data
    const data = await response.json()

    // Return the response with appropriate status
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "로그인 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

