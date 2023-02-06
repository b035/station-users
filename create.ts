import Path from "path";
import Bcrypt from "bcrypt"

import { log, Registry } from "@the-stations-project/sdk";

export default async function create(USER_DIR: string, args: string[]) {
	const [ dispname, pswd ] = args;

	if (dispname == undefined || pswd == undefined) throw "dispname or pswd missing.";

	//generate number
	const unum_base = generate_number(dispname);
	const taken_numbers = (await Registry.ls(USER_DIR)).unwrap().value!;
	//numbers with same base
	const highest_suffix = taken_numbers
		//match bases
		.filter(x => x.split("-")[0] == unum_base)
		//get suffixes
		.map(x => x.split("-")[1])
		//validate (numbers only)
		.filter(x => /^[0-9]$/.test(x))
		//reverse order (-> highest first)
		.reverse()
		//get highest or use 0
		[0] ?? 0;
	const unum_suffix = parseInt(highest_suffix) + 1;
	const unum = `${unum_base}-${unum_suffix}`;

	//create directory
	const user_path = Path.join(USER_DIR, unum);
	(await Registry.mkdir(user_path)).unwrap();

	//hash password
	const hash = await Bcrypt.hash(pswd, 10);

	log("ACTIVITY", `User management: started creating account "${unum}".`);

	//store data
	for (let [path, content] of [
		["dispname", dispname],
		["hash", hash],
	]) {
		(await Registry.write(Path.join(user_path, path), content)).unwrap();

	}
	log("ACTIVITY", `User management: created account "${unum}".`);
	console.log(1);
}

function generate_number(dispname: string): string {
	const letters = dispname.padEnd(4).split("").splice(0, 4);
	let unum = "";

	for (let letter of letters) {
		unum += get_letter_number(letter);
	}

	return unum;
}

function get_letter_number(letter: string) {
	switch (letter.toLowerCase()) {
		case "a": case "b": case "c": return 2;
		case "d": case "e": case "f": return 3;
		case "g": case "h": case "i": return 4;
		case "j": case "k": case "l": return 5;
		case "m": case "n": case "o": return 6;
		case "p": case "q": case "r": case "s": return 7;
		case "t": case "u": case "v": return 8;
		case "w": case "x": case "y": case "z": return 9;

		default: return 1;
	}
}
