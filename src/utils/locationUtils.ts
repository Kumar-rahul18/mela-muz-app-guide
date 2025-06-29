
// Haversine formula to calculate distance between two coordinates
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  console.log(`Calculating distance between (${lat1}, ${lon1}) and (${lat2}, ${lon2})`);
  
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  const roundedDistance = Math.round(distance * 100) / 100; // Round to 2 decimal places
  console.log(`Calculated distance: ${roundedDistance}km`);
  return roundedDistance;
};

const toRadians = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

export const formatDistance = (distance: number): string => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)}m`;
  }
  return `${distance}km`;
};

export const getCurrentLocation = (): Promise<{ latitude: number; longitude: number }> => {
  return new Promise((resolve, reject) => {
    console.log('getCurrentLocation called');
    
    if (!navigator.geolocation) {
      console.error('Geolocation is not supported by this browser.');
      reject(new Error('Geolocation is not supported by this browser.'));
      return;
    }

    console.log('Requesting geolocation...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log('Geolocation success:', position.coords);
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout
        maximumAge: 60000, // 1 minute cache
      }
    );
  });
};
