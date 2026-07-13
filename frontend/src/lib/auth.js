export const AUTH_COOKIE = "omniagent_session";
export const AUTH_COOKIE_VALUE = "omni_authenticated_v1";

/** Demo credentials for portfolio / Upwork walkthroughs */
export const DEMO_CREDENTIALS = {
  email: "portfolio@faisal.com",
  password: "OmniAgent_2026!",
};

export function isValidCredentials(email, password) {
  return (
    String(email || "").trim().toLowerCase() === DEMO_CREDENTIALS.email &&
    String(password || "") === DEMO_CREDENTIALS.password
  );
}
