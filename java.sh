#!/bin/bash

/usr/bin/env mvn package exec:java -Dexec.args="$1 $2"
