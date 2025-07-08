import { useState } from "react";

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.access_token);
      onLogin();
    } else {
      setError(data.detail || "로그인 실패");
    }
    setLoading(false);
  };

  return (
    <form className="space-y-4 max-w-xs mx-auto mt-20" onSubmit={handleLogin}>
      <h2 className="text-xl font-bold cursor-pointer">로그인</h2>
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
      <button
        className="bg-indigo-600 text-white px-4 py-2 rounded w-full"
        disabled={loading}
      >
        {loading ? "로그인 중..." : "로그인"}
      </button>
      {error && <div className="text-red-600">{error}</div>}
    </form>
  );
}
