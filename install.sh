#!/bin/bash 

REPLACE_EXISTING_TO_LATEST=false

/bin/cat << EOF

██╗  ██╗███████╗██╗  ██╗      ██████╗██╗     ██╗
██║  ██║██╔════╝╚██╗██╔╝     ██╔════╝██║     ██║
███████║█████╗   ╚███╔╝█████╗██║     ██║     ██║
██╔══██║██╔══╝   ██╔██╗╚════╝██║     ██║     ██║
██║  ██║███████╗██╔╝ ██╗     ╚██████╗███████╗██║ 
╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝      ╚═════╝╚══════╝╚═╝ ┬┌┐┌┌─┐┌┬┐┌─┐┬  ┬  ┌─┐┬─┐
                                                 ││││└─┐ │ ├─┤│  │  ├┤ ├┬┘
                                                 ┴┘└┘└─┘ ┴ ┴ ┴┴─┘┴─┘└─┘┴└─

EOF

if [[ -d "$HOME/.hex-cli" ]] || [[ -d "$HOME/.hollaex-cli" ]]; then
    echo "You already installed previous version of hex-cli."
    echo "Are you sure you want to replace existing one to latest? (y/N)"
    REPLACE_EXISTING_TO_LATEST=true
else
    echo "Are you sure you want to proceed to install hex-cli? (y/N)"
fi

read answer

if [[ "$answer" != "${answer#[Nn]}" ]] ;then
    echo "*** Exiting... ***"
    exit 0;
fi

if [[ "$REPLACE_EXISTING_TO_LATEST" == "true" ]]; then
    echo "Replacing existing hex-cli to latest"
    sudo rm -r $HOME/.hex-cli
    sudo rm /usr/local/bin/hex
    git clone https://github.com/bitholla/hex-cli.git
else       
    echo "Cloning hex-cli repo from git"
    git clone https://github.com/bitholla/hex-cli.git
fi

chmod +x $(pwd)/hex-cli
sudo mv $(pwd)/hex-cli $HOME/.hex-cli
sudo ln -s $HOME/.hex-cli/hex /usr/local/bin/hex

echo "hex-cli v$(cat $HOME/.hex-cli/version) has been successfully installed!"
echo "If you want to uninstall hex-cli later, Please visit https://github.com/bitholla/hex-cli for further information."