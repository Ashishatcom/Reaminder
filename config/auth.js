const jwt = require('jsonwebtoken');
module.exports = (req,res,next)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
       console.log(token)
   const decoded = jwt.verify(token,"Secrect");
   req.UserData = decoded
   next()
    }catch{
        return res.status(401).json({
            mesage:"Auth Failed"
        })
    }
}