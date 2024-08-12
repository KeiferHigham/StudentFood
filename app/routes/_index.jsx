import { useLoaderData, useActionData, Form } from '@remix-run/react'; // Updated import path
import { json } from '@remix-run/node'; // Updated import for JSON responses
import { getDiscounts, submitDiscount } from '../../prisma/db';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import {useEffect} from 'react';
import 'react-toastify/dist/ReactToastify.css';

export const loader = async () => {
  const discounts = await getDiscounts();
  return json({ discounts }); // Use json function to return data
};

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
  const { discounts } = useLoaderData();
  const actionData = useActionData();

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
      <h1>Restaurants in Provo/Orem Offering Discounts to BYU/UVU Students</h1>

      <p className="submission-instruction">
      If you're aware of any restaurants in the area that give discounts to students not currently listed below,
        please submit the name of that restaurant here:
      </p>

      <Form method="post" className="single-input-form">
        <input
          type="text"
          name="restaurantName"
          placeholder="Enter Restaurant Name"
          maxLength={40} // Set character limit
          required
          className="restaurant-name-input"
        />
        <button type="submit" className="submit-button">
          Submit
        </button>
      </Form>
      
<ToastContainer />

      <table>
        <thead>
          <tr>
            <th>Restaurant Name</th>
            <th>Restaurant Address</th>
            <th>Discount</th>
          </tr>
        </thead>
        <tbody>
          {discounts.map((discount) => (
            <tr key={discount.id}>
              <td>{discount.restaurantName}</td>
              <td>{discount.restaurantAddress}</td>
              <td>{discount.discount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
