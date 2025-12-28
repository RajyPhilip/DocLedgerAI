import { useRef, useEffect } from "react";

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
const useOutsideAlerter = (ref, action, dependency) => {
  const handleClickOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      action();
    }
  };
  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, ...dependency]);
};

const OutsideAlerter = ({ children, action, dependency, className = "" }) => {
  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef, action, dependency || []);
  return (
    <div ref={wrapperRef} className={className}>
      {children}
    </div>
  );
};

export default OutsideAlerter;