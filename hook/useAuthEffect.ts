import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import { isTokenExpired } from "@/utils/isTokenExpire";
import Cookies from "js-cookie";

export const useAuthEffect = () => {
  const {clearUser} = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuthToken = async () => {
      const token = Cookies.get("authToken");
      if (token) {
        const expired = await isTokenExpired(token);
        if (expired) {
          clearUser();
          Cookies.remove("authToken");
          router.push("/");
        }
      } else {
        router.push("/");
      }
    };

    checkAuthToken();
  }, [clearUser, router]);
};
