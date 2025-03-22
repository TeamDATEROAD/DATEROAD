import { NextRequest, NextResponse } from 'next/server';
import config from '@/lib/config';

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ message: '인증이 필요합니다.' }, { status: 401 });
    }

    // 동적 라우트 파라미터를 비동기적으로 처리
    const id = await Promise.resolve(context.params.id);

    const response = await fetch(
      `${config.apiBaseUrl}${config.endpoints.adminUserDetail(id)}`,
      {
        headers: {
          Authorization: authHeader,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { message: errorData.message || '사용자 정보를 불러오는데 실패했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in user detail GET route:', error);
    return NextResponse.json(
      { message: '사용자 정보를 불러오는데 실패했습니다.' },
      { status: 500 }
    );
  }
} 