import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
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

  const confirmDelete = async (courseId: string) => {
    if (!window.confirm("정말로 이 코스를 삭제하시겠습니까?")) {
      return;
    }

    try {
      const response = await fetch(`/api/courses/${courseId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete course");
      }

      await loadCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      // 에러 처리 로직 추가
    }
  };

  useEffect(() => {
    loadCourses();
  }, [currentPage, pageSize, searchQuery]);

  return (
    <div className="p-2 sm:p-4 pt-20 lg:pt-4 max-w-7xl mx-auto">
      {/* 검색 바 */}
      <div className="mb-4 sticky top-16 lg:top-0 bg-white z-10 p-2 sm:p-4 border-b lg:border rounded-lg shadow-sm">
        <Input
          type="search"
          placeholder="코스 검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-md w-full"
        />
      </div>

      <div className="space-y-3 sm:space-y-4">
        {courses.map((course: Course) => (
          <div
            key={safeGetCourseField(course, "id", course.course_id || Math.random().toString())}
            className="p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 hover:bg-purple-50 transition-colors rounded-lg border border-gray-200 bg-white shadow-sm"
          >
            <div className="w-full sm:w-20 h-32 sm:h-20 relative rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
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
            <div className="flex-grow min-w-0 space-y-2">
              <h3 className="text-base sm:text-lg font-medium text-gray-800 break-all line-clamp-2">
                {safeGetCourseField(course, "title")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs sm:text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">작성자:</span>
                  <span className="font-medium">{safeGetCourseField(course, "user.name")}</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="text-gray-500">생성일:</span>
                  <span className="font-medium">{formatDate(safeGetCourseField(course, "createdAt"))}</span>
                </p>
                <p className="flex items-center gap-2 col-span-2 sm:col-span-1">
                  <span className="text-gray-500">비용:</span>
                  <span className="font-medium">{safeGetCourseField(course, "cost", 0).toLocaleString()}원</span>
                </p>
              </div>
            </div>
            <div className="w-full sm:w-auto flex justify-end">
              <Button
                variant="destructive"
                size="sm"
                className="w-full sm:w-auto bg-red-100 hover:bg-red-200 text-red-700 text-xs sm:text-sm h-9 sm:h-10 px-4"
                onClick={() => confirmDelete(safeGetCourseField(course, "id", course.course_id))}
              >
                <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1.5" />
                삭제
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 