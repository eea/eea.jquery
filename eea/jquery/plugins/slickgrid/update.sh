#!/usr/bin/env bash
git clone https://github.com/eea/SlickGrid.git /tmp/SlickGrid

# Update CSS
cat /tmp/SlickGrid/examples/*-theme.css /tmp/SlickGrid/*.css /tmp/SlickGrid/controls/*.css /tmp/SlickGrid/plugins/*.css slick.custom.css > /tmp/SlickGrid/all.css
cp /tmp/SlickGrid/all.css slick.grid.css

# Minify
#java -jar ../../utils/yuic slick.grid.css -o slick.grid.min.css

# Update JS
cat /tmp/SlickGrid/lib/jquery.event*.js /tmp/SlickGrid/*.js /tmp/SlickGrid/controls/*.js /tmp/SlickGrid/plugins/*.js > /tmp/SlickGrid/all.js
cp /tmp/SlickGrid/all.js slick.grid.js

# Minify
#java -jar ../../utils/yuic slick.grid.js -o slick.grid.min.js

rm -rf /tmp/SlickGrid
