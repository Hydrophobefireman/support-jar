import {useIsLoggedIn} from "@/util/bridge";
import {redirect, useEffect} from "@hydrophobefireman/ui-lib";

export function AuthGuard({children}: {children?: any}) {
  const isLoggedIn = useIsLoggedIn();
  useEffect(() => {
    redirect("/login");
  }, [isLoggedIn]);
  return <>{!isLoggedIn ? null : children}</>;
}
