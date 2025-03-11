import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";

const UserContext = createContext();

const fetchUser = async ({ userId, getToken }) => {
  const fetchWithToken = async (token) => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/user`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 401) {
      throw new Error("Unauthorized");
    }

    return response.json();
  };

  try {
    let token = await getToken();
    try {
      const data = await fetchWithToken(token);
      return { ...data, token };
    } catch (error) {
      if (error.message === "Unauthorized") {
        // If unauthorized, try to get a fresh token and retry
        token = await getToken({ skipCache: true });
        const data = await fetchWithToken(token);
        return { ...data, token };
      }
      throw error;
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

export const UserProvider = ({ children }) => {
  const router = useRouter();
  const { userId, getToken } = useAuth();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserData = useCallback(async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchUser({ userId, getToken });
      setUser(data.user);
      setToken(data.token);
      setError(null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, [userId, getToken]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  const refreshUser = useCallback(async () => {
    try {
      await fetchUserData();
    } catch (error) {
      console.error("Error refreshing user data:", error);
    }
  }, [fetchUserData]);

  const makeAuthenticatedRequest = useCallback(
    async (url, options = {}) => {
      const fetchWithToken = async (token) => {
        let headers = new Headers(options.headers || {});
        headers.set("Authorization", `Bearer ${token}`);
        // Add this line to identify the request as coming from your app
        headers.set("Clerk-Backend-API", process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY);
        

        const response = await fetch(url, {
          ...options,
          headers,
        });
        return response;
      };

      try {
        let token = await getToken({ template: "allyson" });
        let response = await fetchWithToken(token);
        return response;
      } catch (error) {
        console.error("Error in makeAuthenticatedRequest:", error);
        throw error;
      }
    },
    [getToken]
  );

  return (
    <UserContext.Provider
      value={{
        user,
        loading: isLoading,
        userId,
        token,
        getToken,
        makeAuthenticatedRequest,
        refreshUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
