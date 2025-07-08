import Link from "next/link";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { loggedIn, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-gray-50 border-b mb-8">
      <Link href="/">
        <span className="text-indigo-700 hover:underline cursor-pointer">Home</span>
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/resume">
          <span className="text-green-700 hover:underline cursor-pointer">Create Resume</span>
        </Link>
        <Link href="/analyze">
          <span className="text-green-700 hover:underline cursor-pointer">Resume Analysis</span>
        </Link>
        <Link href="/feedback">
          <span className="text-green-700 hover:underline cursor-pointer">Feedback Upload</span>
        </Link>
        {loggedIn && <LogoutButton onLogout={logout} />}
      </div>
    </nav>
  );
}
