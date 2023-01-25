import mongoose from "mongoose";

export default async () => {
  const { mongodbUri } = useRuntimeConfig();

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(mongodbUri)
    console.log('Connected to MongoDB!')
  } catch (e) {
    console.error(e);
  }
}