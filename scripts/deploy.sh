#!/bin/bash

# if [ "$#" -ne 1 ]; then
#     echo "Usage: $0 /path/to/key.pem"
#     exit 1
# fi
# identityFile=$1

source .env
if [ -z "$REMOTE_IP" ]; then
    echo "Error: REMOTE_IP is not set."
    exit 1
fi
if [ -z "$REMOTE_USER" ]; then
    echo "Error: REMOTE_USER is not set."
    exit 1
fi
if [ -z "$IDENTITY_FILE" ]; then
    echo "Error: IDENTITY_FILE is not set."
    exit 1
fi

serverIp=$REMOTE_IP
serverUser=$REMOTE_USER
identityFile=$IDENTITY_FILE
projectName="portfolio-cms"
port=3000
servicesDirectory="/home/${serverUser}/services"
projectDirectory="portfolio-cms"
projectBranch="portfolio-cms"
projectRepository="git@github.com:Darflix-Studio/darflix-cms.git"
npmNetwork="nginx-proxy-manager_default"
containerName="${projectName}-payload-1"

ssh -A -i "${identityFile}" ${serverUser}@${serverIp} << EOF
    # Check if the services directory exists, if not, create it
    if [ ! -d "${servicesDirectory}" ]; then
        mkdir -p "${servicesDirectory}"
    fi
    cd ${servicesDirectory}

    # Check if the repository exists in the project directory
    # If not, clone it, otherwise pull the latest changes
    if [ ! -d "${projectDirectory}/.git" ]; then
        git clone ${projectRepository} ${projectDirectory}
        cd ${projectDirectory}
    else
        cd ${projectDirectory}
        git pull origin ${projectBranch}
    fi
EOF

# scp the .env.production file to the server
echo "Copying .env.production file to the server"
scp -i "${identityFile}" .env.production ${serverUser}@${serverIp}:${servicesDirectory}/${projectDirectory}/.env

ssh -A -i "${identityFile}" ${serverUser}@${serverIp} << EOF
    cd ${servicesDirectory}/${projectDirectory}
    docker compose down
    docker compose up -d --build
    docker network connect ${npmNetwork} ${containerName}

    docker inspect -f '{{range \$key, \$value := .NetworkSettings.Networks}}{{\$key}} - {{\$value.IPAddress}}{{"\n"}}{{end}}' portfolio-cms-payload-1 | grep 'nginx-proxy-manager_default' | awk '{print $3}'
EOF

