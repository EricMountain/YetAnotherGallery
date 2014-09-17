#!/bin/bash

set -o errexit

# From http://www.imagemagick.org/Usage/text/#text_operators

approot=${0%/*}/..


# Generate sample images for test purposes

mkdir -p $approot/app/sample/images/medium
mkdir -p $approot/app/sample/images/small

for i in {1..100} ; do
    convert -background lightgray -fill black -size 800x600 -gravity center label:$i $approot/app/sample/images/medium/$i.jpg
    convert -background lightgray -fill black -size 180x120 -gravity center label:$i $approot/app/sample/images/small/$i.jpg
done

# Generate matching JSON index
j=$approot/app/sample/sample.json

rm -f $j

cat - >> $j <<EOF
{
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
