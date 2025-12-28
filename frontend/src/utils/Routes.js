import Documents from "../pages/Documents/Documents";
import SignIn from "../pages/SignIn/SignIn";
import SignUp from "../pages/SignUp/SignUp";

const routes = [
  {
    path: "/signin",
    Component: SignIn,
    protected: false,
  },
  {
    path: "/signup",
    Component: SignUp,
    protected: false,
  },
  {
    path: "/documents",
    Component: Documents,
    protected: true,
  },
];

export default routes;
