import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const requiredEnvVars = [
  "JWT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "GOOGLE_REDIRECT_URI",
  "GITHUB_CLIENT_ID",
  "GITHUB_CLIENT_SECRET",
  "FACEBOOK_CLIENT_ID",
  "FACEBOOK_CLIENT_SECRET",
];

const missingVars = requiredEnvVars.filter((envVar) => !process.env[envVar]);

if (missingVars.length > 0) {
  console.error(`Missing environment variables: ${missingVars.join(", ")}`);
  process.exit(1);
} else {
  console.log("All required environment variables are set.");
}
