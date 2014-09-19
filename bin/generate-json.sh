#!/bin/bash

set -o errexit
set -x
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
find . -follow -type f -exec echo '               { "file": "'{}'", "description": "Image '{}'" },' \; >> $j
cd -

cat - >> $j <<EOF
            ]
}
EOF

sed -i -e 's/.\///g' $j
