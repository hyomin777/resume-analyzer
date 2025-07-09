import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../contexts/AuthContext";

export default function withAuthProtection<T extends object>(WrappedComponent: React.ComponentType<T>) {
  return function ProtectedComponent(props: T) {
    const { loggedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loggedIn) {
        router.replace("/login");
      }
    }, [loggedIn]);

    if (!loggedIn) return null;

    return <WrappedComponent {...props} />;
  };
}
