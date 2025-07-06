import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "./prisma";
import { NextRequest } from "next/server";

type Role = "ADMIN" | "SUPER_ADMIN";

export interface User {
  id: string;
  email: string;
  username: string;
  role: Role;
  isActive: boolean;
}

export interface TokenPayload extends JwtPayload {
  userId: string;
}

export interface AuthResult {
  user?: User;
  error?: string;
  status?: number;
}

export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "7d",
  });
};

export const verifyToken = (token: string): TokenPayload | null => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "your-secret-key") as TokenPayload;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error(`Invalid token: ${error.message}`);
    }
    throw error; // Re-throw if it's an unexpected error type
  }
};

export const authenticate = async (req: NextRequest): Promise<AuthResult> => {
  try {
    const token = req.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return { error: "No token provided", status: 401 };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return { error: "Invalid token", status: 401 };
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        isActive: true,
      },
    });

    if (!user || !user.isActive) {
      return { error: "User not found or inactive", status: 401 };
    }

    return { user };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error: error.message, status: 500 };
    }

    return { error: "Authentication failed", status: 500 };
  }
}; // adjust the import as needed

export const authorize = async (req: NextRequest, requiredRole: Role): Promise<AuthResult> => {
  const authResult = await authenticate(req);

  if ("error" in authResult) {
    return authResult;
  }

  const user = authResult.user;
  const role = authResult.user?.role || "ADMIN";
  const roleHierarchy: Record<Role, number> = {
    SUPER_ADMIN: 2,
    ADMIN: 1,
  };

  const userRoleLevel = roleHierarchy[role] || 0;
  const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

  if (userRoleLevel < requiredRoleLevel) {
    return {
      error: `Access denied. ${requiredRole} role required`,
      status: 403,
    };
  }

  return { user };
};
