import mongoose from "mongoose";

const MONGO_URI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_COLLECTION}.hri12ns.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const connectMongo = async () => mongoose.connect(MONGO_URI);

export default connectMongo;
