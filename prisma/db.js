import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getDiscounts = async () => {
  return await prisma.discount.findMany();
};

export const submitDiscount = async (restaurantName) => {
  return await prisma.submission.create({
    data: {
      restaurantName,
    },
  });
};

