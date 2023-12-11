import {dynamic} from "@kit/router";
export default {
  "/": dynamic(() => import("@/pages/Landing")),
  "/login": dynamic(() => import("@/pages/Auth/Login")),
  "/register": dynamic(() => import("@/pages/Auth/Register")),
  "/app": dynamic(() => import("@/pages/App/App")),
  "/search": dynamic(() => import("@/pages/Search/search")),
  "/post": dynamic(() => import("@/pages/Post/Post")),
  "/posts/:id": dynamic(() => import("@/pages/PostsViewer/Viewer")),
  "/profile/:id": dynamic(() => import("@/pages/Profiles")),
};
