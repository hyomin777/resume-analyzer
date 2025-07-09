import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.access_token) {
        login(data.access_token);
        router.push("/resume/list");
      } else {
        setError(data.detail || "로그인에 실패했습니다.");
      }
    } catch {
      setError("네트워크 에러");
    }
    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto p-6 mt-16">
      <h1 className="text-2xl font-bold mb-6 text-center">로그인</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            className="w-full border p-2 rounded"
            placeholder="아이디"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
        </div>
        <div>
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="비밀번호"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600 text-center">{error}</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
      <div className="text-center mt-4">
        계정이 없으신가요?{" "}
        <Link href="/signup" className="text-blue-600 underline">회원가입</Link>
      </div>
    </main>
  );
}
