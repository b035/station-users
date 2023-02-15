import { log, Registry, ExitCodes, Result } from "@the-stations-project/sdk";

import { USER_DIR } from "./index.js";

export default async function set(args: string[]): Promise<Result<ExitCodes, undefined>> {
	const [ unum, prop, val ] = args;

	//security
	if (prop == "hash") log("ACTIVITY", `User management: set hash for "${unum}".`);

	const path = Registry.join_paths(USER_DIR, unum, prop);

	(await Registry.write(path, val)).or_panic();

	return new Result(ExitCodes.Ok, undefined);
}
