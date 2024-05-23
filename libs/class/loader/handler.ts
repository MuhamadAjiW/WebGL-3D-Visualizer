import type { NextApiRequest, NextApiResponse } from "next";
import { promises as fs } from "fs";
import path from "path";
import { Loader } from "./loader"; // Adjust the import to your Loader class location

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { sceneData, filename } = req.body;
    const loader = new Loader();

    // Validate scene data
    const result = loader.validateSceneData(sceneData);
    if (!result.success) {
      return res
        .status(400)
        .json({ error: "Invalid data", details: result.error.errors });
    }

    // Save scene data to file
    try {
      const filePath = path.join(process.cwd(), "data", `${filename}.json`);
      await fs.writeFile(filePath, JSON.stringify(sceneData, null, 2));
      return res.status(200).json({ message: "Data saved successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Failed to save data" });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
