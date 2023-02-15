import { ExitCodes, log, Registry, Result } from "@the-stations-project/sdk";

import { USER_DIR } from "./index.js";

export default async function get(args: string[]): Promise<Result<ExitCodes, string>> {
	const [ unum, prop ] = args;

	//security
	if (prop == "hash") log("ACTIVITY", `User management: got hash for "${unum}".`);

	const path = Registry.join_paths(USER_DIR, unum, prop);

	const value = (await Registry.read(path)).or_panic().value!;

	return new Result(ExitCodes.Ok, value);
}
