"use client";

import { useState } from "react";

// import Link from "next/link";

import { useRouter } from "next/navigation";

import { useMutation } from "@tanstack/react-query";

import { useAuthStore, useForm } from "@/hooks";

import { Button } from "@/components";

import { authApi } from "@/utils";

import { LoginRequest } from "@/types";

/* eslint-disable  @typescript-eslint/no-explicit-any */
export const Login = () => {
  const [values, handleChange] = useForm<LoginRequest>({ username: "", password: "" });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const router = useRouter();
  const { login } = useAuthStore();

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      login(data.data.user, data.data.token);
      setTimeout(() => {
        router.push("/admin/dashboard");
      }, 2000);
    },
    onError: (error: any) => {
      setErrors({
        general: error.response?.data?.message || error.response?.data?.error || "Login failed. Please try again.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!values.username || !values.password) {
      setErrors({ general: "Please fill in all fields" });
      return;
    }

    loginMutation.mutate(values);
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-dark/10 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray">Sign in to your account</h2>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {errors.general && <div className="px-4 py-3 text-red-600 border border-red-200 rounded-lg bg-red-50">{errors.general}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray">
                Email address
              </label>
              <input id="username" name="username" type="username" required value={values.username} onChange={handleChange} className="input-form" placeholder="Enter your email" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray">
                Password
              </label>
              <input id="password" name="password" type="password" required value={values.password} onChange={handleChange} className="input-form" placeholder="Enter your password" />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full text-light bg-gray hover:bg-darker-gray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? "Signing in..." : "Sign in"}
            </Button>
          </div>

          {/* <div className="text-center">
            <span className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </span>
          </div> */}
        </form>
      </div>
    </div>
  );
};
