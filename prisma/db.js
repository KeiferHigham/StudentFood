import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const GOOGLE_GEOCODING_API_KEY = 'AIzaSyAfKs5ibGFfCMME2OuZcHMI5mPIguY3tLs';

export const getDiscounts = async () => {
  return await prisma.discount.findMany();
};

export const getNearbyRestaurants = async () => {
  try {
    return await prisma.nearbyRestaurants.findMany();
  } catch (error) {
    console.error('Error fetching nearby restaurants:', error);
    throw new Error('Could not fetch nearby restaurantssss');
  }
};


const getCoordinates = async (address) => {
  const encodedAddress = encodeURIComponent(address);
  const apiUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${process.env.GOOGLE_PLACES_API_KEY}`;
  console.log(apiUrl);

  const response = await fetch(apiUrl);
  const data = await response.json();
  console.log(data);

  if (data.status === 'OK') {
    const location = data.results[0].geometry.location;
    return {
      valid: true,
      latitude: location.lat,
      longitude: location.lng,
      formattedAddress: data.results[0].formatted_address,
    };
  } else {
    return {
      valid: false,
      latitude: 0.0,
      longitude: 0.0,
      formattedAddress: address,
    };
  }
}

/**
 * Fetch all verified submissions from the database.
 */
export const getVerifiedSubmissions = async () => {
  try {
    return await prisma.submissions.findMany({
      where: {
        verified: true,
      },
    });
  } catch (error) {
    console.error('Error fetching verified submissions:', error);
    throw new Error('Could not fetch verified submissions');
  }
};



export const submitDiscount = async (restaurantName, restaurantAddress, discount, lat, lng) => {
    const coordinates =  await getCoordinates(restaurantAddress);
    console.log("coordinates are " + coordinates.latitude);
    formData.append("latitude", coordinates.latitude);
    formData.append("longitude",coordinates.longitude);
    const latitude = parseFloat(coordinates.latitude);
    const longitude = parseFloat(coordinates.longitude);

  console.log("latitude is " + latitude);
  console.log("longitudeeee is " + longitude);
  
  const existingSubmission = await prisma.submissions.findFirst({
    where: {
      restaurantName: restaurantName,
      restaurantAddress: restaurantAddress,
      discount: discount,
    },
  });

  if (existingSubmission) {
    return {
      status: 'error',
      message: 'Unable to submit. This discount already exists.',
    };
  }
  const newSubmission = await prisma.submissions.create({
    data: {
      restaurantName,
      restaurantAddress,
      discount,
      latitude,
      longitude,
      verified: false,
    },
  });

  return {
    status: 'success',
    message: 'Restaurant submitted successfully.',
    newSubmission,
  };
};






