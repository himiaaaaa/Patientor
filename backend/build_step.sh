#!/bin/bash

echo "Build script"

# add the commands here

npm install && cd ../frontend && npm install && cd ../backend
rm -rf build && npm run build && cd ../frontend && npm run build && cp -r build/. ../backend/build/static_build