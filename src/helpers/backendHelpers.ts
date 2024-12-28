import fs from "fs";
import path from "path";

export const deleteDirectory = async (dirPath: string) => {
  const files = await fs.promises.readdir(dirPath);
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      await deleteDirectory(filePath); // Recursively delete directories
    } else {
      await fs.promises.unlink(filePath); // Delete file
    }
  }
  await fs.promises.rmdir(dirPath); // Remove the empty directory
};
