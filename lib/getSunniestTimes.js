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
      console.log(item.validTime)
      // console.log(new Date('2020-06-30T12:00:00+00:00/PT1H'))
      // JS cannot handle timezone duration offsets, so we must parse it and set it manually
      const [, UTCOffset] = item.validTime.match(/\/PT(\d)H$/);
      const timeZoneAmbiguousDate = new Date(item.validTime.replace(/\/\w+$/, ''));

      return {
        value: item.value,
        // subtract known UTC offset from generated date
        dateTime: new Date(timeZoneAmbiguousDate.getTime() - UTCOffset * 1000 * 60)
      };
    })
    .filter(({ dateTime }) => (
      dateTime.getTime() > minTime.getTime()
      && dateTime.getTime() < maxTime.getTime()
    ))
    // Only return 5 most recent
    .slice(0, 5)
    // Normalize response
    .map(({ value, dateTime }) => ({
      coverage: value,
      hour: dateTime.getHours()
    }));
};
