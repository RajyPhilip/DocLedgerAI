import { Suspense, useEffect, useState } from "react";
import "./App.scss";
import Lottie from "lottie-react";
import loadingAnimationData from "./assets/images/loadingAnimationPack.json";
import Loader from "./components/Loader/Loader";
import { ToastContainer } from "react-toastify";
import ActiveRoutes from "./utils/AvailableRoutes";
import ApiService from "./services/apiService";
import {
  getCookie,
  JWT_TOKEN,
  removeCookie,
} from "./services/cookieService";
import URLS from "./urls/Urls";
import useUserStore from "./store/useUserStore";

function App() {
  const [loading, setLoading] = useState(false);
  const [globalLoader, setGlobalLoader] = useState(true);

  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    handleIsUser();
  }, []);

  const handleIsUser = async () => {
    try {
      const token = getCookie(JWT_TOKEN);

      // ✅ correct token check
      if (!token || token === "undefined") {
        setGlobalLoader(false);
        return;
      }

      const api = ApiService();
      const response = await api.client.post(URLS.USERS.VERIFY_USER);

      if (response.data.status !== "success") {
        throw new Error("Invalid token");
      }

      setUser(response.data.data.user);
    } catch (error) {
      removeCookie(JWT_TOKEN);
    } finally {
      setGlobalLoader(false);
    }
  };

  return (
    <div>
      {globalLoader ? (
        <div className="lottie-animation-main-container flex-row align-items-center justify-content-center">
          <Lottie
            animationData={loadingAnimationData}
            loop
            className="lottie-container"
          />
        </div>
      ) : (
        <>
          {loading && <Loader />}
          <Suspense fallback={<div>Loading...</div>}>
            <ActiveRoutes />
            <ToastContainer position="top-right" />
          </Suspense>
        </>
      )}
    </div>
  );
}

export default App;
