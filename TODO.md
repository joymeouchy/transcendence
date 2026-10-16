**what joy needs:**
--if player disconnected, emit `leave_game` (check SOCKET_EVENT.md)
--change styling of "signing in" after google signin page
--add login sound after google page
--show Google sign in errors on the login page. the backend now redirects failures to `/login?error=<code>`. read the `error` param, codes:
  - `google_email_exists`: "This email is already registered. Please log in with your password."
  - `google_failed` (or any unknown code): "Google sign in failed. Please try again."

**what rawan needs:**
-- README2: ctrl + F "TODO" find all the notes i added and double check everything and if i missed any modules. there are things i didnt add/adjust yet

**To Test:**
-- if one player disconnected and the other left, will the player still be able to reconnect?


photo sources:
https://www.deviantart.com/windowsaesthetics/art/Windows-HD-User-Account-Picture-Pack-843341713
https://nextjs.org/docs/app/api-reference/file-conventions/proxy
