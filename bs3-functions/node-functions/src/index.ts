import * as dotenv from "dotenv";

if (process.env.FUNCTIONS_EMULATOR) {
  dotenv.config({ path: ".env.local" });
}

/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { Perplexity, Headlines } from "./api";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { logger } from "firebase-functions";
export { archiveExpiredPosts } from "./archiveExpiredPosts";

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
functions.setGlobalOptions({ maxInstances: 10 });
if (!admin.apps.length) admin.initializeApp();
const firestore = admin.firestore();

// Schedule to run every Sunday at midnight UTC
export const addHeadlinesWeekly = onSchedule("0 0 * * 0", async (event) => {
  console.log("Scheduled function triggered at", event.scheduleTime);
  try {
    const perplexityClient = new Perplexity();
    const headlines: Headlines = await perplexityClient.getHeadlines();

    const addedIds: string[] = [];

    for (const headline of headlines.headlines) {
      const docRef = await firestore.collection("posts").add(headline);
      addedIds.push(docRef.id);
    }

    logger.info(`Messages with IDs ${addedIds.join(", ")} added.`);
  } catch (error) {
    logger.error("Error adding headlines:", error);
  }

  return;
});
