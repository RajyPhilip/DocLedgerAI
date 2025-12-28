import "./Documents.scss";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import { removeCookie, JWT_TOKEN } from "../../services/cookieService";

const Documents = () => {
  const navigate = useNavigate();

  // Zustand actions
  const logoutUser = useUserStore((state) => state.logout);

  const handleLogout = () => {
    removeCookie(JWT_TOKEN); // remove token
    logoutUser();            // clear Zustand user
    navigate("/signin");     // redirect
  };

  return (
    <div className="documents-main-page-container full-width ">
      <button onClick={handleLogout}>
        I’m testing logout button
      </button>

      <p>
        I’m the header where a logo, a search bar,
        and a logout button will be made
      </p>

      <p>I’m the list</p>
      </div>
  );
};

export default Documents;
