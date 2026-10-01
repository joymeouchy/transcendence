**what joy needs:**
--need handling errors from apis
--double check the playing 3 players simultanuously. started fixing not fully functional yet


--hosting / other devices (so it works on devices other than localhost):
    - frontend/lib/socket.ts: "http://localhost:3001" is hardcoded -> read it from NEXT_PUBLIC_API_URL like lib/api.ts
    - set NEXT_PUBLIC_API_URL to the backend's real address (same value as BACKEND_URL in .env)
    - next.config.ts: images.remotePatterns only allows localhost:3001/uploads -> add the real backend host (only matters where next/image is used for avatars)



**what rawan needs:**
--~~need to recheck isOnline~~
--~~implement chat system~~
--~~invite friends to join game socket~~
--~~add backend for remove profile picture button~~

--recheck how it's storing user new pfp
--if online sockets works from both sides, remove isOnline attribute from db
-- README2: ctrl + F "TODO" find all the notes i added and double check everything and if i missed any modules. there are things i didnt add/adjust yet


--save pics online


issues incountered:
in friends page if you try to add someone you already sent a friend request to, it returns "request failed error 400"


photo sources:
https://www.deviantart.com/windowsaesthetics/art/Windows-HD-User-Account-Picture-Pack-843341713
