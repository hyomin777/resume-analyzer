import Link from "next/link";
import LoginButton from "../components/LoginButton";
import LogoutButton from "../components/LogoutButton";
import { useAuth } from "../contexts/AuthContext";

export default function NavBar() {
  const { loggedIn } = useAuth();

  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-gray-50 border-b mb-8">
      <Link href="/">
        <span className="text-indigo-700 hover:underline cursor-pointer">Home</span>
      </Link>
      <div className="flex gap-6 items-center">
        <Link href="/resume">
          <span className="text-green-700 hover:underline cursor-pointer">Create Resume</span>
        </Link>
        <Link href="/resume/list">
          <span className="text-green-700 hover:underline cursor-pointer">Resume List</span>
        </Link>
        <Link href="/analysis">
          <span className="text-green-700 hover:underline cursor-pointer">Resume Analysis</span>
        </Link>
        <Link href="/analysis/list">
          <span className="text-green-700 hover:underline cursor-pointer">Analysis List</span>
        </Link>
        <Link href="/question">
          <span className="text-green-700 hover:underline cursor-pointer">Qestion generation</span>
        </Link>
        <Link href="/feedback">
          <span className="text-green-700 hover:underline cursor-pointer">Feedback Upload</span>
        </Link>
        {loggedIn ? (
          <LogoutButton />
        ) : (
          <LoginButton />
        )}
      </div>
    </nav>
  );
}
