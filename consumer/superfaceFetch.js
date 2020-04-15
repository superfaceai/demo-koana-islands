import { Consumer } from "superdriver";

/**
 * Fetch weather alerts for given locality
 *
 * @param {Object} service DISCO service object
 * @param {String} addressLocality Locality to fetch the data for
 * @param {String} profileId Id of the service profile
 * @returns {Promise}
 */
export default async function fetchAlertsForAddressLocality(
  service,
  addressLocality,
  profileId,
  detail
) {
  if (!service || !addressLocality) throw "missing input parameters";


  const client = new Consumer({
    url: service.serviceUrl,
    mappingUrl: service.mappingUrl,
    profileId
  });

  return client.perform({
    operation: "RetrieveAlert",
    parameters: {
      addressLocality
    },
    response: [
      "ActualWeatherAlert/title",
      "ActualWeatherAlert/description",
      "ActualWeatherAlert/severity",
      "ActualWeatherAlert/startDate",
      "ActualWeatherAlert/endDate"
    ]
  }, detail);
}
