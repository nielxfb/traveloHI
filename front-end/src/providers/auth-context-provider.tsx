import { createContext, useContext, useEffect, useState } from "react";
import { IChildren } from "../interfaces/children-interface";
import { IUser } from "../interfaces/user-interface";
import { DecodedToken, useJwt } from "../hooks/use-jwt";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { put } from "../tools/api";

interface IAuthContext {
  user: IUser | null;
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext>({} as IAuthContext);

function AuthContextProvider({ children }: IChildren) {
  const navigate = useNavigate();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const login = (token: string) => {
    const { isValid } = useJwt(token);

    if (isValid) {
      const decodedToken = jwtDecode(token) as DecodedToken;
      const user = {
        Email: decodedToken.Email,
        FirstName: decodedToken.FirstName,
        LastName: decodedToken.LastName,
        PhoneNumber: decodedToken.PhoneNumber,
        DOB: new Date(decodedToken.DOB),
        Address: decodedToken.Address,
        Gender: decodedToken.Gender,
        Role: decodedToken.Role,
        ProfilePictureLink: decodedToken.ProfilePictureLink,
        PersonalSecurityQuestions: [],
        IsBanned: decodedToken.IsBanned,
        LoggedIn: decodedToken.LoggedIn,
        Subscribe: decodedToken.Subscribe,
      };
      setUser(user);
      localStorage.setItem(import.meta.env.VITE_USER_KEY, JSON.stringify(user));
      localStorage.setItem(import.meta.env.VITE_TOKEN_KEY, token);
      setIsLoggedIn(true);
    }
  };

  const logout = async () => {
    const { sub } = useJwt();
    const url = import.meta.env.VITE_API_URL + "/api/logout";
    try {
      await put(url, { ID: sub });
    } catch (error: any) {
      return;
    }
    localStorage.setItem(import.meta.env.VITE_TOKEN_KEY, "");
    localStorage.setItem(import.meta.env.VITE_USER_KEY, "");
    setUser(null);
    setIsLoggedIn(false);
    navigate("/auth/login");
  };

  useEffect(() => {
    const { isValid } = useJwt();
    setIsLoggedIn(isValid);
    return () => {};
  }, [isLoggedIn]);

  useEffect(() => {
    const { isValid } = useJwt();
    if (!isValid) {
      logout();
    }
  }, [isLoggedIn]);

  useEffect(() => {
    setUser(
      localStorage.getItem(import.meta.env.VITE_USER_KEY)
        ? JSON.parse(
            localStorage.getItem(import.meta.env.VITE_USER_KEY) as string
          )
        : null
    );
  }, [isLoggedIn]);

  const values = {
    user,
    isLoggedIn,
    login,
    logout,
  };

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
}

export default AuthContextProvider;

export function useAuth() {
  return useContext(AuthContext);
}
