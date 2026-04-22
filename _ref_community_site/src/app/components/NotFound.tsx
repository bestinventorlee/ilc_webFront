import { Link } from "react-router";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-neutral-900 mb-4">404</h1>
        <p className="text-2xl text-neutral-600 mb-8">페이지를 찾을 수 없습니다</p>
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors"
        >
          <Home className="w-5 h-5 mr-2" />
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  );
}
