import { Navigate, Route, Routes } from "react-router-dom";
import routes from "./Routes";
import { useEffect, useState } from "react";
import { JWT_TOKEN, setCookie, getCookie } from "../services/cookieService";
import { breakPointObserver, ScreenSizes } from "./BreakpointObserver";
import useUserStore from "../store/useUserStore";

const ActiveRoutes = () => {
  const [loadContent, setLoadContent] = useState(true);
  const user = useUserStore((state) => state.user);
  const token = getCookie(JWT_TOKEN);

  useEffect(() => {
    if (token) {
      if (!user) {
        // Add user initialization logic if needed
      }
      setCookie(JWT_TOKEN, token);
    }
    setLoadContent(false);
  }, [token, user]);

  

  if (loadContent) return null;

  return (
    <>

      {user ? (
        <div
          className="flex-row main-page-content"
          style={{
            height:'100%',
            overflow: "scroll",
          }}
        >
          <Routes>
            {routes.map(
              ({ path, Component, protected: isProtected }, index) =>
                isProtected && (
                  <Route key={index} path={path} element={<Component />} />
                )
            )}

            <Route
              key={routes.length}
              path="/notfound"
              element={<div>PAGE NOT FOUND</div>}
            />
            <Route path="*" element={<Navigate to="/profile" replace />} />
          </Routes>
        </div>
      ) : (
        <Routes>
          {routes.map(
            (route, index) =>
              !route.protected && <Route key={index} {...route} />
          )}

          <Route
            key={routes.length}
            path="/notfound"
            element={<div>PAGE NOT FOUND</div>}
          />
          <Route path="*" element={<Navigate to="/signin" replace />} />
        </Routes>
      )}
    </>
  );
};

export default ActiveRoutes;