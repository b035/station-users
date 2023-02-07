import { log, Registry, ExitCodes } from "@the-stations-project/sdk";

export default async function set(USER_DIR: string, args: string[]) {
	const [ unum, prop, val ] = args;

	//security
	if (prop == "hash") log("ACTIVITY", `User management: set hash for "${unum}".`);

	const path = Registry.join_paths(USER_DIR, unum, prop);

	(await Registry.write(path, val)).or_panic();

	return ExitCodes.Ok;
}
