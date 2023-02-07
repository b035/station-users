#! /usr/bin/env node

import { start_service, ExitCodes } from "@the-stations-project/sdk";

import create from "./create.js";
import remove from "./remove.js";
import get from "./get.js";
import set from "./set.js";
import auth from "./auth.js";
import change_pswd from "./change_pswd.js";

const USER_DIR = "users";

async function main(subcommand: string, args: string[]) {
	switch (subcommand) {
		case "create": return await create(USER_DIR, args);
		case "remove": return await remove(USER_DIR, args);
		case "get": return await get(USER_DIR, args);
		case "set": return await set(USER_DIR, args);
		case "auth": return await auth(USER_DIR, args);
		case "chpswd": return await change_pswd(USER_DIR, args);

		default: throw ExitCodes.ErrNoCommand;
	}
}

start_service(main).then((result: any) => console.log(result));
