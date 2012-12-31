#!/bin/bash

name="weighmyplate"
pids="/var/run/$name"
logs="/var/log/$name"
app="/home/oren/misc/projects/$name/"

# mon -d "node $app/server.js" -p $pids/$name.pid -l $logs/$name.log --attempts 3 --on-restart $app/bin/email-restart.sh --on-error $app/bin/email-error.sh
mon -d "node $app/server.js" -p $pids/$name.pid -l $logs/$name.log
