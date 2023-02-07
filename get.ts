import { log, Registry } from "@the-stations-project/sdk";

export default async function get(USER_DIR: string, args: string[]) {
	const [ unum, prop ] = args;

	//security
	if (prop == "hash") log("ACTIVITY", `User management: got hash for "${unum}".`);

	const path = Registry.join_paths(USER_DIR, unum, prop);

	const value = (await Registry.read(path)).or_panic().value!;

	return value;
}
