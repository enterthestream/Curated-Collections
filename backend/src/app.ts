import express from "express";
import {
  deleteArtwork,
  getAllCollections,
  getCollectionById,
  postArtwork,
  postCollection,
} from "./controllers/controllers";

const app = express();

app.use(express.json());

app.get("/collections", getAllCollections);

app.get("/collections/:collectionId", getCollectionById);

app.post("/collections", postCollection);

app.post("/collections/:collectionId/artworks", postArtwork);

app.delete("/collections/:collectionId/artworks", deleteArtwork);

app.all("*", (request, response) => {
  response.status(404).send({ msg: "path not found" });
});

export default app;
