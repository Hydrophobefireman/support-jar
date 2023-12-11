import {requests} from "./bridge";

const BASE = process.env.API_HOST;
const getURL = (x: string) => new URL(x, BASE).toString();

export const routes = {
  loginRoute: getURL("/users/-/login"),
  registerRoute: getURL("/users/-/register"),
  refreshTokenRoute: getURL("/users/-/token/refresh"),
  meRoute: getURL("/users/me"),
  feedRoute: getURL("/subscriber/feed"),
  subscriptionsRoute: getURL("/subscriber/creators"),
  followerRoute: getURL("/creator/subscribers"),
  createPostRoute: getURL("/creator/post"),
  viewPostRoute: (idx: string) => getURL(`/subscriber/posts/${idx}`),
  searchRoute: (q: string) =>
    getURL(`/subscriber/search?q=${encodeURIComponent(q)}`),
  subscribeRoute: (idx: string) => getURL(`/subscriber/subscribe/${idx}`),
  profile: (idx: string) => getURL(`/subscriber/profile/${idx}`),
};

export {requests};
