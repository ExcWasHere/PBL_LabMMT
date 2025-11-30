import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/home.tsx"),
    route("project", "routes/project.tsx"),
    route("masuk", "routes/masuk.tsx"),
    route("gallery", "routes/gallery.tsx"),
    route("news", "routes/news.tsx"),
    route("dashboard-viewer", "routes/dashboard-viewer/dashboard.tsx"),
    route("dashboard-viewer-news", "routes/dashboard-viewer/news.tsx"),
    route("dashboard-viewer-project", "routes/dashboard-viewer/project.tsx"),
    route("dashboard-viewer-gallery", "routes/dashboard-viewer/gallery.tsx"),
    route("dashboard-viewer-member", "routes/dashboard-viewer/member.tsx"),
    route("dashboard-lecturer", "routes/dashboard-lecturer/dashboard.tsx"),
    route("dashboard-lecturer-news", "routes/dashboard-lecturer/news.tsx"),
    route("dashboard-lecturer-project", "routes/dashboard-lecturer/project.tsx"),
    route("dashboard-lecturer-gallery", "routes/dashboard-lecturer/gallery.tsx"),
    route("dashboard-lecturer-member", "routes/dashboard-lecturer/member.tsx"),
    route("news-detail", "routes/news-detail.tsx"),
    route("project-detail", "routes/project-detail.tsx"),
] satisfies RouteConfig;
