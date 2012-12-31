#!/bin/bash

app="/var/run/weighmyplate"

kill `cat $app/weighmyplate.pid`
