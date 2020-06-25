const fetch = require('node-fetch');

/**
 *
 * @param {String} apiUrl
 * @param {Object} times
 * @param {Number} times.minHour
 * @param {Number} times.maxHour
 * @returns {Promise<Array>}
 */
module.exports = async (
  apiUrl,
  {
    minHour = 0,
    maxHour = 23,
  } = {}
) => {
  // Setup min/max datetimes
  const minTime = new Date();
  const maxTime = new Date();
  minTime.setHours(minHour, 0, 0, 0);
  maxTime.setHours(maxHour, 59, 59, 999);

  const response = await fetch(apiUrl);
  const body = await response.json();
  const skyCover = body.properties.skyCover.values;

  // Sort for least cloud cover first
  skyCover.sort((a, b) => a.value - b.value);

  // Filter out times outside our min/max range and get sunniest times
  return skyCover
    .map((item) => {
      const dateTime = new Date(item.validTime.replace(/\/PT\dH$/, ''));
      return {
        value: item.value,
        dateTime,
      };
    })
    .filter(({ dateTime }) => (
      dateTime.getTime() >= minTime.getTime()
      && dateTime.getTime() <= maxTime.getTime()
    ))
    // Only return 5 most recent
    .slice(0, 5)
    // Normalize response
    .map(({ value, dateTime }) => ({
      coverage: value,
      hour: dateTime.getHours()
    }));
};
