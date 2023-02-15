import Bcrypt from "bcrypt";

import { ExitCodes, log, Result } from "@the-stations-project/sdk";
import set from "./set";

export default async function change_pswd(args: string[]): Promise<Result<ExitCodes, undefined>> {
	const [ unum, pswd ] = args;

	const hash = await Bcrypt.hash(pswd, 10);
	log("ACTIVITY", `User management: trying to change password for "${unum}".`);
	set([unum, "hash", hash]);	
	log("ACTIVITY", `User management: changed password for "${unum}".`);

	return new Result(ExitCodes.Ok, undefined); 
}
