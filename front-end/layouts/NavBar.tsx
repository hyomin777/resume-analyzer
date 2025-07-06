import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center py-4 px-8 bg-gray-50 border-b mb-8">
        <Link href="/">
          <span className="text-indigo-700 hover:underline cursor-pointer">Home</span>
        </Link>
      <div className="flex gap-6">
        <Link href="/analyze">
          <span className="text-green-700 hover:underline cursor-pointer">Resume Analysis</span>
        </Link>
      </div>
    </nav>
  );
}
