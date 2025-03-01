import app from "./app";
const { PORT = 8080 } = process.env;

const server = app.listen(PORT, (err?: Error) => {
  if (err) {
    console.error("Error starting server", err);
    return;
  }
  console.log(`Server listening on http://localhost:${PORT}`);
});
