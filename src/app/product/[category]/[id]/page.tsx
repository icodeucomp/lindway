import { EverySnap, Footer, Header, ProductDetail } from "@/components/ui";

export default function ProductsPage({ params }: { params: { id: string; category: string } }) {
  return (
    <>
      <Header isDark />
      <ProductDetail category={params.category} id={params.id} />
      <EverySnap />
      <Footer />
    </>
  );
}
