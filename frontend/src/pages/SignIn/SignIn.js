import "./SignIn.scss";
import { useEffect, useState, MouseEvent } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import {
  ScreenSizes,
  breakPointObserver,
} from "../../utils/BreakpointObserver";
import { toastOptions } from "../../utils/toast";
import FormInput from "../../components/FormInput/FormInput";
import ApiService from "../../services/apiService";
import useUserStore from "../../store/useUserStore";
import { getCookie, JWT_TOKEN, setCookie } from "../../services/cookieService";
import URLS from "../../urls/Urls";

const SignIn = () => {
  const setUser = useUserStore((state) => state.setUser);

  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [breakpoint, setBreakpoint] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    breakPointObserver(setBreakpoint);
  }, [breakpoint]);

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (email.length === 0 || password.length === 0) {
      toast.error("Please enter valid email or password", toastOptions);
      return;
    }

    setLoading(true);

    try {
      const api = ApiService();
      const body = {
        email: email,
        password: password,
      };
      const response = await api.client.post(URLS.USERS.SIGNIN, body);

      if (response.data.status !== "success") {
        toast.error(response.data.message, toastOptions);
        return;
      }

      const data = response.data.data;

      setUser(data.user);

      setCookie(JWT_TOKEN, data.token);

      navigate("/tournnament");
    } catch (error) {
      console.error("Error sending data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signin-page-container flex-row align-items-center">
      <div className="signin-left-section flex-row align-items-center justify-content-center">
        <div className="signin-form flex-column align-items-start justify-content-space-between">
          <span
            className="flex-column align-items-start"
            style={{ width: "100%" }}
          >
            {breakpoint !== ScreenSizes.MOBILE && (
              <span className="signin-header flex-column">
                <img
                  src="https://d2k6zobmg5lufr.cloudfront.net/assets%2F20250109103622-Screenshot_2025-01-09_at_4.03.22_PM-removebg.png"
                  alt="logo"
                  height="40px"
                />
              </span>
            )}

            <span className="signin-description flex-column gap-4">
              <p className="welcome-heading xetgo-font-h2">Welcome back!</p>
              <p className="xetgo-font-button-bold">
                Please sign in to your email to continue
              </p>
            </span>

            <span className="signin-inputs flex-column gap-8">
              <FormInput
                id="email"
                placeholder="Enter your email address"
                inputChangeHandler={(e) => setEmail(e.target.value)}
                value={email}
              />
              <FormInput
                id="password"
                placeholder="Enter password"
                type="password"
                inputChangeHandler={(event) => setPassword(event.target.value)}
                value={password}
              />
              <button
                className="signin-button"
                style={{
                  background:
                    email.length > 0 && password.length > 0
                      ? "#5151EC"
                      : "#9696F4",
                  cursor:
                    email.length === 0 || password.length === 0
                      ? "pointer"
                      : "cursor",
                }}
                onClick={handleSignIn}
                disabled={loading}
              >
                {" "}
                Sign In{" "}
              </button>
            </span>
          </span>

          <span className="go-to-signup xetgo-font-button-bold">
            <img
              className="logo-footer-mobile"
              src="https://d2k6zobmg5lufr.cloudfront.net/assets%2F20240129094742-xetgo_horizontal-1+2.svg"
              alt="logo"
              height="40px"
            />

            <span className="footer-signup flex-row align-items-center gap-4 xetgo-font-button">
              <span style={{ color: "#A5A5A5" }}> New to Athletic 360? </span>
              <span
                style={{ color: "#5151EC", cursor: "pointer" }}
                onClick={() => navigate("/signup")}
                className="get-started-button flex-row align-items-center gap-4"
              >
                <span className="xetgo-font-button-bold"> Get Started </span>
                <img
                  src="https://d2k6zobmg5lufr.cloudfront.net/assets%2F20240131093622-arrow-right.svg"
                  alt="arrow"
                />
              </span>
            </span>

            <button
              className="signin-button-mobile flex-row justify-content-center align-items-center"
              style={{
                background:
                  email.length > 0 && password.length > 0
                    ? "#5151EC"
                    : "#9696F4",
              }}
              onClick={handleSignIn}
            >
              Sign In
            </button>
          </span>
        </div>
      </div>

      <div className="wallpaper"></div>
    </div>
  );
};

export default SignIn;