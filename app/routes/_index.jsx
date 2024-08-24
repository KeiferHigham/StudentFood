import { useLoaderData, useActionData, Form } from '@remix-run/react';
import { PrismaClient } from '@prisma/client';
import { json } from '@remix-run/node';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useEffect, useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../tailwind.css';
import Modal from '../restaurantsubmissionmodal';
import { submitDiscount } from '../../prisma/db';

const prisma = new PrismaClient();

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = degreesToRadians(lat2 - lat1);
  const dLon = degreesToRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degreesToRadians(lat1)) * Math.cos(degreesToRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function getUserLocationAndUpdateRestaurants(submissions) {
  if (typeof navigator !== 'undefined' && navigator.geolocation) {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatitude = position.coords.latitude;
          const userLongitude = position.coords.longitude;
          const updatedRestaurants = submissions.map((restaurant) => {
            const distance = calculateDistance(
              userLatitude,
              userLongitude,
              restaurant.latitude,
              restaurant.longitude
            );
            return { ...restaurant, distanceFromUser: distance.toFixed(2) };
          });
          resolve(updatedRestaurants);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            console.log("User denied the request for Geolocation.");
          } else {
            console.error("Error getting location:", error);
          }
          resolve(submissions);
        }
      );
    });
  }
  return Promise.resolve(submissions);
}

export const loader = async () => {
  const nearbyRestaurants = await prisma.nearbyRestaurants.findMany();
  const submissions = await prisma.submissions.findMany({
    where: {
      verified: true,
    },
  });

  return json({ nearbyRestaurants, submissions });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const restaurantName = formData.get('restaurantName');
  const restaurantAddress = formData.get('restaurantAddress');
  const discount = formData.get("discount");
  const latitude = formData.get("latitude");
  const longitude = formData.get("longitude");
  
  const response = await submitDiscount(restaurantName, restaurantAddress, discount, latitude,longitude);

  return json(response, { status: response.status === 'ok' ? 200 : 500 });
};

export default function Index() {
  const actionData = useActionData();
  useEffect(() => {
    if (actionData) {
      console.log(actionData.status);
      if (actionData.status === 'success') {
        toast.success('🍔 Your restaurant has been submitted! It will appear in the list below after verification.', {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else if (actionData.status === 'error') {
        toast.error(actionData.message || 'Error submitting restaurant.', {
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    }
  }, [actionData]);
  const { nearbyRestaurants, submissions } = useLoaderData();
  const [isModalOpen, setModalOpen] = useState(false);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [submissionsWithDistance, setSubmissionsWithDistance] = useState([]);
  const [isDistanceAvailable, setIsDistanceAvailable] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState("closest"); 

  const handleSortChange = (event) => {
    const option = event.target.value;
    setSortOption(option);
  };

  useEffect(() => {
    getUserLocationAndUpdateRestaurants(submissions).then((updatedRestaurants) => {
      if (updatedRestaurants.some((restaurant) => restaurant.distanceFromUser)) { 
        const sortedByDistance = updatedRestaurants.sort((a, b) => parseFloat(a.distanceFromUser) - parseFloat(b.distanceFromUser));
        setSubmissionsWithDistance(sortedByDistance);
        setFilteredRestaurants(sortedByDistance);
        setIsDistanceAvailable(true);
      } else {
        const sortedByNewest = updatedRestaurants.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setFilteredRestaurants(sortedByNewest);
        setIsDistanceAvailable(false);
      }
    });
  }, [submissions]);

  

  useEffect(() => {
    if (sortOption === "closest") {
      setFilteredRestaurants((prev) =>
        [...prev].sort((a, b) => parseFloat(a.distanceFromUser) - parseFloat(b.distanceFromUser))
      );
    } else if (sortOption === "newest") {
      setFilteredRestaurants((prev) =>
        [...prev].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      );
    }
  }, [sortOption]);

  useEffect(() => {
    if(searchTerm === '') {
      setFilteredRestaurants(submissionsWithDistance);
    }
    else if (searchTerm) {
      const filtered = submissionsWithDistance.filter((restaurant) =>
        restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.restaurantAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        restaurant.discount.toLowerCase().includes(searchTerm.toLowerCase()) || searchTerm === ''
      );
      const sortedByDistance = filtered.sort((a, b) => parseFloat(a.distanceFromUser) - parseFloat(b.distanceFromUser));
      setFilteredRestaurants(sortedByDistance);
    }
  }, [searchTerm]);
  

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <div>
      <ToastContainer />
      <div className="bg-gray-800 text-white">
        <h1 className="mt-8 mb-4 text-4xl font-extrabold tracking-tight leading-none text-center text-white md:text-4xl lg:text-4xl">
          Restaurants in Provo/Orem Offering Discounts to BYU/UVU Students
        </h1>
        <p className="submission-instruction text-center font-extrabold mb-4">
          If you're aware of any restaurants in the area that give discounts to students not currently listed below,
          please <a className="text-blue-500 underline hover:text-blue-700" onClick={handleOpenModal}>click here</a>.
        </p>
        <div className="mb-4 flex justify-center">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
            className="border-2 p-2 w-full max-w-lg text-black"
          />
        </div>
        <div className="w-full flex justify-center">
          <table className="text-left w-full max-w-5xl rounded-lg overflow-hidden">
            <thead className="bg-black text-white">
              <tr>
                <th className="p-4 text-center font-extrabold">Restaurant Name</th>
                <th className="p-4 text-center font-extrabold">Restaurant Address</th>
                <th className="p-4 text-center font-extrabold">Discount</th>
                <th className="p-4 text-center font-extrabold">
                  Sort By:
                  <select
                  className="ml-2 text-black"
                  value={sortOption}
                   onChange={handleSortChange}
                  >
                  {isDistanceAvailable && (
                  <option value="closest">Closest To Me</option>
                    )}
                <option value="newest">New Additions</option>
                  </select>
                </th>
              </tr>
            </thead>
            <tbody className="bg-grey-light w-full">
              {filteredRestaurants.map((restaurant) => (
                <tr key={restaurant.id} className="bg-gray-500">
                  <td className="p-4 text-center">{restaurant.restaurantName}</td>
                  <td className="p-4 text-center">{restaurant.restaurantAddress}</td>
                  <td className="p-4 text-center">{restaurant.discount}</td>
                  {isDistanceAvailable && (
                    <td className="p-4 text-center">{restaurant.distanceFromUser} miles away</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={handleCloseModal} nearbyRestaurants={nearbyRestaurants} submissions={submissions} />
    </div>
  );
}
