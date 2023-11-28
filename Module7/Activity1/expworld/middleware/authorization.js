// require('dotenv').config();

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    console.log(req.headers);

    cookieParser(process.env.JWT_SECRET);
    const token = req.cookies.authToken;

    if (!token) {
        res.status(401).json({ error: true, message: 'Authorisation cookie missing' });
        return;
    }

    // if (!("authorization" in req.headers)
    //     || !req.headers.authorization.match(/^Bearer /)
    // ) {
    //     res.status(401).json({ error: true, message: "Authorization header ('Bearer token') not found" });
    //     return;
    // }

    // const token = req.headers.authorization.replace(/^Bearer /, '');

    // const token = req.headers.authorization.replace(/^Bearer /, "");
    try {
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedToken;
    } catch (e) {
        if (e.name === "TokenExpiredError") {
            res.status(401).json({ error: true, message: "JWT token has expired" });
        } else {
            res.status(401).json({ error: true, message: "Invalid JWT token" });
        }
        return;
    }

    next();
};




// module.exports = function (req, res, next) {
//     console.log(req.headers);

//     if (!("authorization" in req.headers)
//         || !req.headers.authorization.match(/^Bearer /)
//     ) {
//         res.status(401).json({ error: true, message: "Authorization header ('Bearer token') not found" });
//         return;
//     }

//     const token = req.headers.authorization.replace(/^Bearer /, '');

//      // Verify the JWT token using the secret key
// //   try {
// //     jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
// //       if (err) {
// //         if (err.name === 'TokenExpiredError') {
// //           return res.status(401).json({ error: true, message: 'JWT token has expired' });
// //         } else {
// //           return res.status(401).json({ error: true, message: 'Invalid JWT token' });
// //         }
// //       }

// //       // Attach the decoded token to the request object
// //       req.decodedToken = decodedToken;
// //       next();
// //     });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ error: true, message: 'Internal server error' });
// //   }
// // };

//     // const token = req.headers.authorization.replace(/^Bearer /, "");
//     try {
//         jwt.verify(token, process.env.JWT_SECRET);
//     } catch (e) {
//         if (e.name === "TokenExpiredError") {
//             res.status(401).json({ error: true, message: "JWT token has expired" });
//         } else {
//             res.status(401).json({ error: true, message: "Invalid JWT token" });
//         }
//         return;
//     }

//     next();
// };

// module.exports = function(req, res, next) {
//     if (!('authorization' in req.headers)
//         || !req.headers.authorization.match(/^Bearer /)
//     ) {
//         console.log('authorization failed');
//         res.status(401).json( { error: true, message: "Authorization header ('Bearer token') not found" });
//         return;
//     }
//     const token = req.headers.authorization.replace(/^Bearer /, "");
//     try {
//         console.log('token:'+token);
//         console.log('JWT_SECRET:'+process.env.JWT_SECRET);
//         jwt.verify(token, process.env.JWT_SECRET);
        
//     } catch (e) {
//         console.log('error:'+e.name);
//         if (e.name === "TokenExpiredError") {
//             res.status(401).json({ error: true, message: "JWT token has expired" });
//         } else {
//             res.status(401).json({ error: true, message: "Invalid JWT token" });
//         }
//         return;
//     }

//     // console.log(req.headers);
//     next();
// };
