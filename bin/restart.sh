#!/bin/bash

name="weighmyplate"
app="/var/www/$name/current"
pids="/var/www/$name/shared/pids"
logs="/var/www/$name/shared/logs"

cd $app
/home/oren/nvm/v0.8.9/bin/npm install

mongroup restart

