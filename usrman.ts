#! /usr/bin/env node

import Bcrypt from "bcrypt";

import * as SDK from "@the-stations-project/sdk";

/* MAIN */
async function main(subcommand: string, args: string[]) {
	switch (subcommand) {
		case "create": return await create(args[0], args[1]);
		default: return new SDK.Result(SDK.ExitCodes.ErrUnknown, undefined);
	}
}

/* SUB-FUNCTIONS */
async function create(dispname: string, pswd: string) {
	const result = new SDK.Result(SDK.ExitCodes.Ok, "");

	/* safety */
	if (dispname == undefined || pswd == undefined) return result.finalize_with_code(SDK.ExitCodes.ErrUnknown);

	/* get unum root */
	const unum_root = convert_to_t9(dispname);

	/* get all registered user numbers */
	const user_list_result = (await SDK.Registry.ls("usrman/users"));
	if (user_list_result.has_failed) return result.finalize_with_code(SDK.ExitCodes.ErrUnknown);
	const all_users = user_list_result.value!;
	const highest_suffix_with_same_root = all_users
		.filter(x => x.split("-")[0] == unum_root) //root matches
		.map(x => x.split("-")[1]) //get suffix
		.filter(x => isNaN(parseInt(x)) == false) //suffix must be a number
		.reverse() //highest suffix to top
		[0] ?? 0
	
	/* get credentials*/
	const suffix = parseInt(highest_suffix_with_same_root) + 1;
	const unum = `${unum_root}-${suffix}`;
	const hash = await get_hash(pswd);

	/* create user directory */
	const usr_dir_path = SDK.Registry.join_paths("usrman/users", unum);
	const dir_result = (await SDK.Registry.mkdir(usr_dir_path)).or_log_error();
	if (dir_result.has_failed) return result.finalize_with_code(SDK.ExitCodes.ErrUnknown);

	/* create user files */
	for (let [path, content] of [
		["dispname", dispname],
		["hash", hash],
	] as string[][]) {
		(await SDK.Registry.write(SDK.Registry.join_paths("usrman/users", unum, path), content))
			.or_log_error()
			.err(() => result.code = SDK.ExitCodes.ErrUnknown);
	}

	return result;
}

/* HELPERS */
async function get_hash(string: string) {
	return (await Bcrypt.hash(string, 10));
}

function convert_to_t9(string: string) {
	function get_key(char: string) {
		switch (char) {
			case "1": 
				return "1";
			case "2": case "a": case "b": case "c":
				return "2";
			case "3": case "d": case "e": case "f":
				return "3";
			case "4": case "g": case "h": case "i":
				return "4";
			case "5": case "j": case "k": case "l":
				return "5";
			case "6": case "m": case "n": case "o":
				return "6";
			case "7": case "p": case "q": case "r": case "s":
				return "7";
			case "8": case "t": case "u": case "v":
				return "8";
			case "9": case "w": case "x": case "y": case "z":
				return "9";
			default:
				return "0";
		}
	}

	const chars = string.split("");
	let t9_string = "";

	for (let char of chars) {
		t9_string += get_key(char);
	}

	return t9_string;
}

SDK.start_service(main, (result) => console.log(result.to_string()));
