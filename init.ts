#! /usr/bin/env node

import { Registry } from "@the-stations-project/sdk";

async function main() {
	(await Registry.write("services/usrman", "npx usrman")).or_panic();
	(await Registry.mkdir("users")).or_panic();;
}

main();
