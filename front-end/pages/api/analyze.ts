import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  // 샘플 데이터 응답
  const sampleData = fs.readFileSync(path.join(process.cwd(), "public", "sample-data.json"), "utf8");
  res.status(200).json(JSON.parse(sampleData));
}
