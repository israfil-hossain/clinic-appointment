import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/store";
import Cookies from "js-cookie";

export const useAuthEffect = () => {
  const { clearUser } = useUserStore();
  const router = useRouter();

  useEffect(() => {
    const checkAuthToken = () => {
      const token = Cookies.get("authToken");
      if (token) {
        // You might want to decode the token or check its expiry manually if needed
        const expirationDate = JSON.parse(atob(token.split(".")[1])).exp;
        if (expirationDate * 1000 < Date.now()) {
          clearUser();
          Cookies.remove("authToken");
          router.push("/");
        }
      } else {
        // If there's no token, just redirect to the login page
        router.push("/");
      }
    };

    checkAuthToken();
  }, [clearUser, router]);
};
