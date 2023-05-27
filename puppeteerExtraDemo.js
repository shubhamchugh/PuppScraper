const fs = require('fs');
const puppeteer = require('puppeteer-extra') 


const StealthPlugin = require('puppeteer-extra-plugin-stealth') 
puppeteer.use(StealthPlugin()) 
 
const {executablePath} = require('puppeteer') 

async function run() {
    const browser = await puppeteer.launch({
        executablePath: executablePath(),
        //executablePath: '/usr/bin/google-chrome-stable',
        headless: 'new', 
        headless: 'new', 
        // `headless: true` (default) enables old Headless;
        // `headless: 'new'` enables new Headless;
        // `headless: false` enables “headful” mode.;
        // `false only when on localServer to view simulation;
        ignoreHTTPSErrors: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-accelerated-2d-canvas',
            '--no-zygote',
            '--renderer-process-limit=1',
            '--no-first-run',
            '--disable-dev-shm-usage',
            '--single-process', // <- this one doesn't works in Windows
            '--disable-gpu'
        ],
    });
    const page = await browser.newPage();
    await page.goto('https://telegramchannels.me');

    //  Get text of the page
    const title = await page.evaluate(() => document.title);

    console.log('Title: ' + title)
    console.log((title) ? 'Status: Puppeteer Working fine' : 'Status: error')

    // Save data to JSON file
    fs.writeFile('output_extraDemo.json', JSON.stringify(title), (err) => {
        if (err) throw err;
        console.log('File saved');
    });

    await browser.close();
}

run();