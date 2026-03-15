"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <h1 className="text-5xl font-bold text-orange-600">404</h1>
      <p className="mt-4 text-lg text-gray-700">
        Oops! We can’t seem to find the page you’re looking for.
      </p>
      <div className="mt-6 flex flex-col items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-md bg-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        >
          Go back to Home
        </Link>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm font-medium text-gray-600 hover:text-gray-800"
        >
          Or go back
        </button>
      </div>
    </div>
  );
}
