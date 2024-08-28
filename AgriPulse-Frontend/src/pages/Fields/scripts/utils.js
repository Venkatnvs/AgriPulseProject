import { polygon, area } from '@turf/turf';

const calculateArea = latLngs => {
  const coordinates = latLngs.map(latLng => [latLng.lng, latLng.lat]);

  if (
    coordinates[0][0] !== coordinates[coordinates.length - 1][0] ||
    coordinates[0][1] !== coordinates[coordinates.length - 1][1]
  ) {
    coordinates.push(coordinates[0]); // Close the polygon
  }

  const turfPolygon = polygon([coordinates]);

  // Calculate area in square meters
  const turfArea = area(turfPolygon);

  return turfArea.toFixed(4);
};

const MetersAreaToAcres = meters => {
  let area = meters * 0.000247105;
  return area.toFixed(4);
};

export { calculateArea, MetersAreaToAcres };
