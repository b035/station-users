import { log, Registry, ExitCodes, Result } from "@the-stations-project/sdk";

import { USER_DIR } from "./index.js";

export default async function remove(args: string[]): Promise<Result<ExitCodes, undefined>> {
	const unum = args[0];
	const user_path = Registry.join_paths(USER_DIR, unum);
	const timestamp = new Date().toISOString();

	//delete
	log("ACTIVITY", `User management: trying to delete user "${unum}".`);
	(await Registry.delete(user_path)).or_panic();
	log("ACTIVITY", `User management: deleted user "${unum}" at ${timestamp}.`);

	//block user number
	(await Registry.write(user_path, timestamp)).or_panic();

	return new Result(ExitCodes.Ok, undefined);
}
