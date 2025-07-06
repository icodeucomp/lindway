import { CartProduct, EverySnap, Footer, Header } from "@/components/ui";

export default function CartPage() {
  return (
    <>
      <Header isDark />
      <div className="bg-gray/5">
        <CartProduct />
      </div>
      <EverySnap />
      <Footer />
    </>
  );
}
