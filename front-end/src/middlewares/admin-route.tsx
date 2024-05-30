import { useAuth } from "../providers/auth-context-provider";
import { Redirect } from "../tools/redirect";

function AdminRoute({ children }: { children: JSX.Element }) {
  const {user, isLoggedIn} = useAuth();

  if (!user || user.Role != "admin" || !isLoggedIn) {
    return <Redirect to="/" />;
  }

  return children;
}

export default AdminRoute;
