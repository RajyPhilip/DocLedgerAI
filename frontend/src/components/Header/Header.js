import { useNavigate } from "react-router-dom";
import { JWT_TOKEN, removeCookie } from "../../services/cookieService";
import "./Header.scss";
import useUserStore from "../../store/useUserStore";

const Header = () => {

    const navigate = useNavigate();
    const logoutUser = useUserStore((state) => state.logout);

    const handleLogout = () => {
        removeCookie(JWT_TOKEN);
        logoutUser();
        navigate("/signin");
    };

    return(
        <div className="header-main-container full-width">
            <div className="upper-bar flex-row align-items-center justify-content-space-between px-24">
        <div
          className="logo-footer-mobile cursor-pointer"
          onClick={() => navigate("/documents")}
        >
          <img
            height={48}
            width={120}
            src="https://i.ibb.co/pBSVCDVJ/pffgg-reader-logo-removebg-preview.png"
            alt="logo"
          />
        </div>

        <p
          onClick={handleLogout}
          className="xetgo-font-tag bold px-16 py-12 cursor-pointer bold"
        >
          <i className="fa-solid fa-right-from-bracket"></i> Logout
        </p>
      </div>
  </div>
    )};
export default Header;