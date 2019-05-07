#!/bin/bash

# Start in scripts/ even if run from root directory
cd "$(dirname "$0")"

# Exit the script on any command with non 0 return code
# We assume that all the commands in the pipeline set their return code
# properly and that we do not need to validate that the output is correct
set -e

# Echo every command being executed
set -x

# Go to root
cd ..
root_path=$PWD

name="$(node -pe "require('./package.json').name")"
version="$(node -pe "require('./package.json').version")"
echo $name
echo $version

docker build --rm -t $name:$version .
docker save $name:$version | gzip | pv | ssh onno@onno.codes "docker load"
