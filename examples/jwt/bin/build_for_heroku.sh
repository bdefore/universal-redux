#!/bin/bash
if [[ $NODE_ENV = 'production' ]] ; then npm run build ; else echo Skipping post-install Webpack build since environment is development ; fi
