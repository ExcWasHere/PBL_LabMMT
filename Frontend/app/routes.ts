import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("proyek", "routes/proyek.tsx"),
    route("masuk", "routes/masuk.tsx"),
    route("galeri", "routes/galeri.tsx"),
    route("berita", "routes/berita.tsx"),
    route("dashboard-viewer", "routes/dashboard-viewer.tsx"),
    route("news-detail", "routes/news-detail.tsx")
] satisfies RouteConfig;
