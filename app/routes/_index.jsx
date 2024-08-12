import { useLoaderData, useActionData, Form } from '@remix-run/react'; // Updated import path
import { PrismaClient } from '@prisma/client';
import { json } from '@remix-run/node'; // Updated import for JSON responses
import { getDiscounts, submitDiscount } from '../../prisma/db';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import {useEffect, useState} from 'react';
import 'react-toastify/dist/ReactToastify.css';
import '../tailwind.css'
import Modal from '../restaurantsubmissionmodal'




export const action = async ({ request }) => {
  const formData = await request.formData();
  const restaurantName = formData.get('restaurantName');

  
  if (!restaurantName) {
    return json({ status: 'error', message: 'Restaurant name is required.' }, { status: 400 });
  }

  if (restaurantName.length > 40) {
    return json({ status: 'error', message: 'Restaurant name must be 40 characters or less.' }, { status: 400 });
  }
  const response = await submitDiscount(restaurantName);

  return json(response, { status: response.status === 'ok' ? 200 : 500 });
};

export default function Index() {
  
  const actionData = useActionData();

  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const dummyData = [
    { id: 101, restaurantName: "Burger Palace", restaurantAddress: "123 Main St", discount: "10% off" },
    { id: 102, restaurantName: "Pizza Planet", restaurantAddress: "456 Elm St", discount: "Buy 1 Get 1 Free" },
    { id: 103, restaurantName: "Taco Town", restaurantAddress: "789 Oak St", discount: "15% off" },
    { id: 104, restaurantName: "Sushi World", restaurantAddress: "321 Maple Ave", discount: "Free Drink" },
    { id: 105, restaurantName: "Pasta House", restaurantAddress: "654 Pine St", discount: "20% off" },
    { id: 106, restaurantName: "Steakhouse", restaurantAddress: "987 Birch St", discount: "25% off" },
    { id: 107, restaurantName: "Cafe Delight", restaurantAddress: "111 Cedar Rd", discount: "10% off" },
    { id: 108, restaurantName: "BBQ Barn", restaurantAddress: "222 Spruce Ln", discount: "Free Side" },
    { id: 109, restaurantName: "Noodle Hub", restaurantAddress: "333 Walnut St", discount: "15% off" },
    { id: 110, restaurantName: "Sandwich Stop", restaurantAddress: "444 Chestnut St", discount: "Buy 2 Get 1 Free" },
    { id: 111, restaurantName: "Grill Master", restaurantAddress: "555 Oak Ln", discount: "10% off" },
    { id: 112, restaurantName: "Bistro Bliss", restaurantAddress: "666 Palm St", discount: "Free Dessert" },
    { id: 113, restaurantName: "Salad Station", restaurantAddress: "777 Cypress Ave", discount: "15% off" },
    { id: 114, restaurantName: "Juice Joint", restaurantAddress: "888 Redwood St", discount: "10% off" },
    { id: 115, restaurantName: "Smoothie Spot", restaurantAddress: "999 Magnolia St", discount: "Buy 1 Get 1 50% off" },
    { id: 116, restaurantName: "Taco Town", restaurantAddress: "789 Oak St", discount: "15% off" },
    { id: 117, restaurantName: "Sushi World", restaurantAddress: "321 Maple Ave", discount: "Free Drink" },
    { id: 118, restaurantName: "Pasta House", restaurantAddress: "654 Pine St", discount: "20% off" },
    { id: 119, restaurantName: "Steakhouse", restaurantAddress: "987 Birch St", discount: "25% off" },
    { id: 120, restaurantName: "Cafe Delight", restaurantAddress: "111 Cedar Rd", discount: "10% off" },
    { id: 121, restaurantName: "BBQ Barn", restaurantAddress: "222 Spruce Ln", discount: "Free Side" },
    { id: 122, restaurantName: "Noodle Hub", restaurantAddress: "333 Walnut St", discount: "15% off" },
    { id: 123, restaurantName: "Sandwich Stop", restaurantAddress: "444 Chestnut St", discount: "Buy 2 Get 1 Free" },
    { id: 124, restaurantName: "Grill Master", restaurantAddress: "555 Oak Ln", discount: "10% off" },
    { id: 125, restaurantName: "Bistro Bliss", restaurantAddress: "666 Palm St", discount: "Free Dessert" },
    { id: 126, restaurantName: "Salad Station", restaurantAddress: "777 Cypress Ave", discount: "15% off" },
    { id: 127, restaurantName: "Juice Joint", restaurantAddress: "888 Redwood St", discount: "10% off" },
    { id: 128, restaurantName: "Smoothie Spot", restaurantAddress: "999 Magnolia St", discount: "Buy 1 Get 1 50% off" },
    { id: 129, restaurantName: "Burger Palace", restaurantAddress: "123 Main St", discount: "10% off" },
    { id: 130, restaurantName: "Pizza Planet", restaurantAddress: "456 Elm St", discount: "Buy 1 Get 1 Free" },
  ];

  

  useEffect(() => {
    if (actionData) {
      console.log(actionData); // This will only run when actionData changes
      if (actionData.id > 0) {
        toast('🍔 Your restaurant has been submitted! It will appear in the list below after verification.', {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          });
      } else {
        toast.error("Server Error: Unable to Submit Restaurant");
      }
    }
  }, [actionData]); // This effect runs only when actionData changes
    
    

  return (
    <div>
      
<ToastContainer />

<div className="container mx-auto">
<h1 className="mt-8 mb-4 text-4xl font-extrabold tracking-tight leading-none text-center text-white md:text-4xl lg:text-4xl bg-black">
    Restaurants in Provo/Orem Offering Discounts to BYU/UVU Students
    </h1>

  <p className="submission-instruction">
      If you're aware of any restaurants in the area that give discounts to students not currently listed below,
        please click please <a  className="text-blue-500 underline hover:text-blue-700" onClick={handleOpenModal}>click here</a>.
      </p>
  <div className="w-full flex justify-center">
    <table className="text-left w-full max-w-5xl">
      <thead className="bg-black flex text-white w-full">
        <tr className="flex w-full">
          <th className="p-4 flex-1 text-center font-extrabold">Restaurant Name</th>
          <th className="p-4 flex-1 text-center font-extrabold">Restaurant Address</th>
          <th className="p-4 flex-1 text-center font-extrabold">Discount</th>
        </tr>
      </thead>
      <tbody className="bg-grey-light flex flex-col items-center justify-between overflow-y-scroll w-full" style={{ height: '70vh' }}>
        {dummyData.map((discount) => (
          <tr key={discount.id} className="flex w-full bg-blue-100">
            <td className="p-4 flex-1 text-center">{discount.restaurantName}</td>
            <td className="p-4 flex-1 text-center">{discount.restaurantAddress}</td>
            <td className="p-4 flex-1 text-center">{discount.discount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>
<Modal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}
