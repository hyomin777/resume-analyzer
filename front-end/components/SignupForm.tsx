import { useState } from "react";

export default function SignupForm({ onSignup }: { onSignup: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordCheck) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, password_check: passwordCheck }),
    });
    const data = await res.json();

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => {
        onSignup();
      }, 1000);
    } else {
      setError(data.detail || "회원가입 실패");
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4 max-w-xs mx-auto mt-20" onSubmit={handleSignup}>
      <h2 className="text-xl font-bold">회원가입</h2>
      <input
        className="w-full border p-2 rounded"
        placeholder="아이디"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        className="w-full border p-2 rounded"
        placeholder="비밀번호"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        className="w-full border p-2 rounded"
        placeholder="비밀번호 확인"
        value={passwordCheck}
        onChange={e => setPasswordCheck(e.target.value)}
        required
      />
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "가입 중..." : "회원가입"}
      </button>
      {error && <div className="text-red-600">{error}</div>}
      {success && <div className="text-green-600">회원가입 완료! 로그인으로 이동합니다...</div>}
    </form>
  );
}
