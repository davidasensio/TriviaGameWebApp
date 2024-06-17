class Cookie {

  static getCookie(name) {
    const cookies = document.cookie.split(";").map((cookie) => cookie.split("="));
    const selectedCookie = cookies.find((cookie) => cookie[0].trim() === name);
    return selectedCookie ? selectedCookie[1] : "";
  }

  static setCookie(name, value, mins = 0) { // 0 means session cookie
    let expiryDate = "";
    if (mins > 0) {
      expiryDate = `expires=${new Date(Date.now() + mins * 60 * 1000).toUTCString()}`;
    }
    document.cookie = `${name}=${value}; ${expiryDate};`;
  }

  static deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
  }
}
export { Cookie };
