import {requests} from "./bridge";

const BASE = process.env.API_HOST;
const getURL = (x: string) => new URL(x, BASE).toString();

export const routes = {
  loginRoute: getURL("/users/-/login"),
  registerRoute: getURL("/users/-/register"),
};

export {requests};
