import { component$, Slot } from "@khulnasoft.com/unisynth";
import { routeLoader$, type RequestHandler } from "@khulnasoft.com/unisynth-city";
import { isUserAuthenticated } from "../auth/auth";

export const useUserLoader = routeLoader$(async ({ cookie }) => {
  return {
    isAuthenticated: await isUserAuthenticated(cookie),
  };
});

export const onGet: RequestHandler = ({ locale, headers, sharedMap }) => {
  // cache for a super long time of 10 seconds for pages using this layout
  locale("en-US");
  headers.set("Cache-Control", "max-age=10");
  sharedMap.set("root", "from root");
};

export default component$(() => {
  return <Slot />;
});