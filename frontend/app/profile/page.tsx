"use client"

import Image from "next/image";

export default function userProfile(){

	const user = {
		username: "Player1",
		tagline: "Pong Competitor",
		wins: 1,
		losses: 2,
	};

	const winRate = Math.round((user.wins/(user.wins+user.losses) * 100));

	return (
	<div className="min-h-screen p-6 bg-gray-950 text-white">
      
	  <div className="flex items-center gap-4 mb-8">  
        {/* Avatar */}
        <Image
		src = "/defaultIcon.png"
		alt = "Avatar"
		width={64}
  		height={64}
		className="rounded-full bg-gray-700" ></Image>

        {/* Info */}
        <div>
          <h1 className="text-2xl font-bold">{user.username}</h1>
          <p className="text-gray-400 text-sm">{user.tagline}</p>
        </div>
      </div>
	  <div className = "grid grid-cols-3 gap-4">
		        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Wins</p>
          <p className="text-2xl font-bold text-green-400">
            {user.wins}
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Losses</p>
          <p className="text-2xl font-bold text-red-400">
            {user.losses}
          </p>
        </div>

        <div className="bg-gray-900 p-4 rounded-lg">
          <p className="text-gray-400 text-sm">Win Rate</p>
          <p className="text-2xl font-bold text-blue-400">
            {winRate}%
          </p>
        </div>
	  </div>
    </div>


	);
}