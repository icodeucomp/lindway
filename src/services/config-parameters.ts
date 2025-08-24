import { ParameterType, Prisma } from "@/generated/prisma";
import { prisma } from "@/lib";

export class ConfigService {
  // Get all configurations grouped by their groups
  static async getAllConfigurations() {
    const groups = await prisma.configParameterGroup.findMany({
      include: { configs: { where: { isActive: true }, orderBy: { order: "asc" } } },
      where: { isActive: true },
      orderBy: { order: "asc" },
    });

    return groups;
  }

  // Get a specific configuration value by key
  static async getConfigValue(keys: string[]) {
    const config = await prisma.configParameter.findMany({ where: { key: { in: keys }, isActive: true } });

    // Convert array to object with key-value pairs
    return config.reduce((acc, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, Prisma.JsonValue>);
  }

  // Update a configuration value
  static async updateConfigValue(key: string, value: Prisma.InputJsonValue) {
    const config = await prisma.configParameter.update({ where: { key }, data: { value } });

    return config;
  }

  // Update multiple configuration values
  static async updateConfigValues(updates: Record<string, Prisma.InputJsonValue>) {
    const promises = Object.entries(updates).map(([key, value]) => prisma.configParameter.update({ where: { key }, data: { value } }));

    await Promise.all(promises);
  }

  // Create a new configuration
  static async createConfig(data: {
    key: string;
    label: string;
    description: string;
    value: Prisma.InputJsonValue;
    type: ParameterType;
    groupId: string;
    validation?: Prisma.InputJsonValue;
    order?: number;
  }) {
    const config = await prisma.configParameter.create({ data: { ...data, order: data.order || 999 } });

    return config;
  }

  // Create a new configuration group
  static async createConfigGroup(data: { name: string; label: string; description?: string; order?: number }) {
    const group = await prisma.configParameterGroup.create({ data: { ...data, order: data.order || 999 } });

    return group;
  }
}
