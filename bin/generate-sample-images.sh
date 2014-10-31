#!/bin/bash

set -o errexit

# ImageMagick label generation trick from http://www.imagemagick.org/Usage/text/#text_operators

approot=${0%/*}/..


# Generate sample images for test purposes

mkdir -p $approot/app/sample/sample/medium
mkdir -p $approot/app/sample/sample/small

for i in {1..100} ; do
    convert -background lightgray -fill black -size 800x600 -gravity center label:$i $approot/app/sample/sample/medium/$i.jpg
    convert -background lightgray -fill black -size 180x120 -gravity center label:$i $approot/app/sample/sample/small/$i.jpg
done

# Generate matching JSON index
j=$approot/app/sample/sample.json

rm -f $j

cat - >> $j <<EOF
{
  "sizes": [ "medium", "small"],
  "images": [
EOF

for i in {1..100} ; do
    echo -n '               { "file": "'$i.jpg'", "description": "Image '$i'" }' >> $j

    if [ $i -eq 100 ]; then
        echo >> $j
    else
        echo ',' >> $j
    fi
done

cat - >> $j <<EOF
            ]
}
EOF
