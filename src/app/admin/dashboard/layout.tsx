import { LayoutDashboard } from "@/components/ui/admin";

import { Toaster } from "react-hot-toast";

export default function DashboardApp({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <LayoutDashboard>
      <Toaster
        position="bottom-center"
        reverseOrder={false}
        toastOptions={{
          duration: 5000,
        }}
      />
      {children}
    </LayoutDashboard>
  );
}
