#! /usr/bin/env node

import { Registry } from "@the-stations-project/sdk";

Registry.write("services/usrman", "npx usrman");
Registry.mkdir("users");
