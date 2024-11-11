import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import { isTokenExpired } from "@/utils/isTokenExpire";

export const useAuthEffect = () => {
  const clearUser = useUserStore((state) => state.clearUser);
  const router = useRouter();

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = localStorage.getItem("authToken");
      if (token) {
        const expired = await isTokenExpired(token);
        if (expired) {
          clearUser();
          localStorage.removeItem("authToken");
          router.push("/?session=expired");
        }
      }
    };

    checkAuthToken();
  }, [clearUser, router]);
};
