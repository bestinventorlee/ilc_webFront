import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 px-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 mb-2">
            {isSignUp ? "회원가입" : "로그인"}
          </h1>
          <p className="text-neutral-600">
            {isSignUp
              ? "ILC 회원이 되어 다양한 프로젝트에 참여하세요"
              : "ILC 계정으로 로그인하세요"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isSignUp && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-900 mb-2">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors"
                  placeholder="홍길동"
                  required={isSignUp}
                />
              </div>
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-900 mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-900 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 border border-neutral-300 focus:outline-none focus:border-neutral-900 transition-colors"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {!isSignUp && (
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 border-neutral-300 text-neutral-900 focus:ring-0"
                />
                <span className="ml-2 text-neutral-600">로그인 상태 유지</span>
              </label>
              <button
                type="button"
                className="text-neutral-600 hover:text-neutral-900"
              >
                비밀번호 찾기
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-neutral-900 text-white font-medium hover:bg-neutral-800 transition-colors"
          >
            {isSignUp ? "가입하기" : "로그인"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-sm text-neutral-600 hover:text-neutral-900"
          >
            {isSignUp ? (
              <>
                이미 계정이 있으신가요? <span className="font-medium">로그인</span>
              </>
            ) : (
              <>
                계정이 없으신가요? <span className="font-medium">회원가입</span>
              </>
            )}
          </button>
        </div>

        <div className="mt-8 pt-8 border-t border-neutral-200 text-center text-sm text-neutral-600">
          로그인하시면 ILC의{" "}
          <button className="underline hover:text-neutral-900">이용약관</button> 및{" "}
          <button className="underline hover:text-neutral-900">개인정보처리방침</button>에
          동의하는 것으로 간주됩니다.
        </div>
      </div>
    </div>
  );
}
