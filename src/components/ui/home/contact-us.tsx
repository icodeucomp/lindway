import { Background, Img, Motion } from "@/components";

const contactUs = [
  { icons: "/shopee-light.svg", name: "Shopee", username: "Lindway" },
  { icons: "/instagram-light.svg", name: "Instagram", username: "@mylindway" },
  { icons: "/facebook-light.svg", name: "Facebook", username: "mylindway" },
  { icons: "/whatsapp-light.svg", name: "Personal Assistant 1", username: "+62 823-3993-6682" },
  { icons: "/whatsapp-light.svg", name: "Personal Assistant 2", username: "+62 812-3890-592" },
  { icons: "/email-light.svg", name: "email", username: "mylindway@gmail.com" },
];

export const ContactUs = () => {
  return (
    <Background src="/images/contact-us.png" alt="contact us background" className="flex justify-center items-center min-h-300 bg-dark/40">
      <Motion tag="div" initialX={0} animateX={0} duration={0.3} className="w-full space-y-8 max-w-screen-xl px-4 sm:px-8">
        <div className="space-y-8">
          <div className="space-y-4 text-center">
            <Motion tag="h3" initialY={50} animateY={0} duration={0.3} className="text-lg md:text-2xl font-semibold">
              Connect with Us
            </Motion>
            <Motion tag="p" initialY={50} animateY={0} duration={0.6} delay={0.3} className="font-medium text-lg max-w-2xl mx-auto">
              Reach out to us via WhatsApp, Instagram, Shopee, or Facebook for inquiries, orders, or updates. Let&apos;s stay connected and take time to design
            </Motion>
          </div>
          <Motion tag="div" initialY={50} animateY={0} duration={0.9} delay={0.3} className="flex justify-between w-full gap-4">
            {contactUs.map((item, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Img src={`/icons/${item.icons}`} alt={item.name} className="size-8" />
                <div className="text-sm">
                  <p>{item.name}</p>
                  <p>{item.username}</p>
                </div>
              </div>
            ))}
          </Motion>
        </div>
      </Motion>
    </Background>
  );
};
