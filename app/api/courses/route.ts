import { NextResponse } from "next/server"
import { config } from "@/lib/config"

// API configuration
const API_BASE_URL = "https://api.date-road.p-e.kr"

export async function GET(request: Request) {
  try {
    // Get the URL and search params
    const { searchParams } = new URL(request.url)
    const page = searchParams.get("page") || "0"
    const size = searchParams.get("size") || "10"
    const search = searchParams.get("search") || ""

    // Get the authorization header
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
      return NextResponse.json({ message: "인증이 필요합니다." }, { status: 401 })
    }

    // Log the request for debugging
    console.log(`Fetching courses: page=${page}, size=${size}, search=${search}`)
    console.log(`Auth header: ${authHeader.replace(/Bearer\s+(.{10}).*/, "Bearer $1...")}`)

    // Forward the request to the actual API
    const response = await fetch(
      `${config.apiBaseUrl}${config.endpoints.courses}?page=${page}&size=${size}${
        search ? `&search=${encodeURIComponent(search)}` : ''
      }`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { message: errorData.message || "코스 목록을 불러오는데 실패했습니다." },
        { status: response.status }
      )
    }

    // Get the response data
    const data = await response.json()

    // Transform the response data
    const transformedContent = data.content.map((course: any) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail,
      cost: course.cost,
      time: course.time,
      date: course.date,
      startAt: course.startAt,
      country: course.country,
      city: course.city,
      user: {
        id: course.userId,
        name: course.userName
      },
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      deletedAt: course.deletedAt
    }))

    // Return the transformed response
    return NextResponse.json({
      content: transformedContent,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
      size: data.size,
      number: data.number
    })
  } catch (error) {
    console.error("Error in courses GET route:", error)
    return NextResponse.json(
      { message: "코스 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

