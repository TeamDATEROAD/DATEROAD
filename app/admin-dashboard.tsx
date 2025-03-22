import { useState, useEffect } from "react";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { config } from "@/lib/config";

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
    <div className="p-4">
      <div className="space-y-4">
        {courses.map((course: Course) => (
          <div
            key={safeGetCourseField(course, "id", course.course_id || Math.random().toString())}
            className="p-4 flex items-center gap-4 hover:bg-purple-50 transition-colors"
          >
            <div className="w-16 h-16 relative rounded overflow-hidden bg-gray-100 flex-shrink-0">
              {safeGetCourseField(course, "thumbnail") ? (
                <Image
                  src={safeGetCourseField(course, "thumbnail")}
                  alt={safeGetCourseField(course, "title")}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No Image
                </div>
              )}
            </div>
            <div className="flex-grow">
              <h3 className="text-lg font-medium text-gray-800">{safeGetCourseField(course, "title")}</h3>
              <p className="text-sm text-gray-600">
                작성자: {safeGetCourseField(course, "user.name")} | 생성일:{" "}
                {formatDate(safeGetCourseField(course, "createdAt"))} | 비용:{" "}
                {safeGetCourseField(course, "cost", 0)}원
              </p>
            </div>
            <Button
              variant="destructive"
              size="sm"
              className="bg-red-100 hover:bg-red-200 text-red-700"
              onClick={() => confirmDelete(safeGetCourseField(course, "id", course.course_id))}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              삭제
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
} 