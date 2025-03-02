import { useRouter } from "expo-router";

export const useNavigateToLogin = () => {
  const router = useRouter();
  const navigateToLogin = () => {
    router.replace("/(auth)/Login");
  };
  return navigateToLogin;
};
