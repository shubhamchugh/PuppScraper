#Chrome doesn't launch on Linux

Make sure all the necessary dependencies are installed.The common ones are provided below. Also, see

[https://source.chromium.org/chromium/chromium/src/+/main:chrome/installer/linux/debian/dist_package_versions.json](https://https://source.chromium.org/chromium/chromium/src/+/main:chrome/installer/linux/debian/dist_package_versions.json)

```bash
apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget libgbm-dev libglib2.0-0
```

```bash
npm install pm2 -g
```

Start/stop/restart Nodejs Server with apllication Please check dir before exicute the comand

```bash
pm2 start myAppName.js -i max
pm2 stop myAppName.js -i max
pm2 restart myAppName.js -i max
```

if not start Node js Server Try with Force

```bash
pm2 start myAppName.js -i max -f
pm2 stop myAppName.js -i max -f
pm2 restart myAppName.js -i max -f
```

server run after reboot also

```bash
pm2 save
```

troubleshoot for node server

```bash
pm2 list
pm2 restart all
pm2 stop all
pm2 delete all
```

For Monitor NodeJs Server

```bash
pm2 monit
```

for check List all processes:

```bash
pm2 list
```

action

```bash
pm2 stop
pm2 restart
pm2 delete
```

# Routes

Google Map location:
http://localhost:3000/map?url=https://www.google.com/maps/place/SKY+BEACH,+Rooftop+328,329,+Queens+Road,+Vaishali+Nagar,+Jaipur,+Rajasthan/@26.8763136,75.7956608,12z/data=!4m2!3m1!1s0x396db4824392ad2b:0x6145b4cb9c1df6b6?entry=ttu

Google Map Search:
http://localhost:3000/map/search?url=https://www.google.com/maps/search/restaurants/@26.8763136,75.7956608,12z?entry=ttu

Google Serp:
http://localhost:3000/serp/google?url=https://www.google.com/search?q=technofizi
