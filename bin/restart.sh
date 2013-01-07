#!/bin/bash

app="/var/www/weighmyplate/current"

cd $app && npm install
mongroup restart

