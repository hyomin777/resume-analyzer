import { useRouter } from "next/router";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-indigo-400 text-white px-4 py-2 rounded cursor-pointer"
    >
      로그인
    </button>
  );
}
