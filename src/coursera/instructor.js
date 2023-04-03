const puppeteer = require('puppeteer'); 
const express = require('express');

const instructorCourse = express.Router();

instructorCourse.get('/instructor', (req, res) => {

    // Access the provided 'page' and 'limit' query parameters
    let url = req.query.url;

    let scrape = async () => { // Prepare scrape...

        const browser = await puppeteer.launch({
        //executablePath: '/usr/bin/google-chrome-stable',
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
    }); // Prevent non-needed issues for *NIX
        const page = await browser.newPage(); // Create request for the new page to obtain...
        await page.setViewport({
            width: 1440,
            height: 900,
        });
        // await page.emulateTimezone("Asia/Singapore");

        // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

        // Replace with your Google Maps URL... Or Test the Microsoft one...
        //await page.goto('https://www.google.com/maps/place/Microsoft/@36.1275216,-115.1728651,17z/data=!3m1!5s0x80c8c416a26be787:0x4392ab27a0ae83e0!4m7!3m6!1s0x80c8c4141f4642c5:0x764c3f951cfc6355!8m2!3d36.1275216!4d-115.1706764!9m1!1b1');

        const response = await page.goto(url, {
               waitUntil: 'networkidle2',
            // timeout: 0
        }); // Define the Maps URL to Scrape...

        console.log('waiting for selector');
        //await page.waitFor(3000);

        try {
            const result = await page.evaluate(() => { // Let's create variables and store values...

                let nameClasses = document.querySelectorAll('h2.cds-33.css-18kxr1m.cds-35');
                let name = []

                for (let elements of nameClasses) {
                    name.push(elements.textContent);
                }
                
                let titleClasses = document.querySelectorAll('p.cds-33.css-pa6u6k.cds-35');
                let title = []

                for (let elements of titleClasses) {
                    title.push(elements.textContent);
                }

                let descriptionClasses = document.querySelectorAll('div.cds-33.css-pa6u6k.cds-35');
                let description = []

                for (let elements of descriptionClasses) {
                    description.push(elements.textContent);
                }

                let logoClasses = document.querySelectorAll('img.border-radius-50.border-a.p-a-1s');
                let logo = []

                for (let elements of logoClasses) {
                    logo.push(elements.getAttribute('src'));
                }

                let linksClasses = document.querySelectorAll('a.cds-33.cds-167.cds-169.m-l-1s.css-h830z8.cds-56');
                let links = []

                for (let elements of linksClasses) {
                    links.push(elements.getAttribute('href'));
                }
                
                return {
                    name,
                    title,
                    description,
                    logo,
                    links
                };
            });

            return result;

        } catch (err) {
            console.error(err);
            return null;
        } finally {
            await page.close();
            await browser.close();
        }
    };

    scrape().then((value) => { // Scrape and output the results...
        res.send(value); // Yay, output the Results...
    });
})


module.exports = instructorCourse;