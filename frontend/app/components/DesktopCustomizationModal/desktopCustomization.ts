import { images } from "@/lib/images";

export type DesktopTheme = {
	id: string;
	name: string;
	background: string;
};

export const desktopThemes: DesktopTheme[] = [
	{
		id: "classic",
		name: "Windows XP",
		background: images.windowsDefaultWallpaper,
	},
	{
		id: "1cat",
		name: "Cat",
		background: images.windowsOneCatWallpaper,
	},
	{
		id: "dontpanic",
		name: "Don't Panic",
		background: images.windowsDontPanicWallpaper,
	},
	{
		id: "4cats",
		name: "pspsps",
		background: images.windowsFourCatsWallpaper,
	},
	{
		id: "DE",
		name: "Revachol",
		background: images.windowsRevacholWallpaper,
	},
	{
		id: "stonehenge",
		name: "Stonehenge",
		background: images.windowsStoneHengeWallpaper,
	},
	{
		id: "tulips",
		name: "Tulips",
		background: images.windowsTulipsWallpaper,
	},
];
