// Importation de bcryptjs, une bibliothèque pour le hachage de mots de passe
const bcrypt = require('bcryptjs');

// Fonction asynchrone pour hacher un mot de passe
const hashPassword = async (password) => {
  // Génération d'un "salt" (chaîne aléatoire) pour renforcer le hachage
  const salt = await bcrypt.genSalt(10);

  // Hachage du mot de passe avec le salt généré
  return bcrypt.hash(password, salt);
};

// Exportation de la fonction hashPassword pour utilisation dans d'autres parties de l'application
module.exports = {
  hashPassword,
};
