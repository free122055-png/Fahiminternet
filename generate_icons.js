const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const source = path.join(__dirname, "public", "app-icon.png");

const densities = {
  "mipmap-mdpi": 48,
  "mipmap-hdpi": 72,
  "mipmap-xhdpi": 96,
  "mipmap-xxhdpi": 144,
  "mipmap-xxxhdpi": 192,
};

const files = [
  "ic_launcher.png",
  "ic_launcher_round.png",
  "ic_launcher_foreground.png",
];

async function main() {
  console.log("=================================");
  console.log(" FAHIM INTERNET ICON GENERATOR");
  console.log("=================================");

  if (!fs.existsSync(source)) {
    throw new Error(
      "FATAL ERROR: public/app-icon.png পাওয়া যায়নি।"
    );
  }

  console.log("Source icon found.");

  for (const [density, size] of Object.entries(densities)) {
    const directory = path.join(
      __dirname,
      "android",
      "app",
      "src",
      "main",
      "res",
      density
    );

    fs.mkdirSync(directory, { recursive: true });

    for (const fileName of files) {
      const output = path.join(directory, fileName);

      await sharp(source)
        .resize(size, size, {
          fit: "contain",
          background: {
            r: 255,
            g: 255,
            b: 255,
            alpha: 1,
          },
        })
        .png()
        .toFile(output);

      console.log(`Created: ${output}`);
    }
  }

  console.log("=================================");
  console.log(" ALL ICONS CREATED SUCCESSFULLY");
  console.log("=================================");
}

main().catch((error) => {
  console.error("ICON GENERATION FAILED:");
  console.error(error);
  process.exit(1);
});
