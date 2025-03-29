import fetch from "node-fetch";
const API_URL = "https://api.blackbox.ai/api/chat";
const TO_CLEAN = ["Generated by BLACKBOX.AI, try unlimited chat https://www.blackbox.ai"];
class Chat {
  constructor(model = "gpt-4o", temperature = .7) {
    this.MODELS = {
      GPT4O: "gpt-4o",
      GEMINI_PRO: "gemini-pro",
      CLAUDE_SONNET: "claude-sonnet-3.5",
      BASIC: null
    };
    this.MODES = {
      IMAGE_GENERATION: {
        id: "ImageGenerationLV45LJp",
        mode: true,
        name: "Image Generation"
      }
    };
    this.messages = [];
    this.codeModelMode = false;
    this.agentMode = {};
    this.maxTokens = 1024;
    this.userSystemPrompt = "";
    this.playgroundTemperature = temperature;
    this.userSelectedModel = model;
  }
  async _postApi(data) {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        mode: "cors",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
          Accept: "*/*",
          "Accept-Language": "en-US,en;q=0.5",
          "Accept-Encoding": "gzip, deflate, br",
          Referer: "https://api.blackbox.ai/",
          "Content-Type": "application/json",
          Origin: "https://api.blackbox.ai",
          DNT: "1",
          "Sec-GPC": "1",
          "Alt-Used": "api.blackbox.ai",
          Connection: "keep-alive"
        },
        body: data,
        timeout: 3e4
      });
      if (!response.ok) throw new Error(`API request failed with status: ${response.status}`);
      let result = await response.text();
      TO_CLEAN.forEach(cleanText => {
        result = result.replace(cleanText, "");
      });
      return result;
    } catch (error) {
      throw new Error(`API request failed: ${error.message}`);
    }
  }
  async chat({
    model = "gpt-4o",
    prompt = "",
    web = true,
    agent = false
  }) {
    try {
      this.userSelectedModel = model;
      this.agentMode = agent ? agent : this.agentMode;
      this.messages.push({
        content: prompt,
        role: "user"
      });
      const payload = {
        messages: this.messages.map(m => ({
          content: m.content,
          role: m.role
        })),
        codeModelMode: this.codeModelMode,
        agentMode: this.agentMode,
        maxTokens: this.maxTokens,
        userSystemPrompt: this.userSystemPrompt,
        playgroundTemperature: this.playgroundTemperature,
        userSelectedModel: this.userSelectedModel,
        clickedAnswer2: false,
        clickedAnswer3: false,
        clickedForceWebSearch: web
      };
      const jsonData = JSON.stringify(payload);
      const response = await this._postApi(jsonData);
      this.messages.push({
        content: response,
        role: "assistant"
      });
      return response;
    } catch (error) {
      throw new Error("Failed to send message");
    }
  }
}
export default async function handler(req, res) {
  try {
    const {
      model,
      prompt,
      web,
      agent,
      agentId,
      agentName
    } = req.method === "GET" ? req.query : req.body;
    const chat = new Chat(model || "gpt-4o");
    const useagent = {
      id: agentId || "",
      name: agentName || ""
    };
    const response = await chat.chat({
      model: model || "gpt-4o",
      prompt: prompt || "",
      web: web === "true",
      agent: useagent ? useagent : null
    });
    res.status(200).json({
      result: response
    });
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
}