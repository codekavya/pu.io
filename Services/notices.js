import request from "request";
import { load } from "cheerio";
import htmlToMd from "html-to-md";

export async function getNotices(url, callback) {
  request(url, async (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = load(html);
      var list = [];
      //loops through each cards in card-columns
      $(".card-columns > .card").each(function () {
        var date = $(this).find("div > div > p").text();
        var title = $(this).find("div > div > a").text();
        var link = $(this).find("div > div > a").attr("href");

        list.push({
          date: date,
          title: title,
          link: link,
        });
      });
      return callback(list);
    }
  });
}
export async function getNoticeContent(url, callback) {
  request(url, async (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = load(html);
      const Entities = require("./node_modules/html-entities").AllHtmlEntities;
      //removed share text and share buttons
      const entities = new Entities();
      $(".dpsp-share-text").remove();
      $("#dpsp-content-bottom").remove();

      //absolute path for htmlcontent of notice
      const htmlContent = $(
        "body > div.main-page-wrapper > section.single-notice > div > div > main > div > div"
      );
      //Content title is generally in h4
      const title = htmlContent.find("h4").text();
      const content = htmlContent.find("p").text();
      const images = [];

      //finds each image
      htmlContent.find("img").each(function () {
        var imageUrl = $(this).attr("src");
        images.push(imageUrl);
      });
      const attachments = [];

      //finds each a href tag
      htmlContent.find("a").each(function () {
        var attachmentUrl = $(this).attr("href");
        var attachmentTitle = $(this).text();
        attachments.push({
          title: attachmentTitle,
          url: attachmentUrl,
        });
      });
      //raw Html Data, entities decoded for markdown
      const htmlData = entities.decode(htmlContent.html());
      // a loosely translated markdown format of data
      const markdown = htmlToMd(htmlData);
      //calls callback function lol why you read this.
      return callback({
        title: title,
        content: content,
        html: htmlData,
        markdown: markdown,
        images: images,
        attachments: attachments,
      });
    }
  });
}
