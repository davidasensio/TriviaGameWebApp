class Cookie {

  static getCookie(name) {
    const cookies = document.cookie.split(";").map((cookie) => cookie.split("="));
    const selectedCookie = cookies.find((cookie) => cookie[0] === name);
    return selectedCookie ? selectedCookie[1] : "";
  }

  static setCookie(name, value, days = 0) { // 0 means session cookie
    let expiryDate = "";
    if (days > 0) {
      expiryDate = `expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}`;
    }
    document.cookie = `${name}=${value}; ${expiryDate};`;
  }
}
export { Cookie };
