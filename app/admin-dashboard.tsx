import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2, Search, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";
import { Input } from "@/components/ui/input";

interface Course {
  id?: string;
  course_id?: string;
  title?: string;
  thumbnail?: string;
  user?: {
    name?: string;
  };
  createdAt?: string;
  cost?: number;
}

const safeGetCourseField = (course: Course, field: string, defaultValue: any = "") => {
  const fields = field.split(".");
  let value: any = course;
  
  for (const f of fields) {
    value = value?.[f];
    if (value === undefined) return defaultValue;
  }
  
  return value;
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("ko-KR");
};

export default function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // 모바일 여부 체크
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadCourses = async () => {
    try {
      const response = await fetch(
        `/api/courses?page=${currentPage}&size=${pageSize}${
          searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""
        }`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to load courses");
      }

      const data = await response.json();
      setCourses(data.content || []);
    } catch (error) {
      console.error("Error loading courses:", error);
      // 에러 처리 로직 추가
    }
  };

  const confirmDelete = async (courseId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    
    if (!window.confirm("정말로 이 코스를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete course");
      }

      await loadCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("코스 삭제 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    loadCourses();
  }, [currentPage, pageSize, searchQuery]);
  
  // 모바일용 카드 렌더링
  const renderMobileCard = (course: Course) => {
    const courseId = safeGetCourseField(course, "id", course.course_id || "");
    return (
      <div key={courseId || Math.random().toString()} className="bg-white rounded-lg shadow overflow-hidden">
        {/* 썸네일 */}
        <div className="w-full h-36 relative bg-gray-100">
          {safeGetCourseField(course, "thumbnail") ? (
            <Image
              src={safeGetCourseField(course, "thumbnail")}
              alt=""
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}
        </div>
        
        {/* 내용 */}
        <div className="p-3">
          <h3 className="text-base font-medium text-gray-800 mb-2">
            {safeGetCourseField(course, "title")}
          </h3>
          
          <div className="grid grid-cols-2 gap-2 text-xs mb-3">
            <div>
              <span className="text-gray-500 block">작성자</span>
              <span className="font-medium">{safeGetCourseField(course, "user.name")}</span>
            </div>
            <div>
              <span className="text-gray-500 block">생성일</span>
              <span className="font-medium">{formatDate(safeGetCourseField(course, "createdAt"))}</span>
            </div>
            <div>
              <span className="text-gray-500 block">비용</span>
              <span className="font-medium">{safeGetCourseField(course, "cost", 0).toLocaleString()}원</span>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button
              variant="destructive"
              size="sm"
              className="w-full bg-red-100 hover:bg-red-200 text-red-700 h-8"
              onClick={(e) => confirmDelete(courseId, e)}
            >
              <Trash2 className="h-3.5 w-3.5 mr-1.5" />
              삭제
            </Button>
          </div>
        </div>
      </div>
    );
  };
  
  // 데스크탑용 카드 렌더링
  const renderDesktopCard = (course: Course) => {
    return (
      <div
        key={safeGetCourseField(course, "id", course.course_id || Math.random().toString())}
        className="bg-white rounded-lg shadow p-4 hover:bg-purple-50 transition-colors"
      >
        <div className="flex items-start gap-4">
          {/* 이미지 */}
          <div className="w-16 h-16 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            {safeGetCourseField(course, "thumbnail") ? (
              <Image
                src={safeGetCourseField(course, "thumbnail")}
                alt={safeGetCourseField(course, "title")}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                No Image
              </div>
            )}
          </div>

          {/* 코스 정보 */}
          <div className="flex-1 min-w-0 w-full">
            <h3 className="text-base font-medium text-gray-800 break-keep line-clamp-2 w-full whitespace-normal">
              {safeGetCourseField(course, "title")}
            </h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-600">
              <div className="inline-flex items-center">
                <span className="text-gray-500">작성자:</span>
                <span className="font-medium ml-1">{safeGetCourseField(course, "user.name")}</span>
              </div>
              <span className="text-gray-300 mx-1">•</span>
              <div className="inline-flex items-center">
                <span className="text-gray-500">생성일:</span>
                <span className="font-medium ml-1">{formatDate(safeGetCourseField(course, "createdAt"))}</span>
              </div>
              <span className="text-gray-300 mx-1">•</span>
              <div className="inline-flex items-center">
                <span className="text-gray-500">비용:</span>
                <span className="font-medium ml-1">{safeGetCourseField(course, "cost", 0).toLocaleString()}원</span>
              </div>
            </div>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end mt-3">
          <Button
            variant="destructive"
            size="sm"
            className="bg-red-100 hover:bg-red-200 text-red-700 h-8 px-3 text-xs"
            onClick={() => confirmDelete(safeGetCourseField(course, "id", course.course_id))}
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            삭제
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="p-2 sm:p-4 pt-20 lg:pt-4 max-w-7xl mx-auto">
      {/* 검색 바 */}
      <div className="mb-4 sticky top-16 lg:top-0 bg-white z-10 p-2 sm:p-4 border-b rounded-lg shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="코스 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
      </div>

      {/* 코스 리스트 */}
      <div className={isMobile ? "grid grid-cols-1 gap-4" : "space-y-3 sm:space-y-4"}>
        {courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-4 text-center text-gray-500">
            코스가 없거나 검색 결과가 없습니다.
          </div>
        ) : (
          courses.map((course: Course) => (
            isMobile ? renderMobileCard(course) : renderDesktopCard(course)
          ))
        )}
      </div>
    </div>
  );
} 