const fs = require('fs');
const puppeteer = require('puppeteer');

async function run() {
    const browser = await puppeteer.launch({
        executablePath: '/usr/bin/google-chrome-stable',
        headless: true, //false only when on localServer to view simulation
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
    await page.goto('https://www.wikipedia.org');

    //  Get text of the page
    const title = await page.evaluate(() => document.title);

    console.log('Title: ' + title)
    console.log((title) ? 'Status: Puppeteer Working fine' : 'Status: error')

    // Save data to JSON file
    fs.writeFile('courses.json', JSON.stringify(title), (err) => {
        if (err) throw err;
        console.log('File saved');
    });

    await browser.close();
}

run();