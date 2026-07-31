what joy needs:
--update the "game_over" socket to read `winnerSocketId`, `winnerId`, `winnerUsername` for both the normal win and the disconnect game_over paths and to display the winner username

--for GameCanvas.tsx u can use the values from shared/game_types.ts (pongConfig/GameConfig) instead of hardcoding them, so it doesn't get out of sync ma3 backend

--GameCanvas.tsx needs to draw the power-up on the canvas (backend sends it in game_state), and use state.dynamicConfig (paddleHeight/ballSize) when drawing the paddles/ball instead of fixed numbers, so power-up effects show up visually

--isOnline is only being checked from the game page, need to check where socket.connect and disconnect are called and move them somewhere that reacts to user logging in

--when logged in with google, make sure the "change password" is inactive (it's handled in backend so it returns an error if they try to change pass for google, u can check it in swagger)

--for the "change profile picture" button: POST FormData (field name "avatar") to /users/me/avatar with the Bearer token, then use the returned avatarUrl. Also add the backend host to next.config.ts images.remotePatterns (currently only allows lh3.googleusercontent.com) so next/image can render it

--link forget/reset/change password buttons to their api (add for each their own page)
--link update username

--need handling errors from apis

--add customizations to the game
--remove provider from account info

what rawan needs:
<!-- --need to recheck isOnline -->
<!-- --add api for getting friend list of the user (not all users) -->
<!-- --handle rematch -->
--implement chat system
<!-- --connect the match results to the Match table -->
--make a new Customization table
<!-- --stop the user from playing against himself -->
<!-- --user should be able to change avatar -->
<!-- --user should be able to change username -->
<!-- --forget password/change password implimentaion -->
<!-- --fix paddles position -->
--add powerups

 photo sources:
 https://www.deviantart.com/windowsaesthetics/art/Windows-HD-User-Account-Picture-Pack-843341713
 
