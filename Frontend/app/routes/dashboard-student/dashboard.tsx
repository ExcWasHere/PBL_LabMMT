import Dashboard from "~/components/Dashboard/lecturer/dashboard";


import ProtectedRoute from "~/components/Auth/protected-route";




export default function Viewer() {
  return (
    <>
    <ProtectedRoute>
    <Dashboard />
    </ProtectedRoute>
    </>
  );
}