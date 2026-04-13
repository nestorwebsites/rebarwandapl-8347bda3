const ADMIN_KEY = "reba_admin_auth";

export function isAdminLoggedIn(): boolean {
  return sessionStorage.getItem(ADMIN_KEY) === "true";
}

export function setAdminLoggedIn(value: boolean) {
  if (value) {
    sessionStorage.setItem(ADMIN_KEY, "true");
  } else {
    sessionStorage.removeItem(ADMIN_KEY);
  }
}
