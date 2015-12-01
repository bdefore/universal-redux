#!/usr/bin/env bash

# lifted from http://stackoverflow.com/a/13864829/583755
if [ -z ${PROJECT_PATH+x} ]; then echo "You must specify a PROJECT_PATH where you want node_modules/redux-universal-renderer to be updated"; exit; else echo "Project path is set to '$PROJECT_PATH'"; fi

compile() {
  echo Updating redux-universal-renderer libraries.
  echo
  cp bin/* $PROJECT_PATH/node_modules/redux-universal-renderer/bin/
  cp config/* $PROJECT_PATH/node_modules/redux-universal-renderer/config/
  babel src/ -d $PROJECT_PATH/node_modules/redux-universal-renderer/lib
}

# lifted from http://stackoverflow.com/a/9461685/583755
chsum1=""

while [[ true ]]
do
    chsum2=`find src bin config -type f -exec md5 {} \;`
    if [[ $chsum1 != $chsum2 ]] ; then           
        compile
        chsum1=$chsum2
    fi
    sleep 2
done
