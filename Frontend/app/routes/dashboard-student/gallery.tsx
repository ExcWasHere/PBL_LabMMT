
import ProtectedRoute from "~/components/Auth/protected-route";
import GalleryPage from "~/components/Dashboard/lecturer/gallery.js";


export default function Viewer() {
  return (
    <>
    <ProtectedRoute>
    <GalleryPage />
    </ProtectedRoute>
    </>
  );
}