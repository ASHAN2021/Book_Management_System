import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const generateToken = (user) => {
  const token = jwt.sign(
    { userId: user._id.toString() }, 
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
  console.log("Token generated:", token); 
  return token;
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const authMiddleware = (context) => {
  const authHeader = context.req.headers.authorization;
  if (!authHeader) throw new Error("Authorization header missing");

  const token = authHeader.split(" ")[1];
  if (!token) throw new Error("Token missing");

  const decoded = verifyToken(token);
  if (!decoded) throw new Error("Invalid token");

  return decoded;
};

export { generateToken, authMiddleware };
