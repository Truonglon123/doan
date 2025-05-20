import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";

interface AuthData {
  token: string;
  user_email: string;
  user_nicename: string;
  user_display_name: string;
}

interface AuthContextProps {
  authData: AuthData | null;
  setAuthData: (data: AuthData | null) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authData, setAuthData] = useState<AuthData | null>(() => {
    const cookieData = Cookies.get("authData");
    return cookieData ? JSON.parse(cookieData) : null;
  });

  useEffect(() => {
    if (authData) {
      Cookies.set("authData", JSON.stringify(authData), { expires: 7 });
    } else {
      Cookies.remove("authData");
    }
  }, [authData]);

  const logout = () => {
    setAuthData(null);
    Cookies.remove("authData");
  };

  const isAuthenticated = !!authData;

  return (
    <AuthContext.Provider value={{ authData, setAuthData, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};

export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};
