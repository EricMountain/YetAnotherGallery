#!/bin/bash

# Generate a JSON index for the images contained in the specified directory
#
# Assume a direcory structure similar to te following:
#
# |- $1
#    |- small
#       |- small photos
#    |- large
#       |- large photos
#
# There can be any number of subdirectories containing inages.
# We assume all subdirectories contain the same images, jast in different sizes.
#
# The generated JSON index includes the list of photos, and the list of sizes.

set -o errexit
#set -x

approot=${0%/*}/..

if [ -z "$1" -o ! -d "$1" ] ; then
    echo Specify directory for which to generate JSON index.
    exit 1
fi

fulldir=`realpath -s $1`
dirbase=`basename $fulldir`

# Generate JSON index in this file
j="$fulldir.json"


writeHeader() {
    dest=$1
    rm -f "$dest"
    cat - >> "$dest" <<EOF
{
EOF
}

writeTrailer() {
    dest=$1
    dir=$2
    cat - >> "$dest" <<EOF
}
EOF
}

listSizes() {
    dest=$1
    dir=$2
    cat - >> "$dest" <<EOF
        "sizes": [
EOF

    firstsz=1
    for s in $(find "$dir" -maxdepth 1 -mindepth 1 \( -type d -o -type l \) -printf '%f\n') ; do
        if [ $firstsz -ne 1 ] ; then
            echo ',' >> "$dest"
        else
            firstsz=0
        fi

        sample=$(ls -1 "$dir/$s" | head -1)
        surface=$(identify "$dir/$s/$sample" | cut -f  3 -d ' ' | sed -e 's/x/*/' | bc)
        echo -n '               {"label": "'$s'", "surface": '$surface'}' >> "$dest"
    done
    cat - >> "$dest" <<EOF

            ],
EOF
}

listImages() {
    dest="$1"
    dir="$2"
    cat - >> "$dest" <<EOF
      "images": [
EOF

    onesize=$(find "$dir" -maxdepth 1 -mindepth 1 \( -type d -o -type l \) -printf '%f\n' | head -1)

    cd "$dir/$onesize"

    first=1
    for x in * ; do
        if [ $first -ne 1 ] ; then
            echo ',' >> "$dest"
        else
            first=0
        fi

        echo -n '               { "file": "'$x'", "description": "Image '$x'" }' >> "$dest"
    done
    cd - > /dev/null

    cat - >> "$dest" <<EOF

            ]
EOF
}

writeHeader "$j"
listSizes "$j" "$1"
listImages "$j" "$1"
writeTrailer "$j"
