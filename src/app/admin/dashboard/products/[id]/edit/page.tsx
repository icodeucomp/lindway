import { EditProductDashboard } from "@/components/ui/admin";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <EditProductDashboard id={params.id} />;
}
