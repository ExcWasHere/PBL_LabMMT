import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    console.log("Token dari localStorage:", token);

    if (!token) {
      console.log("Token tidak ada, redirect ke login");
      navigate("/masuk?unauthorized=1", { replace: true });
      return;
    }
    const cleanToken = token.trim();

    fetch("http://localhost:3000/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${cleanToken}`,
        "Content-Type": "application/json",
      },
    })
      .then(async (res) => {
        console.log("Response status:", res.status);

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          console.error("Auth failed:", errorData);
          localStorage.removeItem("access_token");
          localStorage.removeItem("role");
          navigate("/sign-in?unauthorized=1", { replace: true });
          return;
        }

        const userData = await res.json();
        if (userData && userData.data) {
          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(userData.data));
            localStorage.setItem("role", userData.data.role ?? "");
          }
        }
        console.log("User authenticated:", userData);
        setChecking(false);
      })
      .catch((err) => {
        console.error("Network error:", err);
        localStorage.removeItem("access_token");
        localStorage.removeItem("role");
        navigate("/masuk?unauthorized=1", { replace: true });
      });
  }, [navigate]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-sky-50 to-purple-50">
        <div className="p-6 rounded-2xl border bg-white shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-700 font-medium">
              Memeriksa otentikasi...
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}