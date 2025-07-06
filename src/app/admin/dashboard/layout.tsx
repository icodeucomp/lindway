import { LayoutDashboard } from "@/components/ui/admin";

export default function DashboardApp({ children }: Readonly<{ children: React.ReactNode }>) {
  return <LayoutDashboard>{children}</LayoutDashboard>;
}
