import Bcrypt from "bcrypt";

import { ExitCodes, log, Result } from "@the-stations-project/sdk";

import get from "./get.js";

export default async function auth(args: string[]): Promise<Result<ExitCodes, boolean>> {
	const [ unum, pswd ] = args;

	const hash = (await get([unum, "hash"])).or_panic().value!;
	const comp_result = await Bcrypt.compare(pswd, hash);

	log("ACTIVITY", `User management: authentication result for "${unum}": ${comp_result}.`);

	return new Result(ExitCodes.Ok, comp_result);
}
