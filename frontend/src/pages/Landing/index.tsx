import {AuthGuard} from "@/components/AuthGuard/AuthGuard";
import {useCurrentAuthState, useIsLoggedIn} from "@/util/bridge";
import {useState} from "@hydrophobefireman/ui-lib";

import App from "../App/App";

/** Exported routes need to be default exports */
export default function Landing() {
  return <Clicker />;
}

function Clicker() {
  return <App />;
}
