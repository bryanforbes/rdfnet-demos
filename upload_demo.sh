#!/bin/sh

DEMO_DIR=$1

if [ -z "$DEMO_DIR" ]; then
	echo "A directory must be provided"
	exit 1
fi

if [ ! -d ".packaging" ]; then
	mkdir -p .packaging
fi

PACKAGE_DIR=.packaging/$DEMO_DIR

if [ -d $PACKAGE_DIR ]; then
	rm -r $PACKAGE_DIR
fi

echo "Copying demo for packaging"
cp -r $DEMO_DIR .packaging/$DEMO_DIR
find $PACKAGE_DIR -name ".*.swp" -exec rm {} \;

REPLACE_FILES=$( grep -l -r -e "^<\!--@GA_SNIPPET@-->$" --exclude=".*.swp" $DEMO_DIR )
if [ ! -z "$REPLACE_FILES" ]; then
	echo "Deleting GA_SNIPPET for package files"
	for file in $REPLACE_FILES; do
		sed -i "/^<\!--@GA_SNIPPET@-->$/d" .packaging/$file
	done
fi

cd .packaging
echo "Creating $DEMO_DIR.tar.bz2"
tar cjf $DEMO_DIR.tar.bz2 --exclude=".*.swp" $DEMO_DIR/
echo "Creating $DEMO_DIR.zip"
zip -q -r $DEMO_DIR.zip $DEMO_DIR/ -x \*.swp
cd ..

if [ ! -z "$REPLACE_FILES" ]; then
	echo "Adding Google Analytics code for live files"
	for file in $REPLACE_FILES; do
		sed "/^<\!--@GA_SNIPPET@-->$/{
r ga_snippet.html
d
}" $REPLACE_FILES > .packaging/$file
	done
fi

DEMO_REMOTE=/home/bryan/rdf.net/demos/
echo "Uploading to $DEMO_REMOTE"

cd .packaging
scp -q $DEMO_DIR.tar.bz2 $DEMO_DIR.zip rdf:$DEMO_REMOTE
#tar czf - --exclude=".*.swp" $DEMO_DIR | ssh rdf "tar xzf - -C $DEMO_REMOTE"
rsync -az --exclude=".*.swp" $DEMO_DIR rdf:rdf.net/demos

echo "Cleaning up"
rm -r $DEMO_DIR*

echo "Done"
