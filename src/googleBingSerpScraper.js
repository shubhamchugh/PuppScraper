const puppeteer = require("puppeteer"); // Require the Package we need...
const express = require("express");

const serp = express.Router();

serp.get("/google", (req, res) => {
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

      ignoreDefaultArgs: ["--enable-automation"],
      ignoreHTTPSErrors: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-accelerated-2d-canvas",
        "--no-zygote",
        "--renderer-process-limit=1",
        "--no-first-run",
        "--disable-dev-shm-usage",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
    }); // Prevent non-needed issues for *NIX
    const page = await browser.newPage(); // Create request for the new page to obtain...
    await page.setViewport({
      width: 2000,
      height: 1000,
    });
    // await page.emulateTimezone("Asia/Singapore");

    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

    // Replace with your Google Maps URL... Or Test the Microsoft one...
    //await page.goto('https://www.google.com/maps/place/Microsoft/@36.1275216,-115.1728651,17z/data=!3m1!5s0x80c8c416a26be787:0x4392ab27a0ae83e0!4m7!3m6!1s0x80c8c4141f4642c5:0x764c3f951cfc6355!8m2!3d36.1275216!4d-115.1706764!9m1!1b1');

    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      // timeout: 0
    }); // Define the Maps URL to Scrape...

    console.log("waiting for selector");

    try {
      var relatedKeywordsGoogle = await page.$$eval(
        "a.k8XOCe.R0xfCb.VCOFK.s8bAkb",
        (elements) => elements.map((item) => item.textContent)
      );
      //console.log(relatedKeywordsGoogle)

      var resultTitleGoogle = await page.$$eval(
        "div.NJo7tc.Z26q7c.jGGQ5e > div.yuRUbf > a > h3.LC20lb.MBeuO.DKV0Md",
        (elements) => elements.map((item) => item.textContent)
      );
      //console.log(resultTitleGoogle)

      var resultDescriptionGoogle = await page.$$eval(
        "div.NJo7tc.Z26q7c.uUuwM",
        (elements) => elements.map((item) => item.textContent)
      );
      //console.log(resultDescriptionGoogle)

      var resultUrlGoogle = await page.$$eval(
        "div.NJo7tc.Z26q7c.jGGQ5e > div.yuRUbf > a",
        (elements) => elements.map((item) => item.getAttribute("href"))
      );
      //console.log(resultUrlGoogle)

      var richSnippetGoogle = await page.$$eval(
        "div.V3FYCf > div.wDYxhc ",
        (elements) => elements.map((item) => item.innerHTML)
      );
      //console.log(resultUrlGoogle)

      const selectors = await page.$$(".iDjcJe.IX9Lgd.wwB5gf");

      try {
        for (var i = 1; i < selectors.length; i++) {
          await selectors[i].click();
        }
      } catch (error) {
        console.log("Faq found for click");
      }

      // await page.waitForSelector('div.iDjcJe.IX9Lgd.wwB5gf span')

      // remove some html from the DOM (Answers Link Class Remove)
      let div_selector_to_remove = "div.g";
      await page.evaluate((sel) => {
        var elements = document.querySelectorAll(sel);
        for (var i = 0; i < elements.length; i++) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }, div_selector_to_remove);

      let div_selector_to_remove_2 = "div.hwqd7e.d0fCJc.BOZ6hd";
      await page.evaluate((sel) => {
        var elements2 = document.querySelectorAll(sel);
        for (var i = 0; i < elements2.length; i++) {
          elements2[i].parentNode.removeChild(elements2[i]);
        }
      }, div_selector_to_remove_2);

      // remove some html from the DOM (Date From PAA) start \\\\\

      let div_selector_to_remove_3 = "span.kX21rb.ZYHQ7e";
      await page.evaluate((sel) => {
        var elements3 = document.querySelectorAll(sel);
        for (var i = 0; i < elements3.length; i++) {
          elements3[i].parentNode.removeChild(elements3[i]);
        }
      }, div_selector_to_remove_3);

      let div_selector_to_remove_4 = "div.Od5Jsd";
      await page.evaluate((sel) => {
        var elements4 = document.querySelectorAll(sel);
        for (var i = 0; i < elements4.length; i++) {
          elements4[i].parentNode.removeChild(elements4[i]);
        }
      }, div_selector_to_remove_4);

      // Remove some html from the DOM (Date From PAA) end \\\\\

      var linkTextsQuestions = await page.$$eval(
        "div.iDjcJe.IX9Lgd.wwB5gf span",
        (elements) => elements.map((item) => item.textContent)
      );

      var linkTextsAnswers = await page.$$eval("div.MBtdbb", (elements) =>
        elements.map((item) => item.textContent)
      );

      var finalResult = {
        status: "success",
        questions: linkTextsQuestions,
        answers: linkTextsAnswers,
        richSnippetGoogle: richSnippetGoogle,
        resultTitleGoogle: resultTitleGoogle,
        resultDescriptionGoogle: resultDescriptionGoogle,
        resultUrlGoogle: resultUrlGoogle,
        relatedKeywordsGoogle: relatedKeywordsGoogle,
      };

      return finalResult;
    } catch (err) {
      console.error(err);
      var finalResult = {
        status: "fail",
        richSnippet: richSnippet,
      };
      return finalResult;
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

serp.get("/bing", (req, res) => {
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

      ignoreDefaultArgs: ["--enable-automation"],
      ignoreHTTPSErrors: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-accelerated-2d-canvas",
        "--no-zygote",
        "--renderer-process-limit=1",
        "--no-first-run",
        "--disable-dev-shm-usage",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
    }); // Prevent non-needed issues for *NIX
    const page = await browser.newPage(); // Create request for the new page to obtain...
    await page.setViewport({
      width: 2000,
      height: 1000,
    });
    // await page.emulateTimezone("Asia/Singapore");

    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

    // Replace with your Google Maps URL... Or Test the Microsoft one...
    //await page.goto('https://www.google.com/maps/place/Microsoft/@36.1275216,-115.1728651,17z/data=!3m1!5s0x80c8c416a26be787:0x4392ab27a0ae83e0!4m7!3m6!1s0x80c8c4141f4642c5:0x764c3f951cfc6355!8m2!3d36.1275216!4d-115.1706764!9m1!1b1');

    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      // timeout: 0
    }); // Define the Maps URL to Scrape...

    console.log("waiting for selector");

    try {
      // remove some html from the DOM (Answers Link Class Remove)
      let div_selector_to_remove = "div.df_img.df_atct.tall";
      await page.evaluate((sel) => {
        var elements = document.querySelectorAll(sel);
        for (var i = 0; i < elements.length; i++) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }, div_selector_to_remove);

      let div_selector_to_remove_2 = "div.b_footnote.imgtt_ref";
      await page.evaluate((sel) => {
        var elements2 = document.querySelectorAll(sel);
        for (var i = 0; i < elements2.length; i++) {
          elements2[i].parentNode.removeChild(elements2[i]);
        }
      }, div_selector_to_remove_2);

      // remove image from rich snippets Bing
      let div_selector_to_remove3 = "div.df_img.df_ih.df_atct.wide";
      await page.evaluate((sel) => {
        var elements = document.querySelectorAll(sel);
        for (var i = 0; i < elements.length; i++) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }, div_selector_to_remove3);

      // remove Date from SERP Bing
      let div_selector_to_remove4 = "span.news_dt";
      await page.evaluate((sel) => {
        var elements = document.querySelectorAll(sel);
        for (var i = 0; i < elements.length; i++) {
          elements[i].parentNode.removeChild(elements[i]);
        }
      }, div_selector_to_remove4);

      var resultTitle = await page.$$eval("div.b_title > h2", (elements) =>
        elements.map((item) => item.textContent)
      );
      //console.log(resultTitle)

      var resultTitle_1 = await page.$$eval("li.b_algo >h2", (elements) =>
        elements.map((item) => item.textContent)
      );
      //console.log(resultTitle)
      resultTitle = !resultTitle.length ? resultTitle_1 : resultTitle;

      var resultDescription = await page.$$eval(
        "div.b_caption > p",
        (elements) => elements.map((item) => item.textContent)
      );
      //console.log(resultDescription)

      var resultUrl = await page.$$eval("div.b_title > h2 > a", (elements) =>
        elements.map((item) => item.getAttribute("href"))
      );
      //console.log(resultUrl)

      var resultUrl_1 = await page.$$eval("li.b_algo >h2 > a", (elements) =>
        elements.map((item) => item.getAttribute("href"))
      );
      //console.log(resultUrl)
      resultUrl = !resultUrl.length ? resultUrl_1 : resultUrl;

      var relatedKeywords = await page.$$eval(
        "div.b_rs > ul.b_vList.b_divsec > li",
        (elements) => elements.map((item) => item.textContent)
      );
      //console.log(relatedKeywords)

      var mainQuestions = await page.$$eval(
        "div.b_expansion_wrapper.b_expand.b_divsec.b_onpage_expansion",
        (elements) => elements.map((item) => item.textContent)
      );
      //console.log(mainQuestions)

      var mainAnswers = await page.$$eval(
        "div.rwrl.rwrl_small.rwrl_padref",
        (elements) => elements.map((item) => item.innerHTML)
      );
      //console.log(mainAnswers)

      var richSnippet = await page.$$eval(
        "div.rwrl.rwrl_pri.rwrl_padref",
        (elements) => elements.map((item) => item.innerHTML)
      );
      //console.log(richSnippet)

      var richSnippetLink = await page.$$eval(
        "div.b_algo > h2 > a",
        (elements) => elements.map((item) => item.getAttribute("href"))
      );
      //console.log(richSnippetLink)

      var tabNav = await page.$$eval(
        "div.tab-menu.tab-hasnav > ul > li",
        (elements) => elements.map((item) => item.innerHTML)
      );
      //console.log(tabNav)

      var tabContent = await page.$$eval("div.tab-content > div", (elements) =>
        elements.map((item) => item.innerHTML)
      );
      //console.log(tabNav)

      var slideQuestions = await page.$$eval(
        "div.b_insideSlide > div.b_title",
        (elements) => elements.map((item) => item.textContent)
      );
      //console.log(tabNav)

      var slideAnswers = await page.$$eval(
        "div.b_insideSlide > div.b_text",
        (elements) => elements.map((item) => item.textContent)
      );
      //console.log(tabNav)

      var finalResult = {
        status: "success",
        resultTitle: resultTitle,

        resultDescription: resultDescription,
        resultUrl: resultUrl,

        mainQuestions: mainQuestions,
        mainAnswers: mainAnswers,
        richSnippet: richSnippet,
        richSnippetLink: richSnippetLink,
        slideQuestions: slideQuestions,
        slideAnswers: slideAnswers,
        relatedKeywords: relatedKeywords,
      };

      const selectors = await page.$$(".scs_icn");
      try {
        for (var i = 1; i < selectors.length; i++) {
          console.log(i);
          await selectors[i].click();
        }
      } catch (error) {
        console.log("no icon found for click");
      }

      var popQuestions = await page.$$eval(
        "div.scs_faAc > div.b_vPanel > div.b_module_expansion_control.b_module_head > div.b_module_expansion > div.b_expansion_wrapper.b_collapse.b_onpage_expansion",
        (elements) => elements.map((item) => item.textContent)
      );
      //console.log(popQuestions)
      var popAnswers = await page.$$eval(
        "div.rwrl.rwrl_small.rwrl_resetFont",
        (elements) => elements.map((item) => item.innerHTML)
      );
      //console.log(popAnswers)

      finalResult.popQuestions = popQuestions;
      finalResult.popAnswers = popAnswers;

      const selectorsNav = await page.$$("div.tab-menu.tab-hasnav > ul > li");
      try {
        for (var i = 1; i < selectorsNav.length; i++) {
          console.log(i);
          await selectorsNav[i].click();
        }
      } catch (error) {
        console.log("no NavBar found for click");
      }

      var tabNav = await page.$$eval(
        "div.tab-menu.tab-hasnav > ul > li",
        (elements) => elements.map((item) => item.innerHTML)
      );
      //console.log(tabNav)

      var tabContent = await page.$$eval("div.tab-content > div", (elements) =>
        elements.map((item) => item.innerHTML)
      );
      //console.log(tabNav)

      finalResult.tabNav = tabNav;
      finalResult.tabContent = tabContent;

      return finalResult;
    } catch (err) {
      console.error(err);
      return finalResult;
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

serp.get("/bing-thumb", (req, res) => {
  // Access the provided 'page' and 'limt' query parameters
  let url = req.query.url;

  let scrape = async () => {
    // Prepare scrape...

    const browser = await puppeteer.launch({
      // headless: false, //enable only when on localServer
      headless: true,

      ignoreDefaultArgs: ["--enable-automation"],
      ignoreHTTPSErrors: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-accelerated-2d-canvas",
        "--no-zygote",
        "--renderer-process-limit=1",
        "--no-first-run",
        "--disable-dev-shm-usage",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
    }); // Prevent non-needed issues for *NIX
    const page = await browser.newPage(); // Create request for the new page to obtain...
    await page.setViewport({
      width: 2000,
      height: 1000,
    });
    // await page.emulateTimezone("Asia/Singapore");

    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

    // Replace with your Google Maps URL... Or Test the Microsoft one...
    //await page.goto('https://www.google.com/maps/place/Microsoft/@36.1275216,-115.1728651,17z/data=!3m1!5s0x80c8c416a26be787:0x4392ab27a0ae83e0!4m7!3m6!1s0x80c8c4141f4642c5:0x764c3f951cfc6355!8m2!3d36.1275216!4d-115.1706764!9m1!1b1');

    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      // timeout: 0
    }); // Define the Maps URL to Scrape...

    console.log("waiting for selector");

    try {
      const result = await page.evaluate(() => {
        // Let's create variables and store values...
        let thumbnailClasses = document.querySelectorAll("a.iusc");
        let thumbnail = [];

        for (let elements of thumbnailClasses) {
          thumbnail.push(elements.getAttribute("m"));
        }

        var thumbnail_j = JSON.parse(thumbnail[0]);
        return thumbnail_j.murl;
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

  scrape().then((value) => {
    // Scrape and output the results...
    res.send(value); // Yay, output the Results...
  });
});

serp.get("/bing-images", (req, res) => {
  // Access the provided 'page' and 'limt' query parameters
  let url = req.query.url;

  let scrape = async () => {
    // Prepare scrape...

    const browser = await puppeteer.launch({
      // headless: false, //enable only when on localServer
      headless: true,

      ignoreDefaultArgs: ["--enable-automation"],
      ignoreHTTPSErrors: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-accelerated-2d-canvas",
        "--no-zygote",
        "--renderer-process-limit=1",
        "--no-first-run",
        "--disable-dev-shm-usage",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
    }); // Prevent non-needed issues for *NIX
    const page = await browser.newPage(); // Create request for the new page to obtain...
    await page.setViewport({
      width: 2000,
      height: 1000,
    });
    // await page.emulateTimezone("Asia/Singapore");

    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

    // Replace with your Google Maps URL... Or Test the Microsoft one...
    //await page.goto('https://www.google.com/maps/place/Microsoft/@36.1275216,-115.1728651,17z/data=!3m1!5s0x80c8c416a26be787:0x4392ab27a0ae83e0!4m7!3m6!1s0x80c8c4141f4642c5:0x764c3f951cfc6355!8m2!3d36.1275216!4d-115.1706764!9m1!1b1');

    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      // timeout: 0
    }); // Define the Maps URL to Scrape...

    console.log("waiting for selector");

    try {
      const result = await page.evaluate(() => {
        // Let's create variables and store values...
        let imagesClasses = document.querySelectorAll("a.iusc");
        let images = {
          images: [],
        };

        for (let elements of imagesClasses) {
          images["images"].push(elements.getAttribute("m"));
        }

        return images;
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

  scrape().then((value) => {
    // Scrape and output the results...
    res.send(value); // Yay, output the Results...
  });
});

serp.get("/bing-news", (req, res) => {
  // Access the provided 'page' and 'limt' query parameters
  let url = req.query.url;

  let scrape = async () => {
    // Prepare scrape...

    const browser = await puppeteer.launch({
      // headless: false, //enable only when on localServer
      headless: true,

      ignoreDefaultArgs: ["--enable-automation"],
      ignoreHTTPSErrors: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-accelerated-2d-canvas",
        "--no-zygote",
        "--renderer-process-limit=1",
        "--no-first-run",
        "--disable-dev-shm-usage",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
    }); // Prevent non-needed issues for *NIX
    const page = await browser.newPage(); // Create request for the new page to obtain...
    await page.setViewport({
      width: 2000,
      height: 1000,
    });
    // await page.emulateTimezone("Asia/Singapore");

    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

    // Replace with your Google Maps URL... Or Test the Microsoft one...
    //await page.goto('https://www.google.com/maps/place/Microsoft/@36.1275216,-115.1728651,17z/data=!3m1!5s0x80c8c416a26be787:0x4392ab27a0ae83e0!4m7!3m6!1s0x80c8c4141f4642c5:0x764c3f951cfc6355!8m2!3d36.1275216!4d-115.1706764!9m1!1b1');

    const response = await page.goto(url, {
      waitUntil: "networkidle2",
      // timeout: 0
    }); // Define the Maps URL to Scrape...

    console.log("waiting for selector");

    try {
      const result = await page.evaluate(() => {
        // Let's create variables and store values...

        let titleClasses = document.querySelectorAll("a.title");
        let title = [];

        for (let elements of titleClasses) {
          title.push(elements.textContent);
        }

        let descriptionClasses = document.querySelectorAll("div.snippet");
        let description = [];

        for (let elements of descriptionClasses) {
          description.push(elements.textContent);
        }

        return {
          title,
          description,
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

  scrape().then((value) => {
    // Scrape and output the results...
    res.send(value); // Yay, output the Results...
  });
});

serp.get("/bing-videos", (req, res) => {
  // Access the provided 'page' and 'limt' query parameters
  let url = req.query.url;

  let scrape = async () => {
    // Prepare scrape...

    const browser = await puppeteer.launch({
      // headless: false, //enable only when on localServer
      headless: true,

      ignoreDefaultArgs: ["--enable-automation"],
      ignoreHTTPSErrors: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-accelerated-2d-canvas",
        "--no-zygote",
        "--renderer-process-limit=1",
        "--no-first-run",
        "--disable-dev-shm-usage",
        "--single-process", // <- this one doesn't works in Windows
        "--disable-gpu",
      ],
    }); // Prevent non-needed issues for *NIX
    const page = await browser.newPage(); // Create request for the new page to obtain...
    await page.setViewport({
      width: 2000,
      height: 1000,
    });
    // await page.emulateTimezone("Asia/Singapore");

    // await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36');

    // Replace with your Google Maps URL... Or Test the Microsoft one...
    //await page.goto('https://www.google.com/maps/place/Microsoft/@36.1275216,-115.1728651,17z/data=!3m1!5s0x80c8c416a26be787:0x4392ab27a0ae83e0!4m7!3m6!1s0x80c8c4141f4642c5:0x764c3f951cfc6355!8m2!3d36.1275216!4d-115.1706764!9m1!1b1');

    const response = await page.goto(url, {
      waitUntil: "networkidle0",
      // timeout: 0
    }); // Define the Maps URL to Scrape...

    console.log("waiting for selector");

    try {
      const result = await page.evaluate(() => {
        // Let's create variables and store values...
        let videosClasses = document.querySelectorAll("div.vrhdata");
        let videos = [];

        for (let elements of videosClasses) {
          videos.push(elements.getAttribute("vrhm"));
        }

        return videos;
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

  scrape().then((value) => {
    // Scrape and output the results...
    res.send(value); // Yay, output the Results...
  });
});

module.exports = serp;
