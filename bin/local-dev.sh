#!/usr/bin/env bash

# find script base dir even with symlinks (such as when in node_modules/.bin) http://stackoverflow.com/a/246128/583755
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ]; do # resolve $SOURCE until the file is no longer a symlink
  ROOT_DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"
  SOURCE="$(readlink "$SOURCE")"
  [[ $SOURCE != /* ]] && SOURCE="$ROOT_DIR/$SOURCE" # if $SOURCE was a relative symlink, we need to resolve it relative to the path where the symlink file was located
done
ROOT_DIR="$( cd -P "$( dirname "$SOURCE" )" && cd .. && pwd )"

if [ -z ${PROJECT_PATH+x} ] ; then
  PROJECT_PATH="$( cd -P "$( dirname "$ROOT_DIR" )" && cd .. && pwd )"

  echo Did not receive a PROJECT_PATH, defaulting to $PROJECT_PATH
else
  echo "Project path is set to '$PROJECT_PATH'"
fi

# lifted from http://stackoverflow.com/a/13864829/583755
compile() {
  echo
  echo Files have changed, updating universal-redux...
  echo
  echo Source: $ROOT_DIR
  echo Destination: $PROJECT_PATH/node_modules/universal-redux
  echo
  cp -a $ROOT_DIR/bin/* $PROJECT_PATH/node_modules/universal-redux/bin/ > /dev/null
  cp -a $ROOT_DIR/config/* $PROJECT_PATH/node_modules/universal-redux/config/ > /dev/null
  cp $ROOT_DIR/.babelrc $PROJECT_PATH/node_modules/universal-redux
  cp $ROOT_DIR/.eslintrc $PROJECT_PATH/node_modules/universal-redux
  babel $ROOT_DIR/src/ --presets es2015,stage-0,react --plugins transform-runtime --out-dir $PROJECT_PATH/node_modules/universal-redux/lib > /dev/null
  echo Update complete, continuing to watch...
}

# lifted from http://stackoverflow.com/a/9461685/583755
chsum1=""

while [[ true ]]
do
    chsum2=`find $ROOT_DIR/src $ROOT_DIR/bin $ROOT_DIR/config -type f -exec md5 {} \;`
    if [[ $chsum1 != $chsum2 ]] ; then           
        compile
        chsum1=$chsum2
    fi
    sleep 2
done
