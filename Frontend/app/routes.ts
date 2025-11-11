import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("proyek", "routes/proyek.tsx"),
    route("masuk", "routes/masuk.tsx"),
] satisfies RouteConfig;
