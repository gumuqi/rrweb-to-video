'use strict';

const puppeteer = require('puppeteer');
const Page = require('./page');
const server = require('./server');

class Manager {
  constructor () {
    this.pageList = []; // tab 页
    this.browser = null;
    this.launch();
    server.createServer();
  }
  async launch () {
    console.log('启动无头浏览器');
    this.browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      // headless: false,
      // devtools: true,
      args: [
        '–disable-gpu',
        '–disable-dev-shm-usage',
        '–disable-setuid-sandbox',
        '–no-first-run',
        '–no-sandbox',
        '–no-zygote',
        '–single-process'
      ]
    });
    return this.browser
  }
  async newPage (events, options) {
    console.log('新建 tab 页');
    const page = await this.browser.newPage();
    const pageTab = new Page ({
      page,
      events,
      options
    });
    pageTab.on('start', () => {
      // console.log('开始回放')
    });
    pageTab.on('end', () => {
      //console.log('结束回放，生成视频')
      pageTab.close();
      let index = this.pageList.indexOf(pageTab);
      this.pageList.splice(index, 1);
    });
    pageTab.init();
    this.pageList.push(pageTab);
  }
 
  transform (events, options = {}) {
    if (!this.browser) {
      // 如果无头浏览器还没启动好，轮询检测
      let timer = setInterval(() => {
        if (this.browser) {
          clearInterval(timer);
          this.newPage(events, options);
        }
      }, 100);
    } else {
      this.newPage(events, options);
    }
    

  }
}

module.exports = new Manager();
