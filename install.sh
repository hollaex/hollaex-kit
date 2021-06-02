#!/bin/bash

# Parameter support to specify version of the CLI to install.
export HOLLAEX_INSTALLER_VERSION_TARGET=${1:-"master"}

echo "Pulling HollaEx CLI from Github..."
curl -s https://raw.githubusercontent.com/bitholla/hollaex-cli/master/install.sh > cli_installer.sh && \
    bash cli_installer.sh ${HOLLAEX_INSTALLER_VERSION_TARGET} \
    rm cli_installer.sh

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

            printf "\n\033[91mFailed to install Docker.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo apt-get install -y docker.io'."
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

            printf "\n\033[91mFailed to install Docker-Compose.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo apt-get install -y docker-compose'."
            exit 1;

        fi

    fi

    if ! command jq --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires jq to operate. Installing it now...\033[39m\n"

        if [[ ! $IS_APT_UPDATED ]]; then

            echo "Updating APT list"
            sudo apt-get update
        fi

        if command sudo apt-get install -y jq; then

            printf "\n\033[92mjq has been successfully installed!\033[39m\n"

            echo "Info: $(jq --version)"

        else

            printf "\n\033[91mFailed to install jq.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo apt-get install -y jq'."

        fi

    fi

    if ! command nslookup -version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires nslookup to operate. Installing it now...\033[39m\n"

        if [[ ! $IS_APT_UPDATED ]]; then

            echo "Updating APT list"
            sudo apt-get update
        fi

        if command sudo apt-get install -y dnsutils; then

            printf "\n\033[92mnslookup(dnsutils) has been successfully installed!\033[39m\n"

            echo "Info: "
            nslookup -version

        else

            printf "\n\033[91mFailed to install nslookup.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo apt-get install -y dnsutils'."

        fi

    fi

# Dependencies installer for macOS with Homebrew.
elif command brew -v > /dev/null 2>&1; then


    if ! command docker -v > /dev/null 2>&1; then

        echo "Updating Homebrew list"
        if command brew update; then

            IS_BREW_UPDATED=true

        fi

        echo "Automated installation for Docker on macOS is not supported."
        echo "Please download 'Docker for Mac' on Official Docker website and proceed to install."
        echo "Official Installation Page: (docs.docker.com/docker-for-mac/install)."

    fi

    if ! command docker-compose -v > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires Docker-Compose to operate. Installing it now...\033[39m\n"

        if [[ ! $IS_BREW_UPDATED ]]; then

            echo "Updating Homebrew list"
            brew update
        fi

        if command brew install docker-compose; then

            printf "\n\033[92mDocker-Compose has been successfully installed!\033[39m\n"

            echo "Info: $(docker-compose -v)"

        else

            printf "\n\033[91mFailed to install Docker-Compose.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'brew install docker-compose'."
            exit 1;

        fi

    fi

    if ! command jq --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires jq to operate. Installing it now...\033[39m\n"

        if [[ ! $IS_BREW_UPDATED ]]; then

            echo "Updating Homebrew list"
            brew update
        fi

        if command brew install jq; then

            printf "\n\033[92mjq has been successfully installed!\033[39m\n"

            echo "Info: $(jq --version)"

        else

            printf "\n\033[91mFailed to install jq.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'brew install jq'."

        fi

    fi

# Dependencies installer for CentOS (RHEL) with Yum.
elif command yum --version > /dev/null 2>&1; then

    if ! command docker -v > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires Docker to operate. Installing it now...\033[39m\n"

        echo "Adding Docker-CE repository on Yum..."
        sudo yum install -y yum-utils
        sudo yum-config-manager \
            --add-repo \
            https://download.docker.com/linux/centos/docker-ce.repo

        echo "Installing Docker"
        if command sudo yum install docker-ce docker-ce-cli containerd.io -y --nobest; then

            printf "\n\033[92mDocker has been successfully installed!\033[39m\n"
            echo "Info: $(docker -v)"

            echo -e "\nAdding current user to Docker usergroup"
            if command sudo gpasswd -a $USER docker; then

                    DOCKER_USERGROUP_ADDED=true

            fi

            systemctl start docker
            systemctl enable docker

        else

            printf "\n\033[91mFailed to install Docker.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo yum install -y docker-ce docker-ce-cli containerd.io'."
            exit 1;

        fi

    fi

    if ! command docker-compose -v > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires Docker-Compose to operate. Installing it now...\033[39m\n"

        if command curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose; then

            sudo chmod +x /usr/local/bin/docker-compose

            printf "\n\033[92mDocker-Compose has been successfully installed!\033[39m\n"

            echo "Info: $(docker-compose -v)"

        else

            printf "\n\033[91mFailed to install Docker-Compose.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'https://github.com/docker/compose/releases'."
            exit 1;

        fi

    fi

    if ! command jq --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires jq to operate. Installing it now...\033[39m\n"

        if command sudo yum install -y jq; then

            printf "\n\033[92mjq has been successfully installed!\033[39m\n"

            echo "Info: $(jq --version)"

        else

            printf "\n\033[91mFailed to install jq.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo yum install -y jq'."

        fi

    fi

    if ! command nslookup -version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires nslookup to operate. Installing it now...\033[39m\n"

        if command sudo yum install -y bind-utils; then

            printf "\n\033[92mnslookup(bind-utils) has been successfully installed!\033[39m\n"

            echo "Info: "
            nslookup -version

        else

            printf "\n\033[91mFailed to install nslookup.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo yum install -y bind-utils'."

        fi

    fi

fi

if ! command docker -v > /dev/null 2>&1 || ! command docker-compose -v > /dev/null 2>&1  || ! command jq --version > /dev/null 2>&1 || ! command nslookup -version > /dev/null 2>&1; then

    if command docker -v > /dev/null 2>&1; then

        IS_DOCKER_INSTALLED=true
    
    fi

    if command docker-compose -v > /dev/null 2>&1; then

        IS_DOCKER_COMPOSE_INSTALLED=true
    
    fi

    if command jq --version > /dev/null 2>&1; then

        IS_JQ_INSTALLED=true
    
    fi

    if command nslookup -version > /dev/null 2>&1; then

        IS_NSLOOKUP_INSTALLED=true
    
    fi
    
    printf "\n\033[93mNote: HollaEx CLI requires Docker, Docker-Compose, and jq to operate.\033[39m\n\n"

    # Docker installation status chekc
    if [[ "$IS_DOCKER_INSTALLED" ]]; then

        printf "\033[92mDocker: Installed\033[39m\n"

    else 

        printf "\033[91mDocker: Not Installed\033[39m\n"
    
    fi  

    # Docker-compose installation status check
    if [[ "$IS_DOCKER_COMPOSE_INSTALLED" ]]; then

        printf "\033[92mDocker-Compose: Installed\033[39m\n"

    else

        printf "\033[91mDocker-Compose: Not Installed\033[39m\n"

    fi

    # jq installation status check
    if [[ "$IS_JQ_INSTALLED" ]]; then

        printf "\033[92mjq: Installed\033[39m\n"

    else 

        printf "\033[91mjq: Not Installed\033[39m\n"

    fi

    # nslookup installation status check
    if [[ "$IS_NSLOOKUP_INSTALLED" ]]; then

        printf "\033[92mnslookup: Installed\033[39m\n"

    else 

        printf "\033[91mnslookup: Not Installed\033[39m\n"

    fi

    printf "\n\033[93mPlease install the missing one before you proceed to run exchange.\033[39m\n"

else

   printf "\nYou are good to go!\n\n"

   if [[ "$IS_APT_UPDATED" ]] || [[ "$IS_BREW_UPDATED" ]]; then

        echo "Start configuring your exchange with the command: 'hollaex server --setup'."
        printf "\nTo see the full list of commands, use 'hollaex help'.\n\n"

   fi 

   if [[ "$DOCKER_USERGROUP_ADDED" ]]; then

        newgrp docker

   fi

fi

exit 0;