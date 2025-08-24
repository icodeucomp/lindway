import { PrismaClient } from "../src/generated/prisma";

import { ConfigService } from "@/services";

import { hashPassword } from "@/lib";

import { faker } from "@faker-js/faker";

import { API_BASE_URL } from "@/utils";

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
      url: `${API_BASE_URL}/uploads/sample/image/${filename}`,
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

async function seedUsers() {
  console.log("👥 Creating admin and super admin users...");

  const passwordAdmin = await hashPassword("!Admin123");
  const passwordLindway = await hashPassword("!Lindway@123");
  await prisma.user.createMany({
    data: [
      {
        email: "admin@gmail.com",
        username: "admin",
        password: passwordAdmin,
        role: "ADMIN",
      },
      {
        email: "mylindway@gmail.com",
        username: "lindway",
        password: passwordLindway,
        role: "SUPER_ADMIN",
      },
    ],
  });
}

async function seedProducts() {
  console.log(`👔 Creating products ...`);

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
        isFavorite: faker.datatype.boolean(),
        isActive: true,
      };
    });

    await prisma.product.createMany({ data: products });
  }
}

async function seedConfigurations() {
  console.log(`🍙 Creating parameters ...`);

  const shippingGroup = await ConfigService.createConfigGroup({
    name: "shipping",
    label: "Shipping Settings",
    description: "Configure shipping rates and options",
    order: 1,
  });

  const taxGroup = await ConfigService.createConfigGroup({
    name: "tax",
    label: "Tax Settings",
    description: "Configure tax rates and types",
    order: 2,
  });

  const memberGroup = await ConfigService.createConfigGroup({
    name: "members",
    label: "Member Settings",
    description: "Configure membership discount and types",
    order: 2,
  });

  const promotionGroup = await ConfigService.createConfigGroup({
    name: "promotions",
    label: "Promotion Settings",
    description: "Configure discounts and types",
    order: 3,
  });

  const imageGroup = await ConfigService.createConfigGroup({
    name: "images",
    label: "Image Settings",
    description: "Configure hero image, qris image, and other images for displayed on the website",
    order: 4,
  });

  const videoGroup = await ConfigService.createConfigGroup({
    name: "videos",
    label: "Video Settings",
    description: "Configure videos for displayed on the website",
    order: 5,
  });

  await ConfigService.createConfig({
    key: "shipping",
    label: "Shipping Cost",
    description: "Base shipping cost in rupiah currency",
    value: 5000,
    type: "DECIMAL",
    groupId: shippingGroup.id,
    order: 1,
  });

  await ConfigService.createConfig({
    key: "tax_rate",
    label: "Tax Rate",
    description: "Base tax rate when buy a product in percentage or fixed amount",
    value: 8.5,
    type: "DECIMAL",
    groupId: taxGroup.id,
    order: 1,
  });

  await ConfigService.createConfig({
    key: "tax_type",
    label: "Tax Type",
    description: "How tax is calculated in percentage or fixed amount",
    value: "PERCENTAGE",
    type: "SELECT",
    groupId: taxGroup.id,
    validation: {
      options: [
        { label: "Percentage", value: "PERCENTAGE" },
        { label: "Fixed Amount", value: "FIXED" },
      ],
    },
    order: 2,
  });

  await ConfigService.createConfig({
    key: "promotion_discount",
    label: "Promotion Discount",
    description: "Base promotion discount when buy a product in percentage or fixed amount",
    value: 8.5,
    type: "DECIMAL",
    groupId: promotionGroup.id,
    order: 1,
  });

  await ConfigService.createConfig({
    key: "promo_type",
    label: "Promo Type",
    description: "How promotion is calculated in percentage or fixed amount",
    value: "PERCENTAGE",
    type: "SELECT",
    groupId: promotionGroup.id,
    validation: {
      options: [
        { label: "Percentage", value: "PERCENTAGE" },
        { label: "Fixed Amount", value: "FIXED" },
      ],
    },
    order: 2,
  });

  await ConfigService.createConfig({
    key: "member_discount",
    label: "Member Discount",
    description: "Base member discount when buy a product in percentage or fixed amount",
    value: 8.5,
    type: "DECIMAL",
    groupId: memberGroup.id,
    order: 1,
  });

  await ConfigService.createConfig({
    key: "member_type",
    label: "Member Type",
    description: "How member is calculated in percentage or fixed amount",
    value: "PERCENTAGE",
    type: "SELECT",
    groupId: memberGroup.id,
    validation: {
      options: [
        { label: "Percentage", value: "PERCENTAGE" },
        { label: "Fixed Amount", value: "FIXED" },
      ],
    },
    order: 2,
  });

  await ConfigService.createConfig({
    key: "qris_image",
    label: "Default Qris Image",
    description: "Base qris image to displayed on the payment screen",
    value: generateProductImages(1)[0],
    type: "IMAGE",
    groupId: imageGroup.id,
    order: 1,
  });

  await ConfigService.createConfig({
    key: "videos_curated_collection",
    label: "Default Videos Curated Collection",
    description: "Base videos to displayed on curated collections page",
    value: [
      {
        originalName: "samplevideo.mp4",
        filename: "samplevideo.mp4",
        url: `${API_BASE_URL}/uploads/sample/video/samplevideo.mp4`,
        path: `/uploads/sample/image/samplevideo.mp4`,
        size: faker.number.int({ min: 50000, max: 500000 }),
        mimeType: "video/mp4",
        alt: faker.commerce.productDescription(),
      },
      {
        originalName: "samplevideo.mp4",
        filename: "samplevideo.mp4",
        url: `${API_BASE_URL}/uploads/sample/video/samplevideo.mp4`,
        path: `/uploads/sample/image/samplevideo.mp4`,
        size: faker.number.int({ min: 50000, max: 500000 }),
        mimeType: "video/mp4",
        alt: faker.commerce.productDescription(),
      },
    ],
    type: "VIDEOS",
    groupId: videoGroup.id,
    order: 1,
  });
}

async function main() {
  console.log("🌱 Starting seeding process...");
  seedUsers();

  seedConfigurations();

  seedProducts();

  console.log("\n🎉 Seeding complete!");
  console.log(`📈 Total products created: ${categories.length * 20}`);
  console.log("👥 Admin and super admin users has been created successfully");
  console.log("✨ Parameters has been created successfully");
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
