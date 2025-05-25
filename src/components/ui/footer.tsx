import { Container, Img } from "@/components";

const footerLists = [
  "About Us",
  "Categories",
  "Our Best Collections",
  "How to Order",
  "Connect with Us",
  "Size Guide",
  "Conscious Initiatives",
  "Fabric Cloth",
  "Garmen Care",
  "Returns and Exchanges Policies",
];

export const Footer = () => {
  return (
    <footer className="mt-8 shadow-footer text-gray">
      <Container className="grid grid-cols-2 gap-8 py-8">
        <div className="flex flex-col justify-between">
          <Img src="/icons/logo-gray.png" alt="lindway logo" className="h-14 min-w-32 max-w-32" cover />
          <p className="text-sm">© 2025 Lindway. 45 Sudirman Avenue, Level 5, Jakarta, Indonesia 10210 Indonesian Business Licence Number: 0123456789</p>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-4 gap-2">
            {footerLists.map((item, index) => (
              <p key={index} className="text-xs font-medium">
                {item}
              </p>
            ))}
          </div>
          <div className="space-y-1">
            <p className="font-bold">Reach out and follow us at</p>
            <menu className="flex items-center gap-4 list-none">
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Img src="/icons/shopee.svg" alt="shopee icons" className="size-7" />
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Img src="/icons/whatsapp.svg" alt="whatsapp icons" className="size-7" />
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Img src="/icons/instagram.svg" alt="instagram icons" className="size-7" />
                </a>
              </li>
              <li>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <Img src="/icons/facebook.svg" alt="facebook icons" className="size-7" />
                </a>
              </li>
            </menu>
          </div>
        </div>
      </Container>
      <div className="w-full h-4 bg-gray"></div>
    </footer>
  );
};
