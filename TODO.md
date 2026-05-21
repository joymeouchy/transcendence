- only login returns token ,register does NOT auto-login: create auto log in token for register
- thoroughly test both register and login pages for invalid cases
stil to do to auth section
Ensure login stores JWT token in localStorage
 Ensure register flow matches login token handling (if backend returns token)
 Create tokenStorage utility (get/set/remove token)
 Refactor API layer to use Axios interceptor for Authorization header
 Create isAuthenticated() helper in /lib/auth
 Protect Home page (redirect to /login if no token)
 Prevent logged-in users from accessing /login (redirect to /)
 Add optional loading guard to prevent page flicker on auth check
 Handle expired token (401 interceptor → auto logout + redirect)
 Add logout function (clear token + redirect to login)
 Add login loading state (disable button + “Logging in...” text)
 Ensure consistent API response handling across login/register
 Confirm token persists after page refresh
 Validate full auth flow end-to-end (login → home → refresh → still logged in)


 photo sources:
 https://www.deviantart.com/windowsaesthetics/art/Windows-HD-User-Account-Picture-Pack-843341713
 