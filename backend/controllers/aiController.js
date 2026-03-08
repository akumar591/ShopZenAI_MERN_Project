import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const scanImage = async (req, res) => {
  try {
    const imagePath = req.file.path;

    const base64Image = fs.readFileSync(imagePath, {
      encoding: "base64",
    });

    const mimeType = req.file.mimetype;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
    });

    const result = await model.generateContent([
      `
You are an expert e-commerce product analyst.

Analyze the product image and return ONLY JSON:

{
"name":"",
"description":"",
"category":"",
"subCategory":""
}

Return only JSON.
`,
      {
        inlineData: {
          data: base64Image,
          mimeType: mimeType,
        },
      },
    ]);

    const rawText = result.response.text();

    console.log("AI RAW TEXT 👉", rawText);

    let parsed;

    try {
      parsed = JSON.parse(rawText);
    } catch (err) {
      parsed = { raw: rawText };
    }

    return res.json({
      success: true,
      result: parsed,
    });
  } catch (error) {
    console.error("AI ERROR 👉", error);

    return res.json({
      success: false,
      message: "AI image scan failed",
    });
  }
};
