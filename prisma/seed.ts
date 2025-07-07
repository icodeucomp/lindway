import { PrismaClient } from "../src/generated/prisma";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

const categories = ["MY_LINDWAY", "LURE_BY_LINDWAY", "SIMPLY_LINDWAY"] as const;

async function main() {
  // --- Create Users ---
  await prisma.user.createMany({
    data: [
      {
        email: "admin1@example.com",
        username: "admin1",
        password: "admin1234",
        role: "ADMIN",
      },
      {
        email: "admin2@example.com",
        username: "admin2",
        password: "admin1234",
        role: "ADMIN",
      },
    ],
  });

  // --- Create Products ---
  for (const category of categories) {
    const products = Array.from({ length: 20 }).map(() => {
      const price = parseFloat(faker.commerce.price({ min: 100, max: 1000 }));
      const discount = faker.number.int({ min: 0, max: 100 });
      const discountedPrice = parseFloat((price - (price * discount) / 100).toFixed(2));

      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        notes: faker.lorem.sentence(),
        size: ["S", "M", "L"],
        price,
        discount,
        discountedPrice,
        category,
        images: [faker.image.url(), faker.image.url()],
        stock: faker.number.int({ min: 1, max: 100 }),
        sku: faker.string.alphanumeric(10),
        productionNotes: faker.lorem.sentences(2),
        isPreOrder: faker.datatype.boolean(),
        isActive: true,
      };
    });

    await prisma.product.createMany({ data: products });
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
