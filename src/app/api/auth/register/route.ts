import { NextRequest, NextResponse } from "next/server";
import { generateToken, hashPassword, prisma } from "@/utils";
import { z } from "zod";

const RegisterSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]).default("ADMIN"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, role = "ADMIN" } = RegisterSchema.parse(body);

    if (!email || !username || !password) {
      return NextResponse.json({ success: false, error: "Email, username, and password are required" }, { status: 400 });
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    });

    if (existingUser) {
      return NextResponse.json({ success: false, error: "User with this email or username already exists" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
        role,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    return NextResponse.json(
      {
        success: true,
        message: "User registered successfully",
        data: {
          token,
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
            role: user.role,
          },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation error", details: error.errors }, { status: 400 });
    }
    console.error(`🚀${new Date()} - Error when register:`, error);
    return NextResponse.json({ error }, { status: 500 });
  }
}
