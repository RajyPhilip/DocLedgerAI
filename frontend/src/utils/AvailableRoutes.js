// import { Navigate, Route, Routes } from "react-router-dom";
// import routes from "./Routes";
// import SideNav from "../components/SideNav/SideNav";
// import { useEffect, useState } from "react";
// import { JWT_TOKEN, setCookie, getCookie } from "../services/cookieService";
// import { breakPointObserver, ScreenSizes } from "./BreakpointObserver";
// import Header from "../components/Header/Header";
// import useUserStore from "../store/useUserStore";

// const ActiveRoutes = () => {
//   const [windowWidth, setWindowWidth] = useState(window.innerWidth);
//   const [breakpoint, setBreakpoint] = useState("");
//   const [loadContent, setLoadContent] = useState(true);
//   const user = useUserStore((state) => state.user);
//   const token = getCookie(JWT_TOKEN);

//   useEffect(() => {
//     breakPointObserver(setBreakpoint);
//   }, []);

//   useEffect(() => {
//     if (token) {
//       if (!user) {
//         // Add user initialization logic if needed
//       }
//       setCookie(JWT_TOKEN, token);
//     }
//     setLoadContent(false);
//   }, [token, user]);

//   useEffect(() => {
//     const updateWindowWidth = () => {
//       setWindowWidth(window.innerWidth);
//     };

//     window.addEventListener("resize", updateWindowWidth);
//     return () => {
//       window.removeEventListener("resize", updateWindowWidth);
//     };
//   }, []);

//   if (loadContent) return null;

//   const isMobileView = [
//     ScreenSizes.LAPTOP,
//     ScreenSizes.MINI_TABLET,
//     ScreenSizes.TABLET,
//     ScreenSizes.MOBILE,
//   ].includes(breakpoint );

//   return (
//     <>
//       {isMobileView && <Header />}

//       {user ? (
//         <div
//           className="flex-row main-page-content"
//           style={{
//             height:
//               ScreenSizes.DESKTOP === breakpoint
//                 ? "100vh"
//                 : "calc(100vh - 48px)",
//             overflow: "scroll",
//           }}
//         >
//           {ScreenSizes.DESKTOP === breakpoint && <SideNav />}
//           <Routes>
//             {routes.map(
//               ({ path, Component, protected: isProtected }, index) =>
//                 isProtected && (
//                   <Route key={index} path={path} element={<Component />} />
//                 )
//             )}

//             <Route
//               key={routes.length}
//               path="/notfound"
//               element={<div>PAGE NOT FOUND</div>}
//             />
//             <Route path="*" element={<Navigate to="/profile" replace />} />
//           </Routes>
//         </div>
//       ) : (
//         <Routes>
//           {routes.map(
//             (route, index) =>
//               !route.protected && <Route key={index} {...route} />
//           )}

//           <Route
//             key={routes.length}
//             path="/notfound"
//             element={<div>PAGE NOT FOUND</div>}
//           />
//           <Route path="*" element={<Navigate to="/signin" replace />} />
//         </Routes>
//       )}
//     </>
//   );
// };

// export default ActiveRoutes;