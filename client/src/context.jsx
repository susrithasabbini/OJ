import axios from "axios";
import {
  useContext,
  useState,
  useEffect,
  createContext,
  useCallback,
} from "react";
import { url } from "./config";
const AppContext = createContext();

const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  const saveUser = (user) => {
    setUser(user);
  };

  const removeUser = () => {
    setUser(null);
  };

  const fetchUser = useCallback(async () => {
    try {
      const { data } = await axios.get(`${url}/api/v1/users/showMe`, {
        withCredentials: true,
      });
      saveUser(data.user);
    } catch (error) {
      removeUser();
    }
    setIsLoading(false);
  }, []);

  const logoutUser = async () => {
    try {
      await axios.delete(`${url}/api/v1/auth/logout`, {
        withCredentials: true,
      });
      removeUser();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <AppContext.Provider
      value={{
        isLoading,
        saveUser,
        user,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
