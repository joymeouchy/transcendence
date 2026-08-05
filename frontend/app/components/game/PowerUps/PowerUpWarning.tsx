"use client";

import { useEffect, useState } from "react";


type Props = {
	powerUp: {
		type: string;
		side: "left" | "right";
		applyAt: number;
	} | null;
};


export default function PowerUpIncoming({
	powerUp,
}: Props) {

	const [seconds,setSeconds] = useState(0);


	useEffect(()=>{

		if(!powerUp)
			return;


		const interval = setInterval(()=>{

			const remaining =
				Math.ceil(
					(powerUp.applyAt - Date.now()) / 1000
				);


			setSeconds(
				Math.max(remaining,0)
			);

		},100);


		return ()=>clearInterval(interval);


	},[powerUp]);



	if(!powerUp || seconds <= 0)
		return null;


	return (
		<div className="power-up-warning">

			⚡ {powerUp.type}

			<br/>

			Starting in {seconds}s

		</div>
	);
}