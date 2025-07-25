import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export default function LogoutButton() {
  const router = useRouter();
  const { logout } = useAuth(); 

  const handleLogout = () => {
    logout();
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
