#! /usr/bin/env node

export const USER_DIR = "users";

import { Result, start_service, ExitCodes } from "@the-stations-project/sdk";

import create from "./create.js";
import remove from "./remove.js";
import get from "./get.js";
import set from "./set.js";
import auth from "./auth.js";
import change_pswd from "./change_pswd.js";

async function main(subcommand: string, args: string[]): Promise<Result<any, any>> {
	switch (subcommand) {
		case "create": return await create(args);
		case "remove": return await remove(args);
		case "get": return await get(args);
		case "set": return await set(args);
		case "auth": return await auth(args);
		case "chpswd": return await change_pswd(args);

		default: throw ExitCodes.ErrNoCommand;
	}
}

start_service(main, (result) => console.log(result.to_string()));
