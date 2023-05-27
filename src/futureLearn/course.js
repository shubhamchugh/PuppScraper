const puppeteer = require('puppeteer'); 
const express = require('express');

const courseraCourse = express.Router();

courseraCourse.get('/course', (req, res) => {

    // Access the provided 'page' and 'limit' query parameters
    let url = req.query.url;

    let scrape = async () => { // Prepare scrape...

        const browser = await puppeteer.launch({
        //executablePath: '/usr/bin/google-chrome-stable',
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

                let titleClasses = document.querySelectorAll('.banner-title.banner-title-without--subtitle.m-b-0');
                let title = []

                for (let elements of titleClasses) {
                    title.push(elements.textContent);
                }

                let descriptionClasses = document.querySelectorAll('.m-t-1.description');
                let description = []

                for (let elements of descriptionClasses) {
                    description.push(elements.textContent.replace('SHOW ALL COURSE OUTLINESHOW ALL',''));
                }

                let instructorClasses = document.querySelectorAll('[data-click-key="xdp_v1.xdp.click.instructor_avatar"]');
                let instructor = []

                for (let elements of instructorClasses) {
                    instructor.push(elements.getAttribute('href'));
                }

                let contentClasses = document.querySelectorAll('._wmgtrl9.m-y-2');
                let content = []

                for (let elements of contentClasses) {
                    elements.removeChild(elements.querySelector('.duration-text.m-x-1s'))
                    content.push(elements.textContent);
                }

                let partnerClasses = document.querySelectorAll('[data-track-component="partner_name"]');
                let partner = []

                for (let elements of partnerClasses) {
                    partner.push(elements.getAttribute('href'));
                }

                let questionClasses = document.querySelectorAll('div.p-l-1s');
                let question = []

                for (let elements of questionClasses) {
                    question.push(elements.textContent);
                }

                let answerClasses = document.querySelectorAll('div._msg5sa');
                let answer = []

                for (let elements of answerClasses) {
                    answer.push(elements.textContent);
                }

                let skillClasses = document.querySelectorAll('span._ontdeqt');
                let skill = []

                for (let elements of skillClasses) {
                    skill.push(elements.textContent);
                }

                let priceClasses = document.querySelectorAll('[data-test="enroll-button-label"]');
                let price = []

                for (let elements of priceClasses) {
                    price.push(elements.textContent);
                }

                let dateClasses = document.querySelectorAll('div.startdate.rc-StartDateString.font-xs');
                let date = []

                for (let elements of dateClasses) {
                    date.push(elements.textContent);
                }

                let learnClasses = document.querySelectorAll('li._1yuv87zj.m-b-1');
                let learn = []

                for (let elements of learnClasses) {
                    learn.push(elements.textContent);
                }
                
                return {
                    title,
                    description,
                    instructor,
                    content,
                    partner,
                    question,
                    answer,
                    skill,
                    price,
                    date,
                    learn
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


module.exports = courseraCourse;
