// Importation de Mongoose, une bibliothèque ODM (Object Data Modeling) pour MongoDB
const mongoose = require('mongoose');

// Définition du schéma de l'utilisateur
const userSchema = new mongoose.Schema({
  // Nom de la firme, requis, unique, avec une longueur maximale de 25 caractères
  firm_name: { type: String, required: true, maxlength: 25, unique: true },

  // Prénom de l'utilisateur, requis, avec une longueur maximale de 25 caractères
  first_name: { type: String, required: true, maxlength: 25 },

  // Nom de famille de l'utilisateur, requis, avec une longueur maximale de 25 caractères
  last_name: { type: String, required: true, maxlength: 25 },

  // Email de l'utilisateur, requis, avec une longueur maximale de 50 caractères
  email: { type: String, required: true, maxlength: 50 },

  // Numéro de téléphone de l'utilisateur, requis, avec une longueur maximale de 25 caractères
  phone_number: { type: String, required: true, maxlength: 25 },

  // Mot de passe de l'utilisateur, requis, avec une longueur maximale de 100 caractères
  password: { type: String, required: true, maxlength: 100 },

  // Date de réception du dernier courrier, facultatif
  last_received_mail: { type: Date },

  // Date de la dernière récupération de courrier, facultatif
  last_picked_up: { type: String, required: false },

  // Indicateur si l'utilisateur a du courrier en attente, par défaut à false
  has_mail: { type: Boolean, default: false },

  // Statut du courrier, par défaut à 'pending'
  mail_status: { type: String, default: 'pending' },

  // Code à quatre chiffres pour l'identification, facultatif, avec une longueur maximale de 4 caractères
  four_digit_code: { type: String, required: false, maxlength: 4 },

  // Indicateur si l'utilisateur est un administrateur, par défaut à false
  is_admin: { type: Boolean, default: false }
});

// Création du modèle 'User' basé sur le schéma défini
const User = mongoose.model('User', userSchema);

// Exportation du modèle pour utilisation dans d'autres parties de l'application
module.exports = User;
