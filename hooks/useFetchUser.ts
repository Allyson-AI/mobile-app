import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/clerk-expo";
import Toast from "react-native-toast-message";

const useFetchUser = () => {
  const { userId, getToken } = useAuth();
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fetchUser = async (retryCount = 10) => {
    setLoading(true);
    setError(null);
    let token;
    try {
      token = await getToken();
    } catch (e) {
      console.error("Error getting token:", e);
    }

    if (user && token) {
      let attempts = 0;

      while (attempts < retryCount) {
        try {
          const response = await fetch(
            `${process.env.EXPO_PUBLIC_API_URL}/`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
            }
          );

          if (!response.ok) {
            const errorText = await response.text();
            console.error("API error response:", errorText);
            throw new Error(`Network response was not ok: ${errorText}`);
          }

          const userData = await response.json();
          setUserInfo(userData.user);
          setLoading(false);
          return;
        } catch (e) {
          attempts += 1;
          console.error(`Attempt ${attempts} failed:`, e);
          if (attempts >= retryCount) {
            setError(e);
            setLoading(false);
            Toast.show({
              type: "error",
              text1: "Error fetching user data",
              text2: "Please try again later",
            });
            break;
          }
          // Wait for a short time before retrying
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
    } else {
      console.error("User or token not available:", { user, token });
      setLoading(false);
      setError(new Error("User or token not available"));
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  return { user: userInfo, fetchUser, loading, error };
};

export default useFetchUser;
