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

    console.log('Deleting course with ID:', params.id);
    console.log('API URL:', `${config.apiBaseUrl}${config.endpoints.course(params.id)}`);

    const response = await fetch(
      `${config.apiBaseUrl}${config.endpoints.course(params.id)}`,
      {
        method: "DELETE",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
        },
      }
    )

    console.log('API response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json()
      console.error('API error:', errorData);
      return NextResponse.json(
        { message: errorData.message || "코스 삭제에 실패했습니다." },
        { status: response.status }
      )
    }

    return NextResponse.json({ message: "코스가 성공적으로 삭제되었습니다." })
  } catch (error) {
    console.error("Error in course DELETE route:", error)
    return NextResponse.json(
      { message: "코스 삭제에 실패했습니다." },
      { status: 500 }
    )
  }
}

