
import ProtectedRoute from "~/components/Auth/protected-route";
import NewsPage from "~/components/Dashboard/lecturer/news.js";




export default function Viewer() {
  return (
    <>
    <ProtectedRoute>
    <NewsPage />
    </ProtectedRoute>
    </>
  );
}