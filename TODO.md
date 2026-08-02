**what joy needs:**
--update the "game_over" socket to read `winnerSocketId`, `winnerId`, `winnerUsername` for both the normal win and the disconnect game_over paths and to display the winner username

<!-- --for GameCanvas.tsx u should use the values from shared/game_types.ts (pongConfig) instead of hardcoding them (canvas width/height, paddle offsets/width), so it doesn't get out of sync ma3 backend -->

<!-- --GameCanvas.tsx needs to use state.dynamicConfig (paddleHeight/ballSize) for the paddles/ball, same for the powerups -->

--better to visually show the pendingPowerUps before it auto-activates (will tell u more details about in wp)

<!-- --add countdown at the beginning of match (3,2,1,GO!) before the ball moves — backend already exposes countdownEndsAt in game_state, just need to render it (big centered number, then flash "GO!") -->

--isOnline is only being checked from the game page, need to check where socket.connect and disconnect are called and move them somewhere that reacts to user logging in

--link forget/reset/change password buttons to their api (add for each their own page)

--need handling errors from apis

--add customizations to the game

--check why the image (pfp) is changing
--remove the underline under change password/username and add hover effect so it changes color when the cursor touches the buttons (same for friend list)

<!-- --when logged in with google, make sure the "change password" is inactive (it's handled in backend so it returns an error if they try to change pass for google, u can check it in swagger) -->
<!-- --link update username -->
<!-- --for the "change profile picture" button: POST FormData (field name "avatar") to /users/me/avatar with the Bearer token, then use the returned avatarUrl. Also add the backend host to next.config.ts images.remotePatterns (currently only allows lh3.googleusercontent.com) so next/image can render it -->

**what rawan needs:**
--need to recheck isOnline
<!-- --handle rematch -->
--implement chat system
<!-- --make a new Customization table -->
<!-- --stop the user from playing against himself -->
<!-- --user should be able to change avatar -->
<!-- --user should be able to change username -->
<!-- --forget password/change password implimentaion -->
<!-- --add powerups -->
--add apis for getting and updating themes

 photo sources:
 https://www.deviantart.com/windowsaesthetics/art/Windows-HD-User-Account-Picture-Pack-843341713
 
