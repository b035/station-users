import Bcrypt from "bcrypt";

import { log } from "@the-stations-project/sdk";

import get from "./get.js";

export default async function auth(USER_DIR: string, args: string[]) {
	const [ unum, pswd ] = args;

	const hash = await get(USER_DIR, [unum, "hash"]);
	const result = await Bcrypt.compare(pswd, hash);

	log("ACTIVITY", `User management: authentication result for "${unum}": ${result}.`);

	return result;
}
