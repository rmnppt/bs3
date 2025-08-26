# The Cloud Functions for Firebase SDK to create Cloud Functions and set up triggers.
from firebase_functions import https_fn
from firebase_admin import initialize_app, firestore
import google.cloud.firestore
from api import Perplexity

app = initialize_app()


@https_fn.on_request()
def addiheadlines(req: https_fn.Request) -> https_fn.Response:
    """
    Retrieve the latest headlines from Perplexity and add them to the posts collection.
    Due to limitations on firebase functions for python this is a http function which needs to be triggered on a schedule.
    """
    perplexity_client = Perplexity()
    headlines = perplexity_client.get_headlines()

    firestore_client: google.cloud.firestore.Client = firestore.client()

    # Push the new message into Cloud Firestore using the Firebase Admin SDK.
    added = []
    for headline in headlines:
        _, doc_ref = firestore_client.collection("posts").add(headline)
        added.append(doc_ref.id)

    # Send back a message that we've successfully written the message
    return https_fn.Response(f"Messages with IDs {added} added.")
