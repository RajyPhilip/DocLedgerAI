import { Dispatch, SetStateAction } from "react";

const breakPoints = {
  mobile: "(max-width:480px)",
  mini_tablet: "(min-width:481px) and (max-width:768px)",
  tablet: "(min-width:769px) and (max-width:968px)",
  laptop: "(min-width:969px) and (max-width:1264px)",
  desktop: "(min-width:1265px)",
};

const matchMediaQuery = (
  breakPoints,
  setBreakpoint,
) => {
  for (const key of Object.keys(breakPoints)) {
    if (window.matchMedia(`${breakPoints[key]}`).matches) {
      setBreakpoint(key);
    }
  }
};

export const breakPointObserver = (
  setBreakpoint,
) => {
  matchMediaQuery(breakPoints, setBreakpoint);
  window.addEventListener("resize", () => {
    matchMediaQuery(breakPoints, setBreakpoint);
  });
};

export const ScreenSizes = {
  MOBILE: "mobile",
  MINI_TABLET: "mini_tablet",
  TABLET: "tablet",
  LAPTOP: "laptop",
  DESKTOP: "desktop",
}