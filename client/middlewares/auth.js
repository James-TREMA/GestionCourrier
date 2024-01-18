const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  console.log("En-tête Authorization:", req.headers['authorization']);

  const token = req.headers['authorization'] ? req.headers['authorization'].split(" ")[1] : null;
  if (!token) {
    return res.status(403).json({ message: 'Aucun token fourni.' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token décodé:", decoded);
    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Erreur de validation du token:", error);
    return res.status(401).json({ message: 'Token non valide.', error: error.message });
  }
};


module.exports = verifyToken;
