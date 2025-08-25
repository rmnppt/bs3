import os
from typing import List
from pydantic import BaseModel, HttpUrl
import requests
from datetime import datetime


class Headline(BaseModel):
    title: str
    summary: str
    publisher: str
    url: HttpUrl
    last_updated: datetime


class Headlines(BaseModel):
    headlines: List[Headline]


### TODO: make the system prompt more specific and sophisticated
SYSTEM_PROMPT = f"""
    Describe the main headlines gathered from online news in the Bristol South, UK area.
    Give 5 headlines numbered 1-5 and ensure that each one is supported with one the of the returned urls.

    For each headline record a title, a short summary paragraph, a url linking to the orginal source, 
    the name of the original publisher and a date at which the article was last updated.

    The output should be json structured as follows:
    The output should be a json array of objects.
    Each of the headlines should be returned as a with the fields; 
    
    {Headline.model_json_schema()}
"""


class Perplexity:

    url = "https://api.perplexity.ai/chat/completions"

    @property
    def headers(self):

        api_key = os.environ.get("PERPLEXITY_SONAR_API_KEY", None)
        if api_key is None:
            raise ValueError("PERPLEXITY_SONAR_API_KEY environment variable not set.")

        headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        }

        return headers

    def get_headlines(self) -> dict:

        payload = {
            "model": "sonar",
            "messages": [
                {
                    "role": "user",
                    "content": SYSTEM_PROMPT,
                }
            ],
            "enable_search_classifier": True,
            "web_search_options": {
                "user_location": {"country": "GB", "city": "Bristol"}
            },
            "response_format": {
                "type": "json_schema",
                "json_schema": {"schema": Headlines.model_json_schema()},
            },
        }

        response = requests.post(self.url, headers=self.headers, json=payload)

        if not response.ok:
            raise requests.HTTPError(
                f"Error in fetching response from Sonar API: {response.content}"
            )

        data = response.json()["choices"][0]["message"]["content"]
        Headlines.model_validate_json(data)

        return data


if __name__ == "__main__":
    client = Perplexity()
    response = client.get_headlines()
    print(response)
