#!/usr/bin/env bash
git clone https://github.com/eea/annotator.git annotator

cd annotator
npm install .
./update

cp pkg/annotator-full.js ../
cp pkg/annotator.css ../

cd ../
rm -rf annotator
