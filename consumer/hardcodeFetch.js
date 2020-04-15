import {
  AlertTitleKey,
  AlertDescriptionKey,
  AlertSeverityKey
} from "../consumer/representor";

/**
 * Fetch the alerts from one, hard-coded service
 *
 * @param {string} addressLocality Locality to fetch the data for
 * @returns {Promise}
 */
export default async function hardcodeFetchAlertsForAddressLocality(
  addressLocality
) {
  if (!addressLocality) throw "missing input parameters";

  // Hardcode URL, HTTP method, query parameters, HTTP headers...
  const response = await fetch(
    `https://ballistic-sombrero.glitch.me/alerts?addressLocality=${addressLocality}`,
    // `https://ballistic-sombrero.glitch.me/alerts?place=${addressLocality}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json"
      }
    }
  );

  // Check if response is valid
  if (!response.ok) {
    const body = await response.json();
    return Promise.reject({
      result: "failed",
      status: response.status,
      detail: body
    });
  }

  // Verify the response media type
  const contentType = response.headers.get("content-type");
  if (!contentType || !contentType.startsWith("application/json")) {
    return Promise.reject({
      result: "failed",
      status: response.status,
      detail: { title: "Unsupported media type" }
    });
  }

  // Hardcode response representation into internal data structure
  const body = await response.json();
  console.log("hard fetched response: ", body);
  let harmonizedResponseData = {};
  harmonizedResponseData[AlertTitleKey] = body.title;
  harmonizedResponseData[AlertDescriptionKey] = body.description;
  harmonizedResponseData[AlertSeverityKey] = body.severity;

  // Return result
  return harmonizedResponseData;
}
