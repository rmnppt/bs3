import axios, { RawAxiosRequestHeaders } from "axios";
import Ajv, { JSONSchemaType } from "ajv";
import addFormats from "ajv-formats";

/**
 * Represents a single news headline.
 */
interface Headline {
  title: string;
  summary: string;
  publisher: string;
  url: string;
  last_updated: string;
}

/**
 * Represents a collection of news headlines.
 */
export interface Headlines {
  headlines: Headline[];
}

const SYSTEM_PROMPT = `
    Describe the main headlines gathered from online news websites in the Bristol South, UK area.
    Give 5 headlines numbered 1-5 and ensure that each one is supported with one the of the returned urls.

    For each headline record a title, a short summary paragraph, a url linking to the orginal source, 
    the name of the original publisher and a date at which the article was last updated.

    The output should be json structured as follows:
    The output should be a json object with a key named "headlines" which contains an array of objects.
    Each of the headlines should be returned as a with the fields;

    title: The title of the article
    summary: A short paragraph summary of the article
    publisher: The name of the wesbite or author of the content
    url: A valid url linking to the original source
    last_updated: The date when the article was last_updated
`;

const ajv = new Ajv();
addFormats(ajv);

// JSON schema for validation (matches the interfaces)
const headlinesSchema: JSONSchemaType<Headlines> = {
  type: "object",
  properties: {
    headlines: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          summary: { type: "string" },
          publisher: { type: "string" },
          url: { type: "string", format: "uri" },
          last_updated: { type: "string", format: "date-time" },
        },
        required: ["title", "summary", "publisher", "url", "last_updated"],
      },
    },
  },
  required: ["headlines"],
};

// Compile the schema validator
const validateHeadlines = ajv.compile(headlinesSchema);

/**
 * A client for interacting with the Perplexity AI API.
 */
export class Perplexity {
  private url = "https://api.perplexity.ai/chat/completions";

  /**
   * Constructs the headers for the API request, including the authorization token.
   * @throws Will throw an error if the PERPLEXITY_SONAR_API_KEY environment variable is not set.
   * @return {Object} The headers object for the API request.
   */
  private get headers(): RawAxiosRequestHeaders {
    const apiKey = process.env.PERPLEXITY_SONAR_API_KEY;
    if (!apiKey) {
      throw new Error("PERPLEXITY_SONAR_API_KEY environment variable not set.");
    }
    return {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Fetches and validates headlines from the Perplexity API.
   * @return {Promise<Headlines>} A promise that resolves to a Headlines object.
   */
  async getHeadlines(): Promise<Headlines> {
    const payload = {
      model: "sonar",
      messages: [
        {
          role: "user",
          content: SYSTEM_PROMPT,
        },
      ],
      // enable_search_classifier: true,
      web_search_options: {
        user_location: {
          country: "GB",
          region: "Birstol City",
          city: "Bristol",
          latitude: 51.26292,
          longitude: 2.36056,
        },
      },
      response_format: {
        type: "json_schema",
        json_schema: { schema: headlinesSchema },
      },
    };

    const response = await axios.post(this.url, JSON.stringify(payload), {
      headers: this.headers,
    });

    if (!response.status.toString().startsWith("2")) {
      throw new Error(
        `Error in fetching response from Sonar API: ${response.statusText}`,
      );
    }

    const data = response.data.choices[0].message.content;

    const jsonData = JSON.parse(data);

    // Validate structure
    const valid = validateHeadlines(jsonData);
    if (!valid) {
      throw new Error(
        `Validation failed: ${ajv.errorsText(validateHeadlines.errors)}`,
      );
    }

    return jsonData;
  }
}

// Example usage:
(async () => {
  const client = new Perplexity();
  try {
    const response = await client.getHeadlines();
    console.log(JSON.stringify(response, null, 2));
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      console.error(
        "API Error Response:",
        JSON.stringify(error.response.data, null, 2),
      );
    } else {
      console.error("An unexpected error occurred:", error);
    }
  }
})();
