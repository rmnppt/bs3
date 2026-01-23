import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { onSchedule } from "firebase-functions/v2/scheduler";

const firestore = admin.firestore();

type Expiry = "24h" | "3d" | "7d";
const EXPIRY_MS: Record<Expiry, number> = {
  "24h": 24 * 60 * 60 * 1000,
  "3d": 3 * 24 * 60 * 60 * 1000,
  "7d": 7 * 24 * 60 * 60 * 1000,
};

function expiresAt(timestamp: string, expiry?: Expiry): number {
  const msAdd = EXPIRY_MS[expiry || "7d"] ?? EXPIRY_MS["7d"];
  return new Date(timestamp).getTime() + msAdd;
}

export const archiveExpiredPosts = onSchedule("every 60 minutes", async () => {
  const now = Date.now();
  const postsRef = firestore.collection("posts");
  const archiveRef = firestore.collection("archived_posts");
  const snapshot = await postsRef.get();
  let archived = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const expiry: Expiry | undefined = data.expiryPeriod;
    const timestamp: string = data.timestamp;
    if (!timestamp) continue; // skip malformed docs
    const expiryTime = expiresAt(timestamp, expiry);
    if (now >= expiryTime) {
      // Copy then delete
      await archiveRef.doc(doc.id).set(data);
      await postsRef.doc(doc.id).delete();
      archived++;
    }
  }
  functions.logger.info(
    `Archived ${archived} posts at ${new Date().toISOString()}`,
  );
});
