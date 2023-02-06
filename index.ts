#! /usr/bin/env node

import create from "./create.js";
import remove from "./remove.js";

const USER_DIR = "users";

function main(args: string[]) {
	//remove first two arguments
	args.splice(0, 2);

	//get subcommand
	const subcommand = args.splice(0, 1)[0];

	switch (subcommand) {
		case "create": return create(USER_DIR, args);
		case "remove": return remove(USER_DIR, args);
		case "get": return;
		case "set": return;
		case "auth": return;

		default: throw `"${subcommand}": invalid subcommand.`;
	}
}

main(process.argv);
