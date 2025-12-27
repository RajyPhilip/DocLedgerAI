import Cookies from "js-cookie";

export const JWT_TOKEN = "jwtToken";

function setCookie(key, value) {
  Cookies.set(key, value, { expires: 2 });
}

function getCookie(key) {
  return Cookies.get(key);
}

function removeCookie(key) {
  Cookies.remove(key);
}

export { setCookie, getCookie, removeCookie };