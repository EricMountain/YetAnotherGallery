#!/bin/bash

set -o errexit
#set -x

approot=${0%/*}/..

if [ -z "$1" -o ! -d "$1" ] ; then
    echo Specify directory for which to generate JSON index.
    exit 1
fi

fulldir=`realpath -s $1`
dirbase=`basename $fulldir`

# Generate JSON index
j=$fulldir.json

rm -f $j

cat - >> $j <<EOF
{
  "images": [ 
EOF

cd $1/medium

first=1
for x in * ; do
    if [ $first -ne 1 ] ; then
        echo ',' >> $j
    else
        first=0
    fi

    echo -n '               { "file": "'$x'", "description": "Image '$x'" }' >> $j
done
cd - > /dev/null

cat - >> $j <<EOF

            ]
}
EOF


