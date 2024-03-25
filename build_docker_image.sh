#!/bin/bash

PACKAGE_JSON_VERSION=$(cat server/package.json | jq -r ".version")
GIT_COMMIT_ID=$(git rev-parse HEAD | cut -c 1-7)
ARCH="amd64"

# Docker buildx multi-arch-builder creation
docker buildx create --use --name multi-arch-builder

docker buildx build --load --platform=linux/$ARCH -t hollaex/hollaex-kit:$PACKAGE_JSON_VERSION -f Dockerfile .

echo "Do you also want to push built image to Docker hub? (y/n)"

read answer

if [ "$answer" != "${answer#[Yy]}" ] ;then

    docker push hollaex/hollaex-kit:$PACKAGE_JSON_VERSION

else

    echo "*** Exiting... ***"
    exit 0;

fi

#docker push bitholla/robolla-v3:$PACKAGE_JSON_VERSION-$GIT_COMMIT_ID