import {dynamic} from "@kit/router";
export default {
  "/": dynamic(() => import("@/pages/Landing")),
  "/login": dynamic(() => import("@/pages/Auth/Login")),
  "/register":dynamic(()=>import("@/pages/Auth/Register"))
};
