
import ProtectedRoute from "~/components/Auth/protected-route";
import MemberPage from "~/components/Dashboard/lecturer/member.js";



export default function Viewer() {
  return (
    <>
    <ProtectedRoute>
    <MemberPage />
    </ProtectedRoute>
    </>
  );
}