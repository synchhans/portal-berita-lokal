"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaGoogle, FaFacebookF } from "react-icons/fa";
import { useAuth } from "../../../utils/hook/useAuth";
import AlertManager from "../components/AlertManager";

export default function Login() {
  const { login, isLoading, error, validateInput, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("@MonkeyDDragon1");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailError && !passwordError) {
      await login({ email, password });
    }
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    const errorMessage = validateInput("email", value);
    setEmailError(errorMessage);
    if (error) {
      clearError();
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const errorMessage = validateInput("password", value);
    setPasswordError(errorMessage);
    if (error) {
      clearError();
    }
  };

  const isFormValid =
    !emailError && !passwordError && email && password && !error;

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <AlertManager path="/login" />
      <div className="w-[400px] p-8 bg-white shadow-lg rounded-lg border border-gray-200">
        <form className="flex flex-col text-center" onSubmit={handleLogin}>
          <Link href="/">
            <Image
              alt="Logo"
              src="/logo.svg"
              width={160}
              height={50}
              className="mb-8 mx-auto w-auto"
            />
          </Link>
          <h1 className="text-3xl font-bold mb-6 text-gray-700">
            Welcome Back
          </h1>

          <button
            type="button"
            className="flex items-center justify-center w-full bg-orange-500 text-white py-3 rounded-lg mb-3 hover:bg-orange-600 transition duration-300"
          >
            <FaGoogle className="mr-2" size={18} />
            Sign in with Google
          </button>

          <button
            type="button"
            className="flex items-center justify-center w-full bg-blue-700 text-white py-3 rounded-lg mb-3 hover:bg-blue-800 transition duration-300"
          >
            <FaFacebookF className="mr-2" size={18} />
            Sign in with Facebook
          </button>

          <div className="flex items-center my-6">
            <div className="border-b w-full border-gray-300"></div>
            <span className="px-3 text-gray-500 font-semibold">OR</span>
            <div className="border-b w-full border-gray-300"></div>
          </div>

          <input
            type="email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={`mb-4 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
              emailError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {emailError && <p className="text-red-500 mb-2">{emailError}</p>}

          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className={`mb-6 px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 ${
              passwordError ? "border-red-500" : "border-gray-300"
            }`}
          />
          {passwordError && (
            <p className="text-red-500 mb-2">{passwordError}</p>
          )}

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <button
            type="submit"
            disabled={!isFormValid}
            className={`bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-300 ${
              !isFormValid ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Loading..." : "Log In"}
          </button>

          <p className="mt-6 text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              href="/register"
              className="text-blue-500 font-semibold hover:underline"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
