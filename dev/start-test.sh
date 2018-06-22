#!/usr/bin/env bash

if [[ -z `which http-server` ]]; then
	echo "fatal: npm install http-server -g";
	exit 1;
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR";

PORT=10999

xdg-open "http://127.0.0.1:${PORT}/test";
http-server -s -p "$PORT";

echo "Stoped!";

