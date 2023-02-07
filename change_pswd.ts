import Bcrypt from "bcrypt";

import { ExitCodes, log } from "@the-stations-project/sdk";
import set from "./set";

export default async function change_pswd(USER_DIR: string, args: string[]) {
	const [ unum, pswd ] = args;

	const hash = await Bcrypt.hash(pswd, 10);
	log("ACTIVITY", `User management: trying to change password for "${unum}".`);
	set(USER_DIR, [unum, "hash", hash]);	
	log("ACTIVITY", `User management: changed password for "${unum}".`);

	return ExitCodes.Ok; 
}
