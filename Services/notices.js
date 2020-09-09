const request = require("request");
const cheerio = require("cheerio");
const htmlToMd = require("html-to-md");

exports.getNotices = async (url, callback) => {
  request(url, async (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      var list = [];

      $(".card-columns > .card").each(function () {
        var date = $(this).find("div > div > p").text();
        var title = $(this).find("div > div > a").text();
        var link = $(this).find("div > div > a").attr("href");
        // console.log(data);
        list.push({
          date: date,
          title: title,
          link: link,
        });
      });
      return callback(list);
    }
  });
};
exports.getNoticeContent = async (url, callback) => {
  request(url, async (error, response, html) => {
    if (!error && response.statusCode == 200) {
      const $ = cheerio.load(html);
      const Entities = require("html-entities").AllHtmlEntities;

      const entities = new Entities();
      $(".dpsp-share-text").remove();
      $("#dpsp-content-bottom").remove();
      const htmlContent = $(
        "body > div.main-page-wrapper > section.single-notice > div > div > main > div > div"
      );

      const title = htmlContent.find("h4").text();
      const content = htmlContent.find("p").text();
      const images = [];
      htmlContent.find("img").each(function () {
        var imageUrl = $(this).attr("src");
        images.push(imageUrl);
      });
      const attachments = [];
      htmlContent.find("a").each(function () {
        var attachmentUrl = $(this).attr("href");
        var attachmentTitle = $(this).text();
        attachments.push({
          title: attachmentTitle,
          url: attachmentUrl,
        });
      });
      const htmlData = entities.decode(htmlContent.html());
      const markdown = htmlToMd(htmlData);

      return callback({
        title: title,
        content: content.replace("Sharing is caring!", ""),
        html: htmlData,
        markdown: markdown,
        images: images,
        attachments: attachments,
      });
    }
  });
};
