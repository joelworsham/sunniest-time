const getLocationApiUrl = require('./lib/getLocationApiUrl');
const getSunniestTimes = require('./lib/getSunniestTimes');

(async () => {
  const apiUrl = await getLocationApiUrl({ lat: 39.765940, lon: -86.060310 });
  const sunniestTimes = await getSunniestTimes(apiUrl, { minHour: 10, maxHour: 17 });

  console.log(sunniestTimes);
})();
