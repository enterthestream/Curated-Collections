import db from "./models/db";
import { randomUUID } from "crypto";

console.log("current collections:", db.data.collections);

async function testDb() {
  await db.read();

  const newCollection = {
    user: "test_user",
    collectionId: `${randomUUID()}`,
    name: "my first collection",
    artworks: [],
  };

  db.data.collections.push(newCollection);
  db.write();

  console.log("after adding collection:", db.data.collections);

  const foundCollection = db.data.collections.find(
    (c) => c.collectionId === newCollection.collectionId
  );

  console.log("retrieved collection:", foundCollection);
}

testDb();
