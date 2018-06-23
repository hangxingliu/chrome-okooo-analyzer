#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";
pushd "$DIR";

FROM="../../dev/analyzer.js";
TO="_data_builder.js";

if [[ ! -f "$FROM" ]]; then
	echo "fatal: $FROM is missing!";
	exit 1;
fi

awk '
	NR == 3 {
		print "";
		print "// ===================================================";
		print "//                 **FBI Warning!**";
		print "//"
		print "//   This file is copy from: dev/test/analyzer.js";
		print "//         Dont modify this file manually!"
		print "//";
		print "// ===================================================";
		print "";
	}
	# typescript reference
	/reference\s+path/ { gsub(/\.\//, "../../dev/", $0); }
	/magic_number_4863902_means_end/ { exit; }
	/^function/ { printf "export "; }
	{
		print $0;
	}
' "$FROM" > "$TO";
if [[ "$?" != "0" ]]; then
	echo "fatal: install $TO failed!";
	exit 1;
fi
