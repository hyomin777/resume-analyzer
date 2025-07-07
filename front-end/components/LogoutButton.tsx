import { useRouter } from "next/router";

export default function LogoutButton({ onLogout }: { onLogout: () => void }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token");
    onLogout();
    router.push("/");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-gray-400 text-white px-4 py-2 rounded cursor-pointer"
    >
      로그아웃
    </button>
  );
}
