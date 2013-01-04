#!/bin/bash

name="weighmyplate"
app="/var/www/$name/current"
pids="/var/www/$name/shared/pids"
logs="/var/www/$name/shared/logs"

cd $app
npm install

# mon -d "node $app/server.js" -p $pids/$name.pid -l $logs/$name.log --attempts 3 --on-restart $app/bin/email-restart.sh --on-error $app/bin/email-error.sh
# mon -d "node $app/server.js" -p $pids/$name.pid -l $logs/$name.log
mongroup start

