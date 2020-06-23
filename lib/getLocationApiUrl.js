const fetch = require('node-fetch');

/**
 *
 * @param {Object} location
 * @param {String} location.office
 * @param {Number} location.gridX
 * @param {Number} location.gridY
 * @param {Number} location.lat
 * @param {Number} location.lon
 * @returns {Promise<String>}
 */
module.exports = async (
  {
    office = null,
    gridX = null,
    gridY = null,
    lat = null,
    lon = null,
  },
) => {
  let apiUrl;

  if (lat && lon) {
    const locationInformationResponse = await fetch(`https://api.weather.gov/points/${lat},${lon}`);
    const locationInformation = await locationInformationResponse.json();
    office = locationInformation.properties.gridId;
    gridX = locationInformation.properties.gridX;
    gridY = locationInformation.properties.gridY;
  }

  if (office && gridX && gridY) {
    apiUrl = `https://api.weather.gov/gridpoints/${office}/${gridX},${gridY}`;
  } else {
    throw new Error('Either office, gridX, and gridY or lat and lon are required to get the location.');
  }

  return apiUrl;
};
