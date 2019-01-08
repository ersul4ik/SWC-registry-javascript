#!/usr/bin/env bash
set -e
DST_DIR=deps/solidity-parser-antlr

rm -rf ${DST_DIR}

echo "Cloning from github"
git clone https://github.com/thec00n/solidity-parser-antlr -b master ${DST_DIR}
cd ${DST_DIR}

echo "Building solidity-parser-antlr"
npm install
npm run build
cd -

echo "Installing package"
npm install ${DST_DIR} --no-save
