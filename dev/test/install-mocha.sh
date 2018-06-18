#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
pushd "$DIR";

[[ -d "mocha" ]] || mkdir "mocha";
cp ../../node_modules/mocha/mocha.css ./mocha &&
	cp ../../node_modules/mocha/mocha.js ./mocha;
