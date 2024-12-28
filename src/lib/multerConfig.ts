import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

const storage: StorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    const userEmail = req.body.email; // Expect `email` in the form data.
    if (!userEmail) {
      return NextResponse.json(
        { message: "email is required", success: false },
        { status: 400 }
      );
    }

    const uploadDir = path.join(process.cwd(), `public/uploads/${userEmail}`);
    const subDir = file.fieldname === "profilePic" ? "profile" : "resume";
    const finalDir = path.join(uploadDir, subDir);

    // If profile folder exists, delete it
    if (fs.existsSync(finalDir)) {
      fs.rmSync(finalDir, { recursive: true, force: true });
    }

    // Create directories
    fs.mkdirSync(finalDir, { recursive: true });

    cb(null, finalDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Extract file extension
    cb(null, `${file.fieldname}${ext}`); // Use the field name directly as the file name
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 5 }, // 5MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/jpg",
      "application/pdf",
    ];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      return NextResponse.json(
        {
          message: "only jpeg, png, jpg and pdf files are allowed..",
          success: false,
        },
        { status: 400 }
      );
    }
  },
});

export default upload;
