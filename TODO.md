what joy needs:
--for the "change profile picture" button: POST FormData (field name "avatar") to /users/me/avatar with the Bearer token, then use the returned avatarUrl. Also add the backend host to next.config.ts images.remotePatterns (currently only allows lh3.googleusercontent.com) so next/image can render it
--add customizations to the game
--when logged in with google, make sure the "change password" is inactive
--add forget password option to login page
--when register fails, it's giving an error 400 (probably needs handling from both sides)
--need handling errors from apis
--remove provider from profile

what rawan needs:
--need to recheck isOnline
<!-- --add api for getting friend list of the user (not all users) -->
<!-- --handle rematch -->
--implement chat system
--connect the match results to the Match table
--make a new Customization table
--forget password/change password implimentaion
--add powerups

 photo sources:
 https://www.deviantart.com/windowsaesthetics/art/Windows-HD-User-Account-Picture-Pack-843341713
 
