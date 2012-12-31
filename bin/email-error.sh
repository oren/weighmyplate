#!/bin/bash

# echo 'weighmyplate restarted' | mail -s 'weighmyplate restarted' orengolan@gmail.com

command -v node >/dev/null 2>&1 || { echo >&2 "I require node but it's not installed.  Aborting."; exit 1; }

dir=$(dirname $0)
cmd="node $dir/email-error.js"

$cmd
