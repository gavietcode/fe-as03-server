import jwt from "jsonwebtoken";

export const createJWT = (_id, email, role) => {
  return jwt.sign({ _id, email, role }, process.env.JWT, { expiresIn: "100d" });
};

export const verifyJWT = (token) => {
  return new Promise((resolve, reject) => {
    try {
      const decoded = jwt.verify(token, process.env.JWT);
      resolve(decoded);
    } catch (err) {
      reject(err);
    }
  });
};
