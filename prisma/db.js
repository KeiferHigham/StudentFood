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
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  console.log("latitude is " + latitude);
  console.log("longitude is " + longitude);
  
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






