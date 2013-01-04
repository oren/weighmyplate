#!/bin/bash

app="/var/www/weighmyplate/current"

cd $app && /home/oren/nvm/v0.8.9/bin/npm install
mongroup restart

