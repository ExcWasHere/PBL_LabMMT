import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("galeri", "routes/galeri.tsx")
] satisfies RouteConfig;
