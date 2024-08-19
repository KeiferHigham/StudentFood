import React, { useState, useEffect } from 'react';
import {
  useSubmit,
} from '@remix-run/react';

export default function Modal({ isOpen, onClose, nearbyRestaurants, submissions }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantAddress, setRestaurantAddress] = useState('');
  const [discount, setDiscount] = useState('');
  const [errors, setErrors] = useState({});
  const submitForm = useSubmit();

  useEffect(() => {
    if (searchTerm) {
      const matches = nearbyRestaurants
        .filter((restaurant) =>
          restaurant.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .slice(0, 10); // Limit to the first 10 matches
      setFilteredRestaurants(matches);
    } else {
      setFilteredRestaurants([]);
    }
  }, [searchTerm, nearbyRestaurants]);

  const handleSelect = (restaurant) => {
    setRestaurantName(restaurant.restaurantName);
    setRestaurantAddress(restaurant.restaurantAddress);
    setFilteredRestaurants([]); // Hide the dropdown after selection
  };

  const validateForm = () => {
    const newErrors = {};
    if (!restaurantName) newErrors.restaurantName = 'Restaurant Name is required';
    if (!restaurantAddress) newErrors.restaurantAddress = 'Restaurant Address is required';
    if (!discount) newErrors.discount = 'Discount is required';
    const duplicate = submissions.find(
      (submission) =>
        submission.restaurantName === restaurantName &&
        submission.restaurantAddress === restaurantAddress &&
        submission.discount === discount
    );

    if (duplicate) {
      newErrors.duplicate = 'Unable to submit. This restaurant already exists.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const formData = new FormData();
      formData.append("restaurantName", restaurantName);
      formData.append("restaurantAddress",restaurantAddress);
      formData.append("discount",discount);
      submitForm(formData, { method: "post" });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-gray-900 rounded-lg p-6 max-w-xl w-full">
        <h2 className="text-2xl font-semibold text-white mb-4">Submit a Restaurant</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white mb-2">Search</label>
            <input
              type="text"
              placeholder="Search by Restaurant Name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
            {filteredRestaurants.length > 0 && (
              <ul className="bg-white border border-gray-300 rounded mt-2 max-h-40 overflow-y-auto">
                {filteredRestaurants.map((restaurant) => (
                  <li
                    key={`${restaurant.restaurantName}-${restaurant.restaurantAddress}`}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelect(restaurant)}
                  >
                    <span className="font-bold text-black">{restaurant.restaurantName}</span>
                    <br />
                    <span className="text-sm text-black">{restaurant.restaurantAddress}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Restaurant Name</label>
            <input
              type="text"
              placeholder="Restaurant Name"
              value={restaurantName}
              onChange={(e) => setRestaurantName(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
            {errors.restaurantName && (
              <p className="text-red-500 text-sm mt-1">{errors.restaurantName}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Restaurant Address</label>
            <input
              type="text"
              placeholder="Restaurant Address"
              value={restaurantAddress}
              onChange={(e) => setRestaurantAddress(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
            {errors.restaurantAddress && (
              <p className="text-red-500 text-sm mt-1">{errors.restaurantAddress}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-white mb-2">Discount</label>
            <input
              type="text"
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              className="w-full p-2 rounded text-black"
            />
            {errors.discount && (
              <p className="text-red-500 text-sm mt-1">{errors.discount}</p>
            )}
          </div>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
