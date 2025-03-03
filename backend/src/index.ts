import dotenv from "dotenv";
dotenv.config();

import app from "./app";

const { PORT, DATABASE_URL, SECRET_KEY } = process.env;

const server = app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error("Error starting server", err);
    return;
  }
  console.log(`Server listening on http://localhost:${PORT}`);
});
