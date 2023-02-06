import Path from "path";

import { log, Registry } from "@the-stations-project/sdk";

export default async function get(USER_DIR: string, args: string[]) {
	const [ unum, prop ] = args;

	//security
	if (prop == "hash") {
		log("ERROR", `User management: refused to get hash for "${unum}".`);
		return;
	}

	const path = Path.join(USER_DIR, unum, prop);

	const value = (await Registry.read(path)).unwrap().value!;
	console.log(value);
}
