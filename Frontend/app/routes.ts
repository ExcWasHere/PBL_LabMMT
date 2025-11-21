import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("project", "routes/project.tsx"),
    route("masuk", "routes/masuk.tsx"),
    route("gallery", "routes/gallery.tsx"),
    route("news", "routes/news.tsx"),
    route("dashboard-viewer", "routes/dashboard-viewer.tsx"),
    route("news-detail", "routes/news-detail.tsx")
] satisfies RouteConfig;
