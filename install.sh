#!/bin/bash

echo "Pulling HollaEx CLI from Github..."
curl -L https://raw.githubusercontent.com/bitholla/hollaex-cli/master/install.sh | bash

# Dependencies installer for Debian (Ubuntu) based Linux.
if command apt-get -v > /dev/null 2>&1; then

    if ! command docker -v > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires Docker to operate. Installing it now...\033[39m\n"

        echo "Updating APT list"
        sudo apt-get update
        IS_APT_UPDATED=true

        echo "Installing Docker"
        if command sudo apt-get install -y docker.io; then

            printf "\n\033[92mDocker has been successfully installed!\033[39m\n"
            echo "Info: $(docker -v)"

            echo -e "\nAdding current user to Docker usergroup"
            if command sudo gpasswd -a $USER docker; then

                    DOCKER_USERGROUP_ADDED=true

            fi

        else

            printf "\n\033[91mFailed to install Docker-Compose. Please review the logs and try again.\033[39m\n"
            exit 1;

        fi

    fi

    if ! command docker-compose -v > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires Docker-Compose to operate. Installing it now...\033[39m\n"

        if [[ ! $IS_APT_UPDATED ]]; then

            echo "Updating APT list"
            sudo apt-get update
        fi

        if command sudo apt-get install -y docker-compose; then

            printf "\n\033[92mDocker-Compose has been successfully installed!\033[39m\n"

            echo "Info: $(docker-compose -v)"

        else

            printf "\n\033[91mFailed to install Docker-Compose. Please review the logs and try again.\033[39m\n"
            exit 1;

        fi

    fi

fi

if ! command docker -v > /dev/null 2>&1 || ! command docker-compose -v > /dev/null 2>&1; then

    printf "\n\033[93mNote: HollaEx CLI requires Docker and Docker-Compose to operate.\033[39m\n"
    printf "\n\033[93mPlease install them before you proceed to run exchange.\033[39m\n"

else

   echo -e "\nYou are good to go!"

   if [[ "$DOCKER_USERGROUP_ADDED" ]]; then

        newgrp docker

   fi

fi

exit 0;