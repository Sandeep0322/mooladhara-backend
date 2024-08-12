import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || 3004;
export const DB_PATH =
  process.env.DB_PATH ||
  "mongodb+srv://sandeep123:Sandeep0322@variableapi.giniydp.mongodb.net/mooladhara";
export const jwtPrivateKey =
  process.env.jwtPrivateKey || "mooladharaSecretEncription";
