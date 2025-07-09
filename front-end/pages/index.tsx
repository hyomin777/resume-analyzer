import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="max-w-xl mx-auto p-8 flex flex-col items-center min-h-[70vh] justify-center">
      <h1 className="text-3xl font-extrabold mb-3 text-indigo-700 text-center">AI 이력서 서비스</h1>
      <p className="mb-7 text-center text-gray-600">
        AI로 나의 이력서를 자동 분석하고,<br />
        경력, 학력, 기술스택을 체계적으로 관리하세요.
      </p>
      <div className="flex gap-4 mb-10">
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          onClick={() => router.push("/login")}
        >
          로그인
        </button>
        <button
          className="bg-white border border-indigo-600 text-indigo-700 px-6 py-2 rounded hover:bg-indigo-50"
          onClick={() => router.push("/signup")}
        >
          회원가입
        </button>
      </div>
      <div className="flex flex-col gap-2 w-full max-w-xs">
        <button
          className="w-full bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          onClick={() => router.push("/resume/list")}
        >
          내 이력서 관리
        </button>
        <button
          className="w-full bg-slate-200 text-slate-700 px-6 py-2 rounded hover:bg-slate-300"
          onClick={() => router.push("/resume/analyze")}
        >
          AI 이력서 분석
        </button>
      </div>
      <div className="mt-8 text-sm text-slate-400 text-center">
        <p>
          처음 이용하신다면 <span className="font-semibold text-indigo-700">회원가입</span> 후, <br />
          <span className="font-semibold text-indigo-700">로그인</span> 하세요!
        </p>
      </div>
    </main>
  );
}
