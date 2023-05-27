const puppeteer = require("puppeteer"); // Require the Package we need...
const express = require("express");

const map = express.Router();

map.get("/", (req, res) => {
  // Access the provided 'page' and 'limit' query parameters
  let url = req.query.url;

  let scrape = async () => {
    // Prepare scrape...

    const browser = await puppeteer.launch({
      headless: "new",
      // `headless: true` (default) enables old Headless;
      // `headless: 'new'` enables new Headless;
      // `headless: false` enables “headful” mode.;
      // `false only when on localServer to view simulation;
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
    }); // Prevent non-needed issues for *NIX
    const page = await browser.newPage(); // Create request for the new page to obtain...

    // Replace with your Google Maps URL... Or Test the Microsoft one...
    //await page.goto('https://www.google.com/maps/place/Microsoft/@36.1275216,-115.1728651,17z/data=!3m1!5s0x80c8c416a26be787:0x4392ab27a0ae83e0!4m7!3m6!1s0x80c8c4141f4642c5:0x764c3f951cfc6355!8m2!3d36.1275216!4d-115.1706764!9m1!1b1');

    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 0,
    }); // Define the Maps URL to Scrape...
    //await page.waitFor(1000); // In case Server has JS needed to be loaded...

    console.log("waiting for selector");

    try {
      await page
        .waitForSelector(".ODSEW-ShBeI-title")
        .catch((error) => console.log("failed to wait for the selector"));

      const result = await page.evaluate(() => {
        // Let's create variables and store values...

        //title
        let titleClasses = document.querySelectorAll(
          "#pane > div > div.widget-pane-content.cYB2Ge-oHo7ed > div > div > div.x3AX1-LfntMc-header-title > div.x3AX1-LfntMc-header-title-ma6Yeb-haAclf > div.x3AX1-LfntMc-header-title-ij8cu > div:nth-child(1) > h1 > span:nth-child(1)"
        );
        let title = [];

        for (let elements of titleClasses) {
          title.push(elements.innerText);
        }

        //subtitle
        let title2Classes = document.getElementsByClassName(
          "x3AX1-LfntMc-header-title-VdSJob"
        );
        let title2 = [];

        for (let elements of title2Classes) {
          title2.push(elements.innerText);
        }

        //Address
        let addressContentClasses = document.querySelectorAll(
          '[data-tooltip="Copy address"]'
        );
        let addressContent = [];

        // addressContent = addressContentClasses.innerText;

        for (let elements of addressContentClasses) {
          addressContent.push(elements.innerText);
        }

        //website
        let websiteContentClasses = document.querySelectorAll(
          '[data-tooltip="Open website"]'
        );
        let websiteContent = [];

        //websiteContent = websiteContentClasses.innerText;

        for (let elements of websiteContentClasses) {
          websiteContent.push(elements.innerText);
        }

        //Phone
        let phoneContentClasses = document.querySelectorAll(
          '[data-tooltip="Copy phone number"]'
        );
        let phoneContent = [];

        //phoneContent = phoneContentClasses.innerText;
        for (let elements of phoneContentClasses) {
          phoneContent.push(elements.innerText);
        }

        //features
        let featuresClasses = document.getElementsByClassName(
          "uxOu9-sTGRBb-p83tee-haAclf"
        );
        let features = [];

        for (let elements of featuresClasses) {
          features.push(elements.innerText);
        }

        //rating
        let ratingClasses = document.getElementsByClassName("gm2-display-2");
        let rating = [];

        for (let elements of ratingClasses) {
          rating.push(elements.innerText);
        }

        //Review Count
        let reviewCountClasses = document.getElementsByClassName(
          "gm2-button-alt HHrUdb-v3pZbf"
        );
        let reviewCount = [];

        for (let elements of reviewCountClasses) {
          reviewCount.push(elements.innerText);
        }

        //timeTable
        let timeTableClasses = document.querySelectorAll(
          '[data-tooltip="Copy open hours"]'
        );
        let timeTable = [];

        for (let elements of timeTableClasses) {
          timeTable.push(elements.getAttribute("data-value"));
        }

        //testimonial
        let testimonialClasses = document.getElementsByClassName(
          "goAFp-ShBeI-lvvS4b-RWgCYc"
        );
        let testimonial = [];

        for (let elements of testimonialClasses) {
          testimonial.push(elements.textContent);
        }

        let reviewAuthorNamesClasses =
          document.getElementsByClassName("ODSEW-ShBeI-title");
        let reviewAuthorNames = [];

        for (let elements of reviewAuthorNamesClasses) {
          reviewAuthorNames.push(elements.innerText);
        }

        let authorImageValueClasses = document.getElementsByClassName(
          "ODSEW-ShBeI-t1uDwd-HiaYvf"
        );
        let authorImageValue = [];

        for (let elements of authorImageValueClasses) {
          authorImageValue.push(elements.getAttribute("src"));
        }

        let datesClasses = document.getElementsByClassName(
          "ODSEW-ShBeI-RgZmSc-date"
        );
        let dates = [];

        for (let elements of datesClasses) {
          dates.push(elements.innerText);
        }

        let ratingsClasses =
          document.getElementsByClassName("ODSEW-ShBeI-H1e3jb");
        let ratings = [];

        for (let elements of ratingsClasses) {
          ratings.push(elements.children.length);
        }

        let reviewsContentClasses =
          document.getElementsByClassName("ODSEW-ShBeI-text");
        let reviewsContent = [];

        for (let elements of reviewsContentClasses) {
          reviewsContent.push(elements.innerText);
        }

        let reviewerImageClasses = document.getElementsByClassName(
          "ODSEW-ShBeI-t1uDwd-HiaYvf"
        );
        let reviewerImage = [];

        for (let elements of reviewerImageClasses) {
          reviewerImage.push(elements.getAttribute("src"));
        }

        let imageClasses = document.getElementsByClassName(
          "a4izxd-tUdTXb-xJzy8c-haAclf-xJzy8c"
        );
        let image = [];

        for (let elements of imageClasses) {
          image.push(elements.getAttribute("src"));
        }

        let imageNameClasses = document.getElementsByClassName(
          "a4izxd-tUdTXb-xJzy8c-haAclf"
        );
        let imageName = [];

        for (let elements of imageNameClasses) {
          imageName.push(elements.getAttribute("aria-label"));
        }

        return {
          title,
          title2,
          addressContent,
          websiteContent,
          phoneContent,
          features,
          rating,
          testimonial,
          timeTable,
          reviewCount,
          reviewAuthorNames,
          dates,
          ratings,
          reviewsContent,
          reviewerImage,
          image,
          imageName,
          authorImageValue,
        };
      });
      result.redirect = page.url();
      return result; // Return the results with the Review...
    } catch (err) {
      console.error(err);
      const result = false;
      return result;
    } finally {
      await page.close();
      await browser.close();
    }
  };

  scrape().then((value) => {
    // Scrape and output the results...
    res.send(value); // Yay, output the Results...
  });
});

map.get("/search", (req, res) => {
  // Access the provided 'page' and 'limt' query parameters
  let url = req.query.url;

  let scrape = async () => {
    // Prepare scrape...

    const browser = await puppeteer.launch({
      headless: "new",
      // `headless: true` (default) enables old Headless;
      // `headless: 'new'` enables new Headless;
      // `headless: false` enables “headful” mode.;
      // `false only when on localServer to view simulation;
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
    }); // Prevent non-needed issues for *NIX
    const page = await browser.newPage(); // Create request for the new page to obtain...

    // Replace with your Google Maps URL... Or Test the Microsoft one...
    //await page.goto('https://www.google.com/maps/place/Microsoft/@36.1275216,-115.1728651,17z/data=!3m1!5s0x80c8c416a26be787:0x4392ab27a0ae83e0!4m7!3m6!1s0x80c8c4141f4642c5:0x764c3f951cfc6355!8m2!3d36.1275216!4d-115.1706764!9m1!1b1');

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 0,
    }); // Define the Maps URL to Scrape...
    //await page.waitFor(1000); // In case Server has JS needed to be loaded...

    console.log("waiting for selector");

    try {
      await page
        .waitForSelector(".a4gq8e-aVTXAb-haAclf-jRmmHf-hSRGPd")
        .catch((error) => console.log("failed to wait for the selector"));

      const result = await page.evaluate(() => {
        // Let's create variables and store values...

        //title
        let titleClasses = document.getElementsByClassName(
          "a4gq8e-aVTXAb-haAclf-jRmmHf-hSRGPd"
        );
        let title = [];

        for (let elements of titleClasses) {
          title.push(elements.getAttribute("aria-label"));
        }

        //Url
        let urlClasses = document.getElementsByClassName(
          "a4gq8e-aVTXAb-haAclf-jRmmHf-hSRGPd"
        );
        let url = [];

        for (let elements of urlClasses) {
          url.push(elements.getAttribute("href"));
        }

        return {
          title,
          url,
        };
      });
      return result; // Return the results with the Review...
    } catch (err) {
      console.error(err);
      const result = false;
      return result;
    } finally {
      await page.close();
      await browser.close();
    }
  };

  scrape().then((value) => {
    // Scrape and output the results...
    res.send(value); // Yay, output the Results...
  });
});

module.exports = map;
