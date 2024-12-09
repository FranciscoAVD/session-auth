import Link from "next/link";
const linkClassName="px-4 py-2 border rounded-md" as const;

export default function Home() {
  return (
    <>
      <header className="flex items-center h-16 shadow">
        <div className="flex container">
          <div className=" flex items-center ml-auto gap-x-4">
            <Link
              href="/sign-up"
              className={linkClassName + " bg-neutral-900 text-neutral-50"}
            >
              Sign up
            </Link>
            <Link
              href="/sign-in"
              className={linkClassName}
            >
              Sign in
            </Link>
            <Link 
              href="/dashboard"
              className={linkClassName}
            >
              Dashboard
            </Link>
          </div>
        </div>
      </header>
      <main className="grid place-content-center gap-6 h-[calc(100vh-4rem)]">
        Home
      </main>
    </>
  );
}
