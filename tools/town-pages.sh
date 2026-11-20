#!/bin/sh
# Builds every Master Builder page from its start map (run after editor.js or engine changes).
cd "$(dirname "$0")/../lib/engines" || exit 1
python3 tools/makeeditor.py editor/master.html --master --start editor/rottnest-start.json
python3 tools/makeeditor.py editor/player.html --player --start editor/rottnest-start.json
python3 tools/makeeditor.py editor/index.html
python3 tools/makeeditor.py editor/prologue.html --prologue editor/rottnest-before-storm.json editor/rottnest-start.json
for t in freo vp hi airport regional cervantes lancelin pinnacles albany esperance; do
  [ -f editor/$t-start.json ] && python3 tools/makeeditor.py editor/$t-master.html --master --town $t --start editor/$t-start.json
done
