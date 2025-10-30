import cors from "cors";
app.use(cors());

import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = 3000;

app.use(express.json());

const BLYNK_AUTH_TOKEN = "QhaE1GqAW43iph5gu06laqEN7EcyEpFv";

app.post("/sendBlynk", async (req, res) => {
  const data = req.body;
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
    } catch (err) {
      allSuccess = false;
    }
  }

  if (allSuccess) res.json({ message: `🌿 Tất cả thông số của "${data.name}" đã gửi thành công!` });
  else res.json({ message: `⚠️ Một số thông số chưa gửi được.` });
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
