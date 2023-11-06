import {AuthBridge} from "@hydrophobefireman/flask-jwt-jskit";
import {redirect} from "@hydrophobefireman/ui-lib";

const client = new AuthBridge<any>();

// change these according to your backend
client.routes = {
  loginRoute: "/users/-/login",
  refreshTokenRoute: "/users/-/token/refresh",
  initialAuthCheckRoute: "/users/me",
};
client.onLogout = () => redirect("/login");

const {useCurrentAuthState, useIsLoggedIn} = client.getHooks();

const requests = client.getHttpClient();

export {useCurrentAuthState, useIsLoggedIn, requests, client};
