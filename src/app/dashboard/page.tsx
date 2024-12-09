import {signOut} from "@/lib/actions/auth";
import Link from "next/link";
export default function page() {
  return (
    <div>
      <form action={signOut}><button type="submit">Sign out</button></form>
      <Link href="/dashboard/admin">Admin</Link>
      dashboard
    </div>
  )
}
