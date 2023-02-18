#! /usr/bin/env node

import * as SDK from "@the-stations-project/sdk";

async function init() {
	const result = new SDK.Result(SDK.ExitCodes.Ok, undefined);

	/* create directory */
	(await SDK.Registry.mkdir("usrman"))
		.err(() => result.code = SDK.ExitCodes.ErrUnknown);

	return result;
}

SDK.start_service(init, (result) => console.log(result.to_string()));
