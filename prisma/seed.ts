import { PrismaClient } from "../src/generated/prisma";

import { faker } from "@faker-js/faker";

import { hashPassword } from "@/lib";

const prisma = new PrismaClient();

const categories = ["MY_LINDWAY", "LURE_BY_LINDWAY", "SIMPLY_LINDWAY"] as const;

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

function generateProductImages(count: number = 2) {
  return Array.from({ length: count }).map(() => {
    const imageNumber = faker.number.int({ min: 2, max: 58 });
    const filename = `photo-${imageNumber}.png`;

    return {
      originalName: filename,
      filename,
      url: `/uploads/sample/image/${filename}`,
      path: `/uploads/sample/image/${filename}`,
      size: faker.number.int({ min: 50000, max: 500000 }),
      mimeType: "image/png",
      alt: faker.commerce.productDescription(),
    };
  });
}

function generateSizes() {
  const numberOfSizes = faker.number.int({ min: 3, max: 5 });
  const selectedSizes = faker.helpers.arrayElements(availableSizes, numberOfSizes);

  const sizeOrder = ["XS", "S", "M", "L", "XL", "XXL"];
  selectedSizes.sort((a, b) => sizeOrder.indexOf(a) - sizeOrder.indexOf(b));

  return selectedSizes.map((size) => ({
    size,
    quantity: faker.number.int({ min: 0, max: 50 }),
  }));
}

async function main() {
  console.log("🌱 Starting seeding process...");
  console.log("👥 Creating admin users...");

  const password = await hashPassword("!Admin123");
  await prisma.user.createMany({
    data: [
      {
        email: "mylindway@gmail.com",
        username: "lindway",
        password,
        role: "ADMIN",
      },
    ],
  });

  console.log(`🍙  Creating parameters...`);
  await prisma.parameter.createMany({
    data: [
      {
        shipping: 9000,
        tax: 2,
        taxType: "PERCENTAGE",
        member: 8,
        memberType: "PERCENTAGE",
        promo: 9,
        promoType: "PERCENTAGE",
        qrisImage: generateProductImages(1)[0],
        video: [
          {
            originalName: "samplevideo.mp4",
            filename: "samplevideo.mp4",
            url: `/uploads/sample/video/samplevideo.mp4`,
            path: `/uploads/sample/video/samplevideo.mp4`,
            size: faker.number.int({ min: 50000, max: 500000 }),
            mimeType: "image/jpeg",
            alt: faker.commerce.productDescription(),
          },
        ],
      },
    ],
  });

  for (const category of categories) {
    console.log(`🏷️  Creating products for category: ${category}...`);

    const products = Array.from({ length: 20 }).map(() => {
      const price = parseFloat(faker.commerce.price({ min: 100000, max: 300000 }));
      const discount = faker.number.int({ min: 0, max: 100 });
      const discountedPrice = parseFloat((price - (price * discount) / 100).toFixed(2));

      const sizes = generateSizes();
      const totalStock = sizes.reduce((sum, sizeObj) => sum + sizeObj.quantity, 0);

      return {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        notes: faker.lorem.sentence(),
        sizes,
        price,
        discount,
        discountedPrice,
        category,
        images: generateProductImages(faker.number.int({ min: 5, max: 7 })),
        stock: totalStock,
        sku: faker.string.alphanumeric(10).toUpperCase(),
        productionNotes: faker.lorem.words(6),
        isPreOrder: faker.datatype.boolean(),
        isActive: true,
      };
    });

    await prisma.product.createMany({ data: products });
    console.log(`✅ Created ${products.length} products for ${category}`);
  }

  console.log("\n🎉 Seeding complete!");
  console.log(`📈 Total products created: ${categories.length * 20}`);
  console.log("👥 Admin users created: 1");
  console.log("✨ Parameters created: 1");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
