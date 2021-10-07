import jwt from 'jsonwebtoken';


export const tokenauth = async(req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    jwt.verify(token, 'secret',(err, decoded) => {
        if(err) return next(new Error(err));
    });
    return next();
    
  } catch (error){
    res.status(401).json({
      error: error.message
    });
  }
};