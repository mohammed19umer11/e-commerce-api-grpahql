import mongoose from 'mongoose';

const connectMongo = async() => {
    try {
        const MONGODB_URL = ``
        mongoose.connect(MONGODB_URL,{useNewUrlParser:true,useUnifiedTopology:true})
        .then(()=> {console.log(`CONNECTED TO DATABASE`)})
        .catch((error) => console.log(error.message));
    } catch (error) {
        console.log(error);
    }
};

export const connection = async(req, res, next) => {
    try {
        await connectMongo();
        console.log("DB Middleware");
        return next();
          
    } catch (error){
      res.status(401).json({
        error: error.message
      });
    }
};