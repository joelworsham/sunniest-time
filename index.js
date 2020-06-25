const getLocationApiUrl = require('./lib/getLocationApiUrl');
const getSunniestTimes = require('./lib/getSunniestTimes');

(async () => {
  const apiUrl = await getLocationApiUrl({ lat: 39.765977, lon: -86.060360 });
  const sunniestTimes = await getSunniestTimes(apiUrl, { minHour: 12, maxHour: 17 });

  console.log(sunniestTimes);
  process.exit()
})();
