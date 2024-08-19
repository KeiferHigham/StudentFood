import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDiscounts = async () => {
  return await prisma.discount.findMany();
};

export const submitDiscount = async (restaurantName, restaurantAddress, discount) => {
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
      verified: false,
    },
  });

  return {
    status: 'success',
    message: 'Restaurant submitted successfully.',
    newSubmission,
  };
};

