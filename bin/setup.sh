#!/bin/bash
# Reset
NC='\033[0m' # Text Reset

# Regular Colors
Black='\033[0;30m'  # Black
Red='\033[0;31m'    # Red
Green='\033[0;32m'  # Green
Yellow='\033[0;33m' # Yellow
Blue='\033[0;34m'   # Blue
Purple='\033[0;35m' # Purple
Cyan='\033[0;36m'   # Cyan
White='\033[0;37m'  # White

# Bold
BBlack='\033[1;30m'  # Black
BRed='\033[1;31m'    # Red
BGreen='\033[1;32m'  # Green
BYellow='\033[1;33m' # Yellow
BBlue='\033[1;34m'   # Blue
BPurple='\033[1;35m' # Purple
BCyan='\033[1;36m'   # Cyan
BWhite='\033[1;37m'  # White

# Underline
UBlack='\033[4;30m'  # Black
URed='\033[4;31m'    # Red
UGreen='\033[4;32m'  # Green
UYellow='\033[4;33m' # Yellow
UBlue='\033[4;34m'   # Blue
UPurple='\033[4;35m' # Purple
UCyan='\033[4;36m'   # Cyan
UWhite='\033[4;37m'  # White

# Background
On_Black='\033[40m'  # Black
On_Red='\033[41m'    # Red
On_Green='\033[42m'  # Green
On_Yellow='\033[43m' # Yellow
On_Blue='\033[44m'   # Blue
On_Purple='\033[45m' # Purple
On_Cyan='\033[46m'   # Cyan
On_White='\033[47m'  # White

# High Intensity
IBlack='\033[0;90m'  # Black
IRed='\033[0;91m'    # Red
IGreen='\033[0;92m'  # Green
IYellow='\033[0;93m' # Yellow
IBlue='\033[0;94m'   # Blue
IPurple='\033[0;95m' # Purple
ICyan='\033[0;96m'   # Cyan
IWhite='\033[0;97m'  # White

# Bold High Intensity
BIBlack='\033[1;90m'  # Black
BIRed='\033[1;91m'    # Red
BIGreen='\033[1;92m'  # Green
BIYellow='\033[1;93m' # Yellow
BIBlue='\033[1;94m'   # Blue
BIPurple='\033[1;95m' # Purple
BICyan='\033[1;96m'   # Cyan
BIWhite='\033[1;97m'  # White

# High Intensity backgrounds
On_IBlack='\033[0;100m'  # Black
On_IRed='\033[0;101m'    # Red
On_IGreen='\033[0;102m'  # Green
On_IYellow='\033[0;103m' # Yellow
On_IBlue='\033[0;104m'   # Blue
On_IPurple='\033[0;105m' # Purple
On_ICyan='\033[0;106m'   # Cyan
On_IWhite='\033[0;107m'  # White

"echo" "-e" "Checking operating system is Ubuntu or not"
os_name=$(lsb_release -si)
if [ "$os_name" != "Ubuntu" ]; then
  echo "Please run on Ubuntu"
  exit
fi

"echo" "-e" "Checking user is root or not"
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root"
  exit
fi

function compatibleNode {
  local _0
  nodeVersion=$(node -e 'console.log(process.versions.node.split(`.`)[0])')
  "echo" "-e" "Node Version: ""$nodeVersion"
  _0="18"

  if [ $(($nodeVersion < $_0)) == 1 ]; then
    "echo" "-e" "${Red}Error:${Color_Off} Required Node.js $_0 or higher"
    "exit" "1"
  fi
  if [ "$nodeVersion" == "$_0" ]; then
    "echo" "-e" "${Green}success:${Color_Off} NodeJS ""$nodeVersion"" is compatible for project"
  fi
  if [ $(($nodeVersion > $_0)) == 1 ]; then
    "echo" "-e" "${Yellow}Warning:${Color_Off} Project is not tested with Node ""$nodeVersion"". Use version Node $_0"
  fi
}

nodeCheck=$(node -v)
if [ "$nodeCheck" != "" ]; then
  "compatibleNode"
else
  "echo" "-e" "${Purple}First Install Node"
  "exit" "1"
fi

"echo" "-e" "============"
"echo" "-e" "Install Git"
"echo" "-e" "============"

gitCheck=$(git --version)
if [ "$gitCheck" == "" ]; then
  "echo" "-e" "Installing Git"
  apt --yes install git
fi
#Curl download & installed
"echo" "-e" "============"
"echo" "-e" "Install Curl"
"echo" "-e" "============"

curlCheck=$(curl --version)
if [ "$curlCheck" == "" ]; then
  "echo" "-e" "Installing Curl"
  apt --yes install curl
fi

#google Chrome download & installed
"echo" "-e" "================================="
"echo" "-e" "Download & install Google Chrome"
"echo" "-e" "================================="

chrome=$(which google-chrome-stable)
if [ "$chrome" == "" ]; then
  apt-get update

  if [ ! -d $HOME/tmp ]; then
    mkdir -p $HOME/tmp
  fi

  cd $HOME/tmp && curl -O https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb && apt-get install -y ./google-chrome-stable_current_amd64.deb
  rm -rf $HOME/tmp
fi
"echo" "-e" "${Green}Google Chromcat /etc/issuee path:${NC} $(which google-chrome-stable)"

#pm2 install (PM2 is a daemon process manager that will help you manage and keep your application online 24/7)
"echo" "-e" "=================================="
"echo" "-e" "Download & install PM2 Node Server"
"echo" "-e" "=================================="

"echo" "-e" "Installing PM2"
apt-get update
npm install pm2@latest -g && pm2 install pm2-logrotate
pm2 flush # Empty all log files
pm2 update
pm2 delete all
pm2 start scraper/app.js -f -i max --watch #Watch and Restart app when files change & Will start maximum processes with LB depending on available CPUs
pm2 save
pm2 startup
"echo" "-e" "pm2 version: $(pm2 --version)"
