#! /usr/bin/env node

import create from "./create.js";

function main(args: string[]) {
	//remove first two arguments
	args.splice(0, 2);

	//get subcommand
	const subcommand = args.splice(0, 1)[0];

	switch (subcommand) {
		case "create": return create(args);
		case "remove": return;
		case "get": return;
		case "set": return;
		case "auth": return;

		default: throw `"${subcommand}": invalid subcommand.`;
	}
}

main(process.argv);
