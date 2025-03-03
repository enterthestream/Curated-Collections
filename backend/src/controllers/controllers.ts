import { Request, Response } from "express";
import {
  addArtwork,
  addCollection,
  fetchAllCollections,
  fetchCollectionById,
  removeArtwork,
} from "../models/db";
import { randomUUID } from "crypto";

export async function getAllCollections(req: Request, res: Response) {
  try {
    const collections = await fetchAllCollections();
    res.status(200).json(collections);
  } catch (err) {
    res.status(500).json({ msg: "error fetching collections", err });
  }
}

export async function getCollectionById(req: Request, res: Response) {
  try {
    const { collectionId } = req.params;

    const collection = await fetchCollectionById(collectionId);

    if (collection) {
      res.status(200).json(collection);
    } else {
      res.status(404).json({ msg: "Collection not found" });
    }
  } catch (err) {
    res.status(500).json({ msg: "error fetching collection", err });
  }
}

export async function postCollection(req: Request, res: Response) {
  try {
    const { user, name, artworks } = req.body;

    if (!user || !name || !Array.isArray(artworks)) {
      console.log("Validation failed:", { user, name, artworks });
      res.status(400).json({ msg: "Missing or invalid fields" });
      return; // void return due to documented issue with types and express
    }

    if (
      artworks &&
      artworks.some((artwork: any) => !artwork.artworkId || !artwork.source)
    ) {
      res
        .status(400)
        .json({ msg: "Each artwork must have an 'artworkId' and 'source'." });
      return;
    }

    const newCollection = { ...req.body, collectionId: `${randomUUID()}` };

    await addCollection(newCollection);

    res.status(201).json(newCollection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "error adding collection", err });
  }
}

export async function postArtwork(req: Request, res: Response) {
  try {
    const { collectionId } = req.params;
    const {
      artwork,
      artwork: { artworkId, source },
    } = req.body;

    if (!collectionId || !artworkId || !source) {
      res.status(400).json({ msg: "Missing or invalid fields" });
      return;
    }
    const updatedCollection = await addArtwork(collectionId, artwork);

    if (!updatedCollection) {
      res.status(400).json({ msg: "Collection not found" });
      return;
    }

    if (updatedCollection === "duplicate") {
      res.status(400).json({ msg: "Duplicate artwork found in collection" });
      return;
    }
    res.status(201).json(updatedCollection);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error: unable to add artwork", err });
  }
}

export async function deleteArtwork(req: Request, res: Response) {
  try {
    const { collectionId, artworkId } = req.params;

    if (!collectionId || !artworkId) {
      res.status(400).json({ msg: "Missing or invalid fields" });
      return;
    }
    const updatedCollection = await removeArtwork(collectionId, artworkId);

    if (updatedCollection === null) {
      res.status(400).json({ msg: "Collection not found" });
      return;
    }

    if ("errorCode" in updatedCollection) {
      res.status(400).json({ msg: updatedCollection.msg });
      return;
    }

    res.status(200).json(updatedCollection);
  } catch (err) {
    console.error("Error deleting artwork:", err);
    res
      .status(500)
      .json({ msg: "Server error: unable to remove artwork", err });
  }
}
