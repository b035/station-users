import Path from "path";

import { log, Registry } from "@the-stations-project/sdk";

export default async function get(USER_DIR: string, args: string[]) {
	const [ unum, prop ] = args;

	//security
	if (prop == "hash") log("ACTIVITY", `User management: got hash for "${unum}".`);

	const path = Path.join(USER_DIR, unum, prop);

	const value = (await Registry.read(path)).or_panic().value!;
	console.log(value);
}
