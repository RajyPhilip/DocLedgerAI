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
import URL_CONSTANTS from "./urls/Urls";
import useUserStore from "./store/useUserStore";
import { useNavigate } from "react-router-dom";

function App() {
  const [loading, setLoading] = useState(false);
  const [globalLoader, setGlobalLoader] = useState(true);

  const setUser = useUserStore((state) => state.setUser);
  const logoutUser = useUserStore((state) => state.logout);
  const navigate = useNavigate();
  
  useEffect(() => {
    handleIsUser();
  }, []);

 const handleIsUser = async () => {
  try {
    const token = getCookie(JWT_TOKEN);
    if (!token) {
      setGlobalLoader(false);
      return;
    }

    const api = ApiService();
    const res = await api.client.post(URL_CONSTANTS.USERS.VERIFY_USER);

    if (res.data.status !== "success") {
      throw new Error("Invalid token");
    }

    setUser(res.data.data.user);
  } catch {
    removeCookie(JWT_TOKEN);
    logoutUser();
    navigate("/signin");
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
