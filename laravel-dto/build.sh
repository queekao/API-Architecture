#!/bin/bash -x

set -e

VERSION=${1}
BRANCH=${2}
BUILD_FOLDER=build
OUTPUT_FOLDER=output

if [[ "${1}" == "" ]]; then
    echo "Missing version argument"
    exit 1
fi

if [[ "${2}" == "" ]]; then
    echo "Missing branch argument (develop/staging/main)"
    exit 1
fi

OS=""
if [ -n "$WINDIR" ] || [ -n "$SYSTEMROOT" ]; then
    OS="Windows"
else
    OS="Linux"
fi

[ -d ${BUILD_FOLDER} ] && rm -rf ${BUILD_FOLDER}
mkdir ${BUILD_FOLDER}

git archive ${BRANCH} | tar -x -C ./${BUILD_FOLDER}/


# Build
(cd ${BUILD_FOLDER} && composer install && yarn install && yarn run build)
(cd ${BUILD_FOLDER} && chmod -R 777 storage bootstrap/cache)


if [ "$OS" == "Linux" ]; then
    # Create storage link.
    (cd ${BUILD_FOLDER} && ln -s ../storage/app/public public/storage)
fi

# Pack
[ -d ${OUTPUT_FOLDER} ] && rm -rf ${OUTPUT_FOLDER}
mkdir ${OUTPUT_FOLDER}
if [ "$OS" == "Windows" ]; then
    (cd ${BUILD_FOLDER} && zip -rq ../${OUTPUT_FOLDER}/${VERSION}.zip ./* -x node_modules/\*)
else
    (cd ${BUILD_FOLDER} && zip --symlinks -rq ../${OUTPUT_FOLDER}/${VERSION}.zip ./* -x node_modules/\*)
fi
