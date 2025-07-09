import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SignupPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (password !== confirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, confirm }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 1200);
      } else {
        setError(data.detail || "회원가입에 실패했습니다.");
      }
    } catch {
      setError("네트워크 에러");
    }
    setLoading(false);
  };

  return (
    <main className="max-w-md mx-auto p-6 mt-16">
      <h1 className="text-2xl font-bold mb-6 text-center">회원가입</h1>
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
        <div>
          <input
            type="password"
            className="w-full border p-2 rounded"
            placeholder="비밀번호 확인"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
          />
        </div>
        {error && <div className="text-red-600 text-center">{error}</div>}
        {success && <div className="text-green-700 text-center">회원가입 완료! 로그인 해주세요.</div>}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700"
          disabled={loading}
        >
          {loading ? "가입 중..." : "회원가입"}
        </button>
      </form>
      <div className="text-center mt-4">
        이미 계정이 있으신가요?{" "}
        <Link href="/login" className="text-blue-600 underline">로그인</Link>
      </div>
    </main>
  );
}
