// /api/sendBlynk.js
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const BLYNK_AUTH_TOKEN = "QhaE1GqAW43iph5gu06laqEN7EcyEpFv";
  const data = req.body;

  // Parse input just like your old Express code
  const parameters = {
    3: Number(data.nd.split("–")[0].split('°')[0]).trim(),
    4: Number(data.nd.split("–")[1].split('°')[0]).trim(),
    8: Number(data.da.split("–")[0].split('%')[0]).trim(),
    9: Number(data.da.split("–")[1].split('%')[0]).trim(),
    12: Number(data.as.split(", ")[1].split("–")[0].split(' lux')[0]).trim(),
    13: Number(data.as.split(", ")[1].split("–")[1].split(' lux')[0]).trim(),
  };

  let allSuccess = true;

  for (const [pin, value] of Object.entries(parameters)) {
    const url = `https://blynk.cloud/external/api/update?token=${BLYNK_AUTH_TOKEN}&v${pin}=${value}`;
    try {
      const resp = await fetch(url);
      const text = await resp.text();
      if (text.trim() !== "OK") allSuccess = false;
    } catch {
      allSuccess = false;
    }
  }

  res.status(200).json({
    message: allSuccess
      ? `🌿 Tất cả thông số của "${data.name}" đã gửi thành công!`
      : `⚠️ Một số thông số chưa gửi được.`,
  });
}
