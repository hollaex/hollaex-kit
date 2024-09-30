#!/bin/bash

# Prevent to proceed if there are git conflicts on the settings files
function check_git_conflict() {
    local file=$1

    if grep -q '<< HEAD' "$file" && grep -q '==' "$file" && grep -q '>>' "$file"; then
        echo -e "\nError: Git conflict detected in file: $file"
        echo "Please check the file and fix the Git conflict to proceed."
        exit 1;
    fi
}

check_git_conflict settings/configmap;
check_git_conflict settings/secret;

export ARCH=$(uname -m | sed s/aarch64/arm64/ | sed s/x86_64/amd64/ | sed s/s390x/s390x/)

# Dependencies installer for Debian (Ubuntu) based Linux.
if command apt -v > /dev/null 2>&1; then

    if ! command curl --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires CURL to operate. Installing it now...\033[39m\n"

        echo "Updating APT list"
        sudo apt update
        IS_APT_UPDATED=true

        echo "Installing Docker"
        if command sudo apt install -y curl; then

            printf "\n\033[92mCURL has been successfully installed!\033[39m\n"
            echo "Info: $(curl --version)"

        else

            printf "\n\033[91mFailed to install CURL.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo apt install -y curl'."
            exit 1;

        fi

    fi

    if ! command docker -v > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires Docker to operate. Installing it now...\033[39m\n"

        echo "Updating APT list"
        sudo apt update
        IS_APT_UPDATED=true

        echo "Installing Docker"
        if command sudo apt install -y docker.io; then

            printf "\n\033[92mDocker has been successfully installed!\033[39m\n"
            echo "Info: $(docker -v)"

            echo -e "\nAdding current user to Docker usergroup"
            if command sudo gpasswd -a $USER docker; then

                    DOCKER_USERGROUP_ADDED=true

            fi

        else

            printf "\n\033[91mFailed to install Docker.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo apt install -y docker.io'."
            exit 1;

        fi

    fi

  
    if command docker-compose --version | grep -q '^docker-compose version 1'; then

        echo -e "\n\033[91mWarning: Detected Docker Compose v1 instead of v2.\033[39m"
        echo "HollaEx CLI v3+ requires Docker Compose v2."

        if command sudo apt list --installed docker-compose; then

            echo "Removing Docker-Compose v1 through the APT..."

            sudo apt remove -y docker-compose

        else
            
            echo "To proceed, please uninstall the current Docker Compose v1 and then run the install.sh script."
            echo -e "The install.sh script will automatically install Docker Compose v2 for you.\n"

            exit 1;
        
        fi

    fi

    if ! command -v docker-compose > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires docker-compose v2 to operate. Installing it now...\033[39m\n"

        if command sudo curl -SL https://github.com/docker/compose/releases/download/v2.29.1/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose; then

            chmod +x /usr/local/bin/docker-compose

            printf "\n\033[92mdocker compose v2has been successfully installed!\033[39m\n"

            echo "Info: $(docker-compose version)"
            

        else

            printf "\n\033[91mFailed to install docker compose v2.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'https://github.com/docker/compose/releases'."
            exit 1;

        fi

    fi

    if ! command jq --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires jq to operate. Installing it now...\033[39m\n"

        if [[ ! $IS_APT_UPDATED ]]; then

            echo "Updating APT list"
            sudo apt update
        fi

        if command sudo apt install -y jq; then

            printf "\n\033[92mjq has been successfully installed!\033[39m\n"

            echo "Info: $(jq --version)"

            

        else

            printf "\n\033[91mFailed to install jq.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo apt install -y jq'."

        fi

    fi

    if ! command yq --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires yq to operate. Installing it now...\033[39m\n"

        if command sudo curl -L https://github.com/mikefarah/yq/releases/download/v4.44.1/yq_$(uname -s)_$ARCH -o /usr/local/bin/yq; then
            
            chmod +x /usr/local/bin/yq

            printf "\n\033[92myq has been successfully installed!\033[39m\n"

            echo "Info: $(yq --version)"

        else

            printf "\n\033[91mFailed to install yq.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo apt install -y jq'."

        fi

    fi

    if ! command nslookup -version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires nslookup to operate. Installing it now...\033[39m\n"

        if [[ ! $IS_APT_UPDATED ]]; then

            echo "Updating APT list"
            sudo apt update
        fi

        if command sudo apt install -y dnsutils; then

            printf "\n\033[92mnslookup(dnsutils) has been successfully installed!\033[39m\n"

            echo "Info: "
            nslookup -version

        else

            printf "\n\033[91mFailed to install nslookup.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo apt install -y dnsutils'."

        fi

    fi

    if ! command psql --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires PSQL Client to operate. Installing it now...\033[39m\n"

        if [[ ! $IS_APT_UPDATED ]]; then

            echo "Updating APT list"
            sudo apt update
        fi

        echo "Installing Docker"
        if command sudo apt install -y postgresql-client; then

            printf "\n\033[92mPSQL Client has been successfully installed!\033[39m\n"
            echo "Info: $(psql --version)"

        else

            printf "\n\033[91mFailed to install PSQL Client.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo apt install -y postgresql-client'."
            exit 1;

        fi

    fi

# Dependencies installer for macOS with Homebrew.
elif command brew -v > /dev/null 2>&1; then

    echo "Generating /usr/local/bin folder."
    
    if [[ ! -d  "/usr/local/bin" ]]; then
            
        sudo mkdir -p -m 775 /usr/local/bin

    fi

    if ! command curl --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires CURL to operate. Installing it now...\033[39m\n"

        if [[ ! $IS_BREW_UPDATED ]]; then

            echo "Updating Homebrew list"
            brew update
        fi

        if command brew install curl; then

            printf "\n\033[92mCURL has been successfully installed!\033[39m\n"

            echo "Info: $(curl --version)"

        else

            printf "\n\033[91mFailed to install CURL.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'brew install curl'."
            exit 1;

        fi

    fi

    if ! command docker -v > /dev/null 2>&1; then

        echo "Updating Homebrew list"
        if command brew update; then

            IS_BREW_UPDATED=true

        fi

        if command brew install --cask docker; then

            printf "\n\033[92mDocker Desktop has been successfully installed!\033[39m\n"

            open /Applications/Docker.app

            echo "Please go through the Docker Desktop setup on GUI."

            # echo "Info: $(docker --version)"

        else

            printf "\n\033[91mFailed to install Docker Desktop.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'brew install --cask docker'."
            echo -e "You can also visit the official installation page: (docs.docker.com/docker-for-mac/install).\n"
            exit 1;

        fi

    fi

    if command docker-compose --version | grep -q '^docker-compose version 1'; then

        echo -e "\n\033[91mError: Detected Docker Compose v1 instead of v2.\033[39m"
        echo "HollaEx CLI v3+ requires Docker Compose v2."
        echo "To proceed, please uninstall the current Docker Compose v1 and then run the install.sh script."
        echo -e "The install.sh script will automatically install Docker Compose v2 for you.\n"

        exit 1;

    fi

    if ! command -v docker-compose > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires docker-compose v2 to operate. Installing it now...\033[39m\n"

        if command sudo curl -SL https://github.com/docker/compose/releases/download/v2.29.1/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose; then

            chmod +x /usr/local/bin/docker-compose

            printf "\n\033[92mdocker compose v2has been successfully installed!\033[39m\n"

            echo "Info: $(docker-compose version)"
            

        else

            printf "\n\033[91mFailed to install docker compose v2.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'https://github.com/docker/compose/releases'."
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

    if ! command yq --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires yq to operate. Installing it now...\033[39m\n"

        if [[ ! $IS_BREW_UPDATED ]]; then

            echo "Updating Homebrew list"
            brew update
        fi

        if command brew install yq; then

            printf "\n\033[92myq has been successfully installed!\033[39m\n"

            echo "Info: $(yq --version)"

        else

            printf "\n\033[91mFailed to install yq.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'brew install yq'."

        fi

    fi

    if ! command psql --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires PSQL Client to operate. Installing it now...\033[39m\n"

        if [[ ! $IS_BREW_UPDATED ]]; then

            echo "Updating Homebrew list"
            brew update
        fi

        if command brew install libpq; then

            printf "\n\033[92mjq has been successfully installed!\033[39m\n"

            echo "Creating a symlink for the PSQL Client."

            sudo ln -s $(brew --prefix)/opt/libpq/bin/psql /usr/local/bin/psql

            echo "Info: $(psql --version)"

        else

            printf "\n\033[91mFailed to install PSQL Client.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'brew install ligpq'."

        fi

    fi

# Dependencies installer for CentOS (RHEL) with Yum.
elif command yum --version > /dev/null 2>&1; then

    if ! command curl --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires CURL to operate. Installing it now...\033[39m\n"

        if command sudo yum install -y curl; then

            printf "\n\033[92mCURL has been successfully installed!\033[39m\n"

            echo "Info: $(curl --version)"

        else

            printf "\n\033[91mFailed to install CURL.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo yum install -y curl'."

        fi

    fi

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

            sudo systemctl start docker
            sudo systemctl enable docker

        else

            printf "\n\033[91mFailed to install Docker.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo yum install -y docker-ce docker-ce-cli containerd.io'."
            exit 1;

        fi

    fi

    if command docker-compose --version | grep -q '^docker-compose version 1'; then

        echo -e "\n\033[91mError: Detected Docker Compose v1 instead of v2.\033[39m"
        echo "HollaEx CLI v3+ requires Docker Compose v2."
        echo "To proceed, please uninstall the current Docker Compose v1 and then run the install.sh script."
        echo -e "The install.sh script will automatically install Docker Compose v2 for you.\n"

        exit 1;

    fi

    if ! command -v docker-compose > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires docker-compose v2 to operate. Installing it now...\033[39m\n"

        if command sudo curl -SL https://github.com/docker/compose/releases/download/v2.29.1/docker-compose-$(uname -s)-$(uname -m) -o /usr/local/bin/docker-compose; then

            chmod +x /usr/local/bin/docker-compose

            printf "\n\033[92mdocker compose v2has been successfully installed!\033[39m\n"

            echo "Info: $(docker-compose version)"
            

        else

            printf "\n\033[91mFailed to install docker compose v2.\033[39m\n"
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

    if ! command yq --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires yq to operate. Installing it now...\033[39m\n"

        if command sudo curl -L https://github.com/mikefarah/yq/releases/download/v4.44.1/yq_$(uname -s)_$ARCH -o /usr/local/bin/yq; then
            
            chmod +x /usr/local/bin/yq

            printf "\n\033[92myq has been successfully installed!\033[39m\n"

            echo "Info: $(yq --version)"

        else

            printf "\n\033[91mFailed to install yq.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo apt install -y jq'."

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

    if ! command psql --version > /dev/null 2>&1; then

        printf "\n\033[93mHollaEx CLI requires PSQL CLient to operate. Installing it now...\033[39m\n"

        if command sudo yum install -y postgresql; then

            printf "\n\033[92mPSQL CLient(postgresql) has been successfully installed!\033[39m\n"

            echo "Info: "
            postgresql --version

        else

            printf "\n\033[91mFailed to install PSQL CLient.\033[39m\n"
            echo "Please review the logs and try to manually install it. - 'sudo yum install -y postgresql'."

        fi

    fi

fi

if ! command docker -v > /dev/null 2>&1 || ! command docker-compose version > /dev/null 2>&1 || ! command curl --version > /dev/null 2>&1 || ! command jq --version > /dev/null 2>&1 || ! command nslookup -version > /dev/null 2>&1 || ! command psql --version > /dev/null 2>&1; then

    if command docker -v > /dev/null 2>&1; then

        IS_DOCKER_INSTALLED=true
    
    fi

    if command docker-compose version > /dev/null 2>&1; then

        IS_DOCKER_COMPOSE_INSTALLED=true
    
    fi

    if command curl --version > /dev/null 2>&1; then

        IS_CURL_INSTALLED=true
    
    fi

    if command jq --version > /dev/null 2>&1; then

        IS_JQ_INSTALLED=true
    
    fi

    if command nslookup -version > /dev/null 2>&1; then

        IS_NSLOOKUP_INSTALLED=true
    
    fi

    if command psql --version > /dev/null 2>&1; then

        IS_PSQL_CLIENT_INSTALLED=true
    
    fi

    if command yq --version > /dev/null 2>&1; then

        IS_YQ_CLIENT_INSTALLED=true
    
    fi
    
    printf "\n\033[93mNote: HollaEx CLI requires Docker, docker compose, and jq to operate.\033[39m\n\n"

    # Docker installation status chekc
    if [[ "$IS_DOCKER_INSTALLED" ]]; then

        printf "\033[92mDocker: Installed\033[39m\n"

    else 

        printf "\033[91mDocker: Not Installed\033[39m\n"
    
    fi  

    # docker compose v2installation status check
    if [[ "$IS_DOCKER_COMPOSE_INSTALLED" ]]; then

        printf "\033[92mdocker compose: Installed\033[39m\n"

    else

        printf "\033[91mdocker compose: Not Installed\033[39m\n"

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

    if [[ "$IS_PSQL_CLIENT_INSTALLED" ]]; then

        printf "\033[92mpostgresql-client: Installed\033[39m\n"

    else 

        printf "\033[91mpostgresql-client: Not Installed\033[39m\n"

    fi

    # curl installation status check
    if [[ "$IS_CURL_INSTALLED" ]]; then

        printf "\033[92mcurl: Installed\033[39m\n"

    else 

        printf "\033[91mcurl: Not Installed\033[39m\n"

    fi

    # yq installation status check
    if [[ "$IS_YQ_INSTALLED" ]]; then

        printf "\033[92myq: Installed\033[39m\n"

    else 

        printf "\033[91myq: Not Installed\033[39m\n"

    fi

    printf "\n\033[93mPlease install the missing one before you proceed to run exchange.\033[39m\n"

else

   printf "\nThe dependencies are all set!\n\n" 

fi

# Parameter support to specify version of the CLI to install.
export HOLLAEX_INSTALLER_VERSION_TARGET=${1:-"master"}

echo "Pulling HollaEx CLI from Github..."
curl -s https://raw.githubusercontent.com/bitholla/hollaex-cli/master/install.sh > cli_installer.sh && \
    bash cli_installer.sh ${HOLLAEX_INSTALLER_VERSION_TARGET} \
    rm cli_installer.sh

if [[ "$IS_APT_UPDATED" ]] || [[ "$IS_BREW_UPDATED" ]]; then

    echo "Start configuring your exchange with the command: 'hollaex server --setup'."
    printf "\nTo see the full list of commands, use 'hollaex help'.\n\n"

fi

if [[ "$DOCKER_USERGROUP_ADDED" ]]; then

    newgrp docker

fi

function kit_cross_compatibility_converter() {

  CONFIG_FILE_PATH=$(pwd)/settings/*
  
  for i in ${CONFIG_FILE_PATH[@]}; do
    source $i
  done;

  # File conversion
  if [[ -f "$(pwd)/templates/local/$ENVIRONMENT_EXCHANGE_NAME.env.local" ]]; then

    echo "Env file generated with HollaEx CLI v2 has been detected!"
    echo "Converting it to the v3 format..."
    mv $(pwd)/templates/local/$ENVIRONMENT_EXCHANGE_NAME.env.local $(pwd)/server/hollaex-kit.env

  fi


  if [[ -f "$(pwd)/templates/local/$ENVIRONMENT_EXCHANGE_NAME-docker-compose.yaml" ]]; then

    echo "Docker-compose file generated with HollaEx CLI v2 has been detected!"

    echo "Converting the Docker-Compose file..."
    yq "del(.services.$ENVIRONMENT_EXCHANGE_NAME-nginx)" $(pwd)/templates/local/$ENVIRONMENT_EXCHANGE_NAME-docker-compose.yaml > $(pwd)/server/docker-compose-prod.yaml
    yq e -i '.services.*.env_file[] = "hollaex-kit.env"' $(pwd)/server/docker-compose-prod.yaml

    echo "name: 'local'" >> $(pwd)/server/docker-compose-prod.yaml

    rm $(pwd)/templates/local/$ENVIRONMENT_EXCHANGE_NAME-docker-compose.yaml

  fi

  if [[ -f "$(pwd)/templates/local/nginx/conf.d/upstream.conf" ]]; then

    echo "Nginx configuration files generated with HollaEx CLI v2 has been detected!"
    echo "Copying the existing Nginx files to the new directory..."
    mv $(pwd)/templates/local/nginx/conf.d/* $(pwd)/nginx/conf.d
    mv $(pwd)/templates/local/nginx/nginx.conf $(pwd)/nginx/nginx.conf

    mv $(pwd)/templates/local/letsencrypt $(pwd)/nginx/

    echo "Updating the Nginx file to have an existing docker network bind..."
    yq e -i ".services |= with_entries(select(.key == \"hollaex-kit-prod-nginx\") | .key = \"$ENVIRONMENT_EXCHANGE_NAME-nginx\")" $(pwd)/nginx/docker-compose.yaml
    yq e -i ".services.*.networks[] = \"local_$ENVIRONMENT_EXCHANGE_NAME-network\"" $(pwd)/nginx/docker-compose.yaml
    yq e -i ".networks |= with_entries(select(.key == \"local_hollaex-kit-network\") | .key = \"local_$ENVIRONMENT_EXCHANGE_NAME-network\")" $(pwd)/nginx/docker-compose.yaml

    if command docker ps | grep local.*-nginx > /dev/null ; then

        docker-compose -f $(pwd)/nginx/docker-compose.yaml down
        docker-compose -f $(pwd)/nginx/docker-compose.yaml up -d

    fi
    
  fi

  # Local web docker-compose

  if [[ -f "$(pwd)/templates/local/${ENVIRONMENT_EXCHANGE_NAME}-docker-compose-web.yaml" ]]; then

    echo "Web doker-compose file generated with HollaEx CLI v2 has been detected."
    echo "Converting it..."
    mv $(pwd)/templates/local/${ENVIRONMENT_EXCHANGE_NAME}-docker-compose-web.yaml $(pwd)/web/docker-compose.yaml

    echo "name: 'client'" >> $(pwd)/web/docker-compose.yaml

  fi 

  # Kubernetes
  # Ingress, Configmap, Secret conversion
  if [[ -f "$(pwd)/templates/kubernetes/config/${ENVIRONMENT_EXCHANGE_NAME}-configmap.yaml" ]]; then

    echo "Kubernetes configmap generated with HollaEx CLI v2 has been detected."
    echo "Converting it..."
    mv $(pwd)/templates/kubernetes/config/${ENVIRONMENT_EXCHANGE_NAME}-configmap.yaml $(pwd)/server/tools/kubernetes/env/configmap.yaml

  fi 

  if [[ -f "$(pwd)/templates/kubernetes/config/${ENVIRONMENT_EXCHANGE_NAME}-secret.yaml" ]]; then

    echo "Kubernetes secret generated with HollaEx CLI v2 has been detected."
    echo "Converting it..."
    mv $(pwd)/templates/kubernetes/config/${ENVIRONMENT_EXCHANGE_NAME}-secret.yaml $(pwd)/server/tools/kubernetes/env/secret.yaml

  fi

  if [[ -f "$(pwd)/templates/kubernetes/config/${ENVIRONMENT_EXCHANGE_NAME}-ingress.yaml" ]]; then

    echo "Kubernetes ingress yamls generated with HollaEx CLI v2 has been detected."
    echo "Converting it..."
    mv $(pwd)/templates/kubernetes/config/${ENVIRONMENT_EXCHANGE_NAME}-ingress.yaml $(pwd)/server/tools/kubernetes/ingress/hollaex-kit-ingress.yaml

  fi

}

kit_cross_compatibility_converter;


exit 0;