#! /usr/bin/env node

import Bcrypt from "bcrypt";

import * as SDK from "@the-stations-project/sdk";

/* MAIN */
async function main(subcommand: string, args: string[]) {
	switch (subcommand) {
		case "create": return await create(args[0], args[1], args[2]);
		case "auth": return await auth(args[0], args[1]);
		case "get": return await get(args[0], args[1]);
		case "set": return await set(args[0], args[1], args[2]);
		case "change_pswd": return await change_pswd(args[0], args[1]);
		case "close_account": return await close_account(args[0]);
		default: return new SDK.Result(SDK.ExitCodes.ErrUnknown, undefined);
	}
}

/* SUB-FUNCTIONS */
enum UserCreationExitCodes {
	Ok = 0,
	ErrUnknown = 1,
	ErrUserNameTaken = 2,
	ErrMissingParameter = 3,
}

async function create(dispname: string, uname: string, pswd: string) {
	const result = new SDK.Result(UserCreationExitCodes.Ok, "");

	/* safety */
	if (arguments.length < 3) return result.finalize_with_code(UserCreationExitCodes.ErrMissingParameter);

	/* prepare */
	const hash = await get_hash(pswd);
	const usr_dir_path = SDK.Registry.join_paths("users", uname);

	/* block if username exists */
	const test_result = await SDK.Registry.test(usr_dir_path);
	if (!test_result.has_failed) return result.finalize_with_code(UserCreationExitCodes.ErrUserNameTaken)

	/* create user directory */
	const dir_result = (await SDK.Registry.mkdir(usr_dir_path)).or_log_error();
	if (dir_result.has_failed) return result.finalize_with_code(UserCreationExitCodes.ErrUnknown);

	/* create user files */
	for (let [path, content] of [
		["dispname", dispname],
		["hash", hash],
	] as string[][]) {
		(await SDK.Registry.write(SDK.Registry.join_paths("users", uname, path), content))
			.or_log_error()
			.err(() => result.code = UserCreationExitCodes.ErrUnknown);
	}

	return result.finalize_with_value(uname);
}

async function auth(uname: string, pswd: string) {
	const result = new SDK.Result(SDK.ExitCodes.Ok, false);

	/* safety */
	if (arguments.length < 2) return result.finalize_with_code(SDK.ExitCodes.ErrMissingParameter);

	/* get correct hash */
	const hash_path = SDK.Registry.join_paths("users", uname, "hash");
	const read_result = (await SDK.Registry.read(hash_path)).or_log_error();
	if (read_result.has_failed) return result.finalize_with_code(SDK.ExitCodes.ErrUnknown);
	const correct_hash = read_result.value!;

	/* compare */
	const is_correct = await Bcrypt.compare(pswd, correct_hash);

	return result.finalize_with_value(is_correct);
}

async function get(uname: string, prop: string) {
	const result = new SDK.Result(SDK.ExitCodes.Ok, "");

	/* safety */
	if (arguments.length < 2) return result.finalize_with_code(SDK.ExitCodes.ErrMissingParameter);

	/* get path */
	const path = SDK.Registry.join_paths("users", uname, prop);

	/* read file */
	const read_result = (await SDK.Registry.read(path)).or_log_error();
	if (read_result.has_failed) return result.finalize_with_code(SDK.ExitCodes.ErrUnknown); 
	const text = read_result.value!;

	/* return */
	return result.finalize_with_value(text);
}

async function set(uname: string, prop: string, value: string) {
	const result = new SDK.Result(SDK.ExitCodes.Ok, undefined);

	/* safety */
	if (arguments.length < 3) return result.finalize_with_code(SDK.ExitCodes.ErrMissingParameter);

	/* get path */
	const path = SDK.Registry.join_paths("users", uname, prop);

	/* write file */
	const write_result = (await SDK.Registry.write(path, value)).or_log_error();
	if (write_result.has_failed) return result.finalize_with_code(SDK.ExitCodes.ErrUnknown); 
	
	return result;
}

async function change_pswd(uname: string, new_pswd: string) {
	const result = new SDK.Result(SDK.ExitCodes.Ok, undefined);

	/* hash password */
	const hash = await get_hash(new_pswd);

	/* store new hash */
	(await set(uname, "hash", hash)).or_log_error()
		.err(() => result.finalize_with_code(SDK.ExitCodes.ErrUnknown));

	return result;
}

async function close_account(uname: string) {
	const result = new SDK.Result(SDK.ExitCodes.Ok, undefined);

	/* safety */
	if (arguments.length < 1) return result.finalize_with_code(SDK.ExitCodes.ErrMissingParameter);

	/* get path */
	const path = SDK.Registry.join_paths("users/", uname);

	/* delete user */
	const del_result = (await SDK.Registry.delete(path)).or_log_error();
	if (del_result.has_failed) return result.finalize_with_code(SDK.ExitCodes.ErrUnknown);

	/* reserve username and store deletion date */
	const timestamp = new Date().toISOString();
	const write_result = (await SDK.Registry.write(path, timestamp)).or_log_error();
	if (write_result.has_failed) return result.finalize_with_code(SDK.ExitCodes.ErrUnknown);

	return result;
}

/* HELPERS */
async function get_hash(string: string) {
	return (await Bcrypt.hash(string, 10));
}

SDK.start_service(main, (result) => console.log(result.to_string()));
