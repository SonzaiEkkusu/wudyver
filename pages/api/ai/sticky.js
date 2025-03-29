import axios from "axios";
class Sticky {
  constructor() {
    const base64ApiKey = "c2stZ2hVbDFHbGtQZ0dFMm1kUjcyRFBUM0JsYmtGSkcxSFcwUTlUZGdWeWtKdUFMM1hT";
    const apiKey = Buffer.from(base64ApiKey, "base64").toString("utf-8");
    this.headersGenerate = {
      accept: "application/json, text/plain, */*",
      "accept-language": "id-ID,id;q=0.9",
      authorization: `Bearer ${apiKey}`,
      "cache-control": "no-cache",
      "content-type": "application/json",
      origin: "https://sticky.cool",
      pragma: "no-cache",
      priority: "u=1, i",
      referer: "https://sticky.cool/",
      "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24", "Microsoft Edge Simulate";v="131", "Lemur";v="131"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
    };
    this.headersSticky = {
      accept: "application/json, text/plain, */*",
      "accept-language": "id-ID,id;q=0.9",
      apikey: "0b584babc5d2c068d08b8e4f120f1183",
      "cache-control": "no-cache",
      "content-type": "application/json",
      origin: "https://sticky.cool",
      pragma: "no-cache",
      priority: "u=1, i",
      referer: "https://sticky.cool/",
      "sec-ch-ua": '"Chromium";v="131", "Not_A Brand";v="24", "Microsoft Edge Simulate";v="131", "Lemur";v="131"',
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": '"Android"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "cross-site",
      "user-agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36"
    };
  }
  async generateImage(prompt, num) {
    const url = "https://api.openai.com/v1/images/generations";
    const data = {
      prompt: prompt,
      n: num,
      response_format: "url"
    };
    try {
      const response = await axios.post(url, data, {
        headers: this.headersGenerate
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
  async sendImageData(imgList) {
    const url = "https://api.stipop.com/v4.0.1/sticky/image";
    const data = {
      imgList: imgList.map(img => ({
        url: img.url
      }))
    };
    try {
      const response = await axios.post(url, data, {
        headers: this.headersSticky
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}
export default async function handler(req, res) {
  const sticky = new Sticky();
  const {
    action
  } = req.query;
  if (req.method === "GET") {
    if (action === "generate") {
      const {
        prompt,
        num
      } = req.query;
      if (!prompt || !num) {
        return res.status(400).json({
          error: "Missing prompt or num parameter"
        });
      }
      try {
        const result = await sticky.generateImage(prompt, parseInt(num));
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({
          error: "Error generating image"
        });
      }
    } else if (action === "sticky") {
      const {
        url
      } = req.query;
      if (!url) {
        return res.status(400).json({
          error: "Missing url parameter"
        });
      }
      try {
        const result = await sticky.sendImageData([{
          url: url
        }]);
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({
          error: "Error sending image data"
        });
      }
    } else {
      res.status(400).json({
        error: "Unknown action"
      });
    }
  } else if (req.method === "POST") {
    if (action === "generate") {
      const {
        prompt,
        num
      } = req.body;
      if (!prompt || !num) {
        return res.status(400).json({
          error: "Missing prompt or num parameter"
        });
      }
      try {
        const result = await sticky.generateImage(prompt, parseInt(num));
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({
          error: "Error generating image"
        });
      }
    } else if (action === "sticky") {
      const {
        imgList
      } = req.body;
      if (!imgList || !Array.isArray(imgList)) {
        return res.status(400).json({
          error: "Invalid image list"
        });
      }
      try {
        const result = await sticky.sendImageData(imgList.map(img => ({
          url: img.url
        })));
        res.status(200).json(result);
      } catch (error) {
        res.status(500).json({
          error: "Error sending image data"
        });
      }
    } else {
      res.status(400).json({
        error: "Unknown action"
      });
    }
  } else {
    res.status(405).json({
      error: "Method Not Allowed"
    });
  }
}