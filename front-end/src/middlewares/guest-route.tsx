import { Redirect } from "../tools/redirect";
import { useAuth } from "../providers/auth-context-provider";
import { useLocation } from "react-router-dom";

function GuestRoute({ children }: { children: JSX.Element }) {
  const auth = useAuth();
  const location = useLocation();

  if (location.pathname == "/auth" || location.pathname == "/auth/") {
    return <Redirect to="/auth/login" />;
  }

  if (auth.isLoggedIn) {
    return <Redirect to="/" />;
  }

  return children;
}

export default GuestRoute;
