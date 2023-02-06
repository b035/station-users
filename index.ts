#! /usr/bin/env node

import create from "./create.js";
import remove from "./remove.js";
import get from "./get.js";
import set from "./set.js";
import auth from "./auth.js";
import change_pswd from "./change_pswd.js";

const USER_DIR = "users";

async function main(args: string[]) {
	//remove first two arguments
	args.splice(0, 2);

	//get subcommand
	const subcommand = args.splice(0, 1)[0];

	//run
	const result = await run(subcommand, args);

	console.log(result);
}

async function run(subcommand: string, args: string[]) {
	switch (subcommand) {
		case "create": return await create(USER_DIR, args);
		case "remove": return await remove(USER_DIR, args);
		case "get": return await get(USER_DIR, args);
		case "set": return await set(USER_DIR, args);
		case "auth": return await auth(USER_DIR, args);
		case "chpswd": return await change_pswd(USER_DIR, args);

		default: throw `"${subcommand}": invalid subcommand.`;
	}
}

main(process.argv);
