import { useState, useEffect } from "react";

export interface UserProfile {
  name: string;
  email: string;
}

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: "KetuaLab",
    email: "user@gmail.com",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setProfile({
          name: parsed.name ?? parsed.fullname ?? parsed.username ?? "KetuaLab",
          email: parsed.email ?? "user@gmail.com",
        });
      }
    } catch (e) {
      console.error("Failed to parse user profile", e);
    }
  }, []);

  return profile;
};