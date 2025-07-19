import { PrismaClient } from "../src/generated/prisma";

import { faker } from "@faker-js/faker";

import { hashPassword } from "@/lib";

const prisma = new PrismaClient();

const categories = ["MY_LINDWAY", "LURE_BY_LINDWAY", "SIMPLY_LINDWAY"] as const;

const availableSizes = ["XS", "S", "M", "L", "XL", "XXL"];

function generateProductImages(count: number = 2) {
  return Array.from({ length: count }).map(() => {
    const filename = `${faker.string.alphanumeric(8)}.jpg`;
    const url = faker.image.url();

    return {
      originalName: filename,
      filename,
      url,
      path: `/uploads/products/${filename}`,
      size: faker.number.int({ min: 50000, max: 500000 }), // Size in bytes
      mimeType: "image/jpeg",
      alt: faker.commerce.productDescription(),
    };
  });
}

function generateSizes() {
  // Randomly select 3-5 sizes from available sizes
  const numberOfSizes = faker.number.int({ min: 3, max: 5 });
  const selectedSizes = faker.helpers.arrayElements(availableSizes, numberOfSizes);

  // Sort sizes in logical order
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

  // Create products for each category
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
        images: generateProductImages(faker.number.int({ min: 3, max: 4 })),
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

  // Log some example data
  console.log("\n📊 Sample product data:");
  const sampleProduct = await prisma.product.findFirst({
    select: {
      name: true,
      sizes: true,
      stock: true,
      category: true,
    },
  });

  if (sampleProduct) {
    console.log("Sample product:", {
      name: sampleProduct.name,
      category: sampleProduct.category,
      sizes: sampleProduct.sizes,
      totalStock: sampleProduct.stock,
    });
  }

  console.log("\n🎉 Seeding complete!");
  console.log(`📈 Total products created: ${categories.length * 20}`);
  console.log("👥 Admin users created: 2");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
