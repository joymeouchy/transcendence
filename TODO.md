what joy needs:
--for the "change profile picture" button: POST FormData (field name "avatar") to /users/me/avatar with the Bearer token, then use the returned avatarUrl. Also add the backend host to next.config.ts images.remotePatterns (currently only allows lh3.googleusercontent.com) so next/image can render it

--when logged in with google, make sure the "change password" is inactive (it's handled in backend
    so it returns an error if they try to change pass for google, u can check it in swagger)

--link forget/reset/change password buttons to their api (add for each their own page)
--link update username

--when register fails, it's giving an error 400 (probably needs handling from both sides)
--need handling errors from apis
--add customizations to the game
--remove provider from profile

what rawan needs:
--need to recheck isOnline
<!-- --add api for getting friend list of the user (not all users) -->
<!-- --handle rematch -->
--implement chat system
--connect the match results to the Match table
--make a new Customization table
<!-- --user should be able to change avatar -->
<!-- --user should be able to change username -->
<!-- --forget password/change password implimentaion -->
--add powerups

 photo sources:
 https://www.deviantart.com/windowsaesthetics/art/Windows-HD-User-Account-Picture-Pack-843341713
 
