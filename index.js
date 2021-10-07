import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import Single from './utils/dataLoader.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { graphqlHTTP } = require('express-graphql');
import userSchema from './graphql/userSchema.js';

dotenv.config();

async function startServer() {
        const app = express();
        app.use(express.json({extended: true}));
        app.use(express.urlencoded({extended: true}));
        app.use(cors());

        app.use('/user',(req,res,next) => {
                console.log('==================\n GRAPHQL REQUEST STARTS  \n =====================');
                const loader =  {
                        single : new Single(),
                }
                req.loader = loader;
                return next()
        } ,graphqlHTTP((req,res,graphQLParams) => {
                
                return {
                        schema: userSchema,
                        graphiql: true,
                        context: {
                                loader:req.loader,
                        }
                }
        }));
        app.get('',(req,res)=>{
                res.send('Test');
        });

        const MONGODB_URL = process.env.MONGODB_URL;
        await mongoose
                .connect(MONGODB_URL,{useNewUrlParser:true,useUnifiedTopology:true,})
                .then(()=> {console.log(`CONNECTED TO DATABASE`)})
                .catch((error) => console.log(error.message));
        mongoose.set('debug',true);
        const PORT = process.env.PORT || 9000;


        app.listen(PORT, ()=>console.log(`Server running on port ${PORT}`)); 
}

startServer();