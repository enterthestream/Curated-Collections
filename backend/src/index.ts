import app from "./app";

const { PORT, DATABASE_FILE, SECRET_KEY } = process.env;

console.log(PORT, DATABASE_FILE, SECRET_KEY);

const server = app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error("Error starting server", err);
    return;
  }
  console.log(`Server listening on http://localhost:${PORT}`);
});
