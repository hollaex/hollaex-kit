#!/bin/bash

echo "Pulling HollaEx CLI from Github..."
curl -L https://raw.githubusercontent.com/bitholla/hollaex-cli/master/install.sh | bash

# Dependencies installer for Debian (Ubuntu) based Linux.
if command apt-get -v > /dev/null 2>&1; then

    if ! command docker -v > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires Docker to operate. Installing it now...\033[39m\n"
        
        echo "Updating APT list"
        sudo apt-get update

        echo "Installing Docker"
        if command sudo apt-get install -y docker.io; then

            echo "\n\033[92mDocker has been successfully installed!\033[39m\n"

        else

            printf "\n\033[91mFailed to install Docker-Compose. Please review the logs and try again.\033[39m\n"
            exit 1;

        fi


        echo "Adding current user to Docker usergroup"
        sudo gpasswd -a $USER docker

        if ! command docker-compose -v > /dev/null 2>&1; then

            printf "\n\033[93mHollaEx CLI requires Docker-Compose to operate. Installing it now...\033[39m\n"
            if command sudo apt-get install -y docker-compose; then

                echo "\n\033[92mDocker-Compose has been successfully installed!\033[39m\n"

            else

                printf "\n\033[91mFailed to install Docker-Compose. Please review the logs and try again.\033[39m\n"
                exit 1;

            fi

        fi

    fi

fi

if ! command docker -v > /dev/null 2>&1 || ! command docker-compose -v > /dev/null 2>&1; then 

    printf "\n\033[93mNote: HollaEx CLI requires Docker and Docker-Compose to operate.\033[39m\n"
    printf "\n\033[93mPlease install them before you proceed to run exchange.\033[39m\n"

else 

    echo -e "\nYou are good to go!"

fi