import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const GOOGLE_PLACES_API_KEY = 'AIzaSyCadEijvqVc7ZCAAMAx4QCGndlrVm4oKfM';
const location = '40.2338,-111.6585'; // Coordinates for Provo, Utah
const radius = 24140; // 15 miles in meters (15 miles)
const maxRequests = 100;

const types = [
  'restaurant', 
  'cafe', 
  'bakery', 
  'food', 
  'meal_takeaway', 
  'meal_delivery', 
  'steakhouse', 
  'bar', 
  'night_club', 
  'food_court', 
  'diner', 
  'pub', 
  'fast_food', 
  'buffet', 
  'ice_cream', 
  'food_truck', 
  'pizza', 
  'vegetarian_or_vegan', 
  'fine_dining', 
  'gastropub'
];

async function updateRestaurants() {
  let allRestaurants = [];
  let requestCount = 0;

  for (const type of types) {
    let apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;

    while (apiUrl && requestCount < maxRequests) {
      console.log(`Request #${requestCount + 1} to API with type: ${type}`);
      
      const response = await fetch(apiUrl);
      const data = await response.json();

      if (!data.results) {
        console.error('Failed to fetch restaurants');
        break;
      }

      allRestaurants = allRestaurants.concat(data.results.map((place) => ({
        restaurantName: place.name,
        restaurantAddress: place.vicinity,
      })));
      console.log(data.results);

      requestCount += 1;

      if (data.next_page_token) {
        console.log('Next page token found, preparing for next request');
        await new Promise((resolve) => setTimeout(resolve, 3000)); // 3-second delay

        apiUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?pagetoken=${data.next_page_token}&key=${GOOGLE_PLACES_API_KEY}`;
      } else {
        console.log('No next page token, stopping requests for this type');
        apiUrl = null;
      }

      if (requestCount >= maxRequests) {
        console.warn('Max request limit reached');
        break;
      }
    }

    if (requestCount >= maxRequests) {
      break;
    }
  }

  // Clear existing data in the database
  await prisma.NearbyRestaurants.deleteMany({});

  // Insert new data into the database
  await prisma.NearbyRestaurants.createMany({
    data: allRestaurants
  });

  console.log(`Total number of restaurants found and saved: ${allRestaurants.length}`);
}

updateRestaurants()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
