import { Builder, By, WebElement } from "selenium-webdriver";

// biome-ignore lint/correctness/noNodejsModules: <explanation>
import fs from "node:fs";

const driver = new Builder().forBrowser("chrome").build();

const config = {
  作業開始ページURL:
    "https://job.mynavi.jp/25/pc/corpinfo/displayCorpSearch/index?tab=corp",
  採用人数の種類: [
    // "若干名",
    // "１〜５名",
    // "６〜１０名",
    // "１１〜１５名",
    // "１６〜２０名",
    // "２１〜２５名",
    // "２６〜３０名",
    "３１〜３５名",
    "３６〜４０名",
    "４１〜４５名",
    "４６〜５０名",
    "５１〜１００名",
    "１０１〜２００名",
    "２０１〜３００名",
    "３０１名〜",
  ],

  __separator__: ",",
  __is_debug__: false,
};

const 採用人数の種類とインデックスのマッピング = new Map([
  ["若干名", 0],
  ["１〜５名", 1],
  ["６〜１０名", 2],
  ["１１〜１５名", 3],
  ["１６〜２０名", 4],
  ["２１〜２５名", 5],
  ["２６〜３０名", 6],
  ["３１〜３５名", 7],
  ["３６〜４０名", 8],
  ["４１〜４５名", 9],
  ["４６〜５０名", 10],
  ["５１〜１００名", 11],
  ["１０１〜２００名", 12],
  ["２０１〜３００名", 13],
  ["３０１名〜", 14],
]);

const 作業開始ページにアクセス = async () => {
  await driver.get(config.作業開始ページURL);
};

const 採用データタブをクリック = async () => {
  // searchTopCorp と searchTopCorpCr の両方を class に持つ li タグのうち、５番目のものをクリックする
  const li = await driver.findElement(
    By.xpath(
      `//li[contains(concat(" ",normalize-space(@class)," "),"searchTopCorp") and contains(concat(" ",normalize-space(@class)," "),"searchTopCorpCr")][5]`,
    ),
  );

  await li.click();
};

const 採用データのチェックボックスをクリック = async (index: number) => {
  // id が crpRecruitingCntCtg${index} の input をクリックする
  const input = await driver.findElement(By.id(`crpRecruitingCntCtg${index}`));

  try {
    await input.click();
  } catch {
    // クリック可能でなければ、120px 下にスクロールする (フッターが重なってしまう場合があるため)
    await driver.executeScript(
      `window.scrollBy({ top: 120, left: 0, behavior: "instant" })`,
    );
    await input.click();
  }
};

const 検索ボタンをクリック = async () => {
  // id が　doSearch の button をクリックする
  const button = await driver.findElement(By.id("doSearch"));

  // クリック可能でなければ少し待ってから再度クリックする (これを何度か繰り返す)
  let retryCount = 0;
  const maxRetryCount = 5;
  const interval = 700;
  while (retryCount < maxRetryCount) {
    try {
      await button.click();
      break;
    } catch {
      await new Promise((resolve) => setTimeout(resolve, interval));
      retryCount++;
    }
  }
};

const 一覧ページの結果を全ページ分ループして取得 = async () => {
  const result: CompanyInfo[] = [];

  let count = 0;
  const __maxLoopForDebug = 4;
  while (true) {
    if (config.__is_debug__ && count++ > __maxLoopForDebug) break;

    const list = await _一覧の会社名とリンクを取得();
    result.push(...list);

    try {
      await _次のページに移動();
    } catch (e) {
      if (e instanceof UpperNextPageBtnNotFound) {
        if (config.__is_debug__)
          console.log(
            "次のページに移動するボタンが見つからなかったため、次の採用人数の種類に移動します",
            { e },
          );
        break;
      }

      throw e;
    }
  }

  return result;
};

const _一覧の会社名とリンクを取得 = async () => {
  // index が 0~maxIndex でループして、
  // id が corpNameLink[${index}] の a タグのテキストと href を取得する
  const result: CompanyInfo[] = [];
  const maxIndex = 100;
  for (let index = 0; index < maxIndex; index++) {
    let a: WebElement;
    try {
      a = await driver.findElement(By.id(`corpNameLink[${index}]`));
    } catch (e) {
      // a タグが見つからない場合はループを終了する
      if (config.__is_debug__)
        console.log(
          "a タグが見つからないため「一覧の会社名とリンクを取得」を終了します",
          { index, e },
        );
      break;
    }

    const name = (await a.getText())
      .replace("PICK UP", "") // "PICK UP" という文字列は text から削除する
      .trim();
    const link = await a.getAttribute("href");

    result.push({ name, link });
  }

  return result;
};

const _次のページに移動 = async () => {
  // id が upperNextPage の a タグをクリックする
  let a: WebElement;
  try {
    a = await driver.findElement(By.id("upperNextPage"));
  } catch {
    throw new UpperNextPageBtnNotFound(
      "次のページに移動するボタンが見つかりませんでした",
    );
  }

  await a.click();
};

/**
 * ヘッダー: 採用人数, 会社名, リンク
 * ボディ: 1〜5名, 会社A, https://example.com
 */
const CSVをファイル出力 = async (result: CompanyInfoResult) => {
  const header = `採用人数${config.__separator__}会社名${config.__separator__}会社ページへのリンク\n`;
  const body = Object.entries(result)
    .map(([_, list], index) => {
      const row = list
        .map(({ name, link }) =>
          `${__escape_comma(config.採用人数の種類[index])}${config.__separator__}${__escape_comma(name)}${config.__separator__}${__escape_comma(link)}`.concat(
            "\n",
          ),
        )
        .join("");

      return row;
    })
    .join("");

  const csv = header.concat(body);

  fs.writeFileSync("output.csv", csv);
};

const __escape_comma = (text: string) => text.replace(",", "，");

const main = async () => {
  const result: CompanyInfoResult = {};

  for (const category of config.採用人数の種類) {
    const index = 採用人数の種類とインデックスのマッピング.get(category);
    if (index === undefined) {
      throw new Error(
        `採用人数の種類「${category}」に対応するインデックスが見つかりません`,
      );
    }

    await 作業開始ページにアクセス();
    await 採用データタブをクリック();
    await 採用データのチェックボックスをクリック(index);
    await 検索ボタンをクリック();

    result[index] = await 一覧ページの結果を全ページ分ループして取得();
  }

  await CSVをファイル出力(result);
};

main();

class UpperNextPageBtnNotFound extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UpperNextPageBtnNotFound";
  }
}

type CompanyInfo = {
  name: string;
  link: string;
};

type CompanyInfoResult = Record<number, CompanyInfo[]>;
