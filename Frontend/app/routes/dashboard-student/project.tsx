
import ProtectedRoute from "~/components/Auth/protected-route";
import ProjectPage from "~/components/Dashboard/lecturer/project.js";



export default function Viewer() {
  return (
    <>
    <ProtectedRoute>
    <ProjectPage />
    </ProtectedRoute>
    </>
  );
}