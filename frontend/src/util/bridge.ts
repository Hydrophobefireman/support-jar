import {User} from "@/types";
import {AuthBridge} from "@hydrophobefireman/flask-jwt-jskit";
import {redirect} from "@hydrophobefireman/ui-lib";

import {routes} from "./http";

const client = new AuthBridge<User>().withDefaultBackingStore();

// change these according to your backend
client.routes = {
  loginRoute: routes.loginRoute,
  refreshTokenRoute: routes.refreshTokenRoute,
  initialAuthCheckRoute: routes.meRoute,
};
client.onLogout = () => redirect("/login");

const {useCurrentAuthState, useIsLoggedIn} = client.getHooks();

const requests = client.getHttpClient();

export {useCurrentAuthState, useIsLoggedIn, requests, client};

export function useUser() {
  const res = useCurrentAuthState();
  return [res[0]?.auth, res[1]] as const;
}
