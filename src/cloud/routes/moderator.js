import path from "path";
import ParcelBundler from "parcel-bundler";
import express from "express";

const router = express.Router();

const isProduction = process.env.NODE_ENV === "production";
const file = path.join(__dirname, "../src/react/moderator.html");
const options = {
  outDir: path.join(__dirname, "../public"),
  cache: false,
  minify: isProduction,
  sourceMaps: !isProduction,
  watch: !isProduction,
};
const bundler = new ParcelBundler(file, options);

router.use(bundler.middleware());

export default router;
