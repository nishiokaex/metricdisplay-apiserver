var router = require ('express').Router ();
var puppeteer = require ('puppeteer');

router.get ('/amiami', async function (request, response, next) {
  const browser = await puppeteer.launch ({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1600,950',
      '--lang=ja,en-US',
    ],
  });
  /*
  const browser = await puppeteer.launch ({
    headless: false, // ヘッドレスをオフに
    slowMo: 100, // 動作を遅く
  });
  */
  const page = await browser.newPage ();
  await page.setViewport ({width: 1600, height: 950});
  await page.setUserAgent (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
  );
  try {
    await page.goto (
      'https://www.amiami.jp/top/detail/detail?gcode=GAME-0022719'
    );

    // 在庫なしボタンをチェック
    const elem = await page.$ ('.cartbtn_not_preorder_closed');
    await browser.close ();

    if (elem) {
      // 在庫なし
      response.json ({
        content: 'リングフィット@あみあみ',
        status: 1,
      });
    } else {
      // 在庫あり
      response.json ({
        content: 'リングフィット@あみあみ',
        status: 2,
      });
    }
  } catch (ex) {
    // エラー
    response.json ({
      content: 'リングフィット@あみあみ',
      status: 0,
    });
  }
});

router.get ('/yodobashi', async function (request, response, next) {
  /*
  const browser = await puppeteer.launch ({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  */
  const browser = await puppeteer.launch ({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1600,950',
      '--lang=ja,en-US',
    ],
  });
  const page = await browser.newPage ();
  await page.setViewport ({width: 1600, height: 950});
  await page.setUserAgent (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
  );
  try {
    await page.goto ('https://www.yodobashi.com/product/100000001005138030/');

    // 在庫ありボタンをチェック
    const elem = await page.$ ('.buyBtn');
    await browser.close ();

    if (elem) {
      // 在庫あり
      response.json ({
        content: 'リングフィット@ヨドバシ',
        status: 2,
      });
    } else {
      // 在庫なし
      response.json ({
        content: 'リングフィット@ヨドバシ',
        status: 1,
      });
    }
  } catch (ex) {
    // エラー
    response.json ({
      content: 'リングフィット@ヨドバシ',
      status: 0,
    });
  }
});

router.get ('/zaiko', async function (request, response, next) {
  /*
  const browser = await puppeteer.launch ({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  */
  const browser = await puppeteer.launch ({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--window-size=1600,950',
      '--lang=ja,en-US,en',
    ],
  });
  const page = await browser.newPage ();
  await page.setViewport ({width: 1600, height: 950});
  await page.setUserAgent (
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.163 Safari/537.36'
  );
  try {
    await page.goto ('https://min-zaiko.com/ring-fit-adventure');

    // console.log (await page.content ());
    // 在庫ありボタンをチェック
    var list = await page.$$ ('a');
    var yodobashi;
    var amiami;

    for (let i = 0; i < list.length; i++) {
      var textContent = await (await list[i].getProperty (
        'textContent'
      )).jsonValue ();
      if (textContent.includes ('ヨドバシ')) {
        var textContent2 = await (await list[i + 1].getProperty (
          'textContent'
        )).jsonValue ();
        yodobashi = !textContent2.includes ('なさそう');
      }
      if (textContent.includes ('あみあみ')) {
        var textContent2 = await (await list[i + 1].getProperty (
          'textContent'
        )).jsonValue ();
        amiami = !textContent2.includes ('なさそう');
      }
    }

    await browser.close ();

    if (yodobashi || amiami) {
      // 在庫あり
      response.json ({
        content: 'ヨドバシ: ' +
          (yodobashi ? 'あり' : 'なし') +
          '/ あみあみ: ' +
          (amiami ? 'あり' : 'なし'),
        status: 2,
      });
    } else {
      // 在庫なし
      response.json ({
        content: 'ヨドバシ: ' +
          (yodobashi ? 'あり' : 'なし') +
          ' あみあみ: ' +
          (amiami ? 'あり' : 'なし'),
        status: 1,
      });
    }
  } catch (ex) {
    console.log (ex);
    // エラー
    response.json ({
      content: 'リングフィット@ヨドバシ',
      status: 0,
    });
  }
});

module.exports = router;
