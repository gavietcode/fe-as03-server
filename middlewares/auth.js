import { verifyJWT } from "../utils/jsonwebtoken.js";

export const currentUser = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error();
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error();
    }

    const decoded = await verifyJWT(token);

    if (!decoded) {
      throw new Error();
    }
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid token!." });
    console.log(err);
  }
};

export const veryfyAdmin = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      throw new Error();
    }
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      throw new Error();
    }
    const decoded = await verifyJWT(token);
    if (!decoded) {
      throw new Error();
    }

    if (decoded.role !== "admin") {
      res.status(4003).json({ message: "Acces Denied!." });
    }

    req.user = decoded;
    next();
  } catch (err) {
    res.status(4001).json({ message: "Invalid token!." });
  }
};
