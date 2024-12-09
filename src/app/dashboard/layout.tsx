import { isValidSession } from "@/lib/utils/session";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const valid = await isValidSession();
  if (!valid) redirect("/sign-in");
  return <main>{children}</main>;
}
