#!/bin/bash

echo "Build script"

# add the commands here

npm install && cd ../frontend && npm install && cd ../backend
rm -rf static_build && cd ../frontend && npm run build && cp -r build/. ../backend/static_build