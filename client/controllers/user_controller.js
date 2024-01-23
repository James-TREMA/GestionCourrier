// ./client\controllers\user_controller.js

const User = require('../models/user_model');
const { hashPassword } = require('../utils/hash_util');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Fonction pour générer un mot de passe alphanumérique aléatoire de 4 caractères
function generateRandomPassword() {
    const characters = '0123456789';
    let four_digit_code = '';
    for (let i = 0; i < 4; i++) {
        four_digit_code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return four_digit_code;
}

exports.create_user = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({ message: "Données manquantes dans la requête" });
    }

    try {
        const existingUser = await User.findOne({ firm_name: req.body.firm_name });
        if (existingUser) {
            return res.status(409).json({ message: "Un utilisateur avec ce nom de firme existe déjà" });
        }

        // Générer un mot de passe alphanumérique aléatoire de 4 caractères
        const randomPassword = generateRandomPassword();

        console.log('Mot de passe généré :', randomPassword);

        // Configurer le transporteur Nodemailer
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
              ciphers: 'SSLv3'
          }
        });

        // Configurer les options de l'email
        let mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: req.body.email,
            subject: 'Votre mot de passe pour GestionCourrier',
            text: `Bonjour, voici votre mot de passe : ${randomPassword}`
        };

        // Envoyer l'email
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
                console.log(error);
            } else {
                console.log('Email envoyé : ' + info.response);
            }
        });

        // Hacher le mot de passe généré
        const hashedPassword = await hashPassword(randomPassword);

        // Convertir la date actuelle en format "MM/DD/YYYY"
        const formattedDate = new Date().toLocaleDateString('fr-FR');

        // Créer un nouvel utilisateur avec le mot de passe généré
        const newUser = new User({
            ...req.body,
            four_digit_code: hashedPassword,
            is_admin: req.body.is_admin || false,
            last_picked_up: formattedDate
        });

        // Envoie de l'SMS avec fetch
        const auth = Buffer.from('stagiairesimts:7ef681bd916d088').toString('base64');
        const smsData = {
          from: 'NotiMail',
          to: req.body.phone_number,
          text: `Bonjour, voici votre mot de passe : ${randomPassword}`
        };
          try {
            const response = await fetch('https://api.allmysms.com/sms/send', {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'
              },
              body: JSON.stringify(smsData)
            });

            const smsResponseData = await response.json();
            console.log('SMS envoyé avec succès:', smsResponseData);
          } catch (error) {
            console.error('Erreur lors de l\'envoi du SMS:', error);
            if (error.response) {
              const statusCode = error.response.status;
              const errorData = error.response.data;
          
              console.error("Détails de la réponse d'erreur:");
              console.error("Données:", errorData);
              console.error("Statut:", statusCode);
              console.error("En-têtes:", error.response.headers);
          
              // Gestion des erreurs spécifiques
              switch (statusCode) {
                case 104:
                  console.error("Erreur 104: Compte non crédité ou crédit insuffisant.");
                  break;
                // Ajoutez ici d'autres cas d'erreur spécifiques à l'API
                default:
                  console.error("Erreur non spécifiée par l'API.");
              }
            } else if (error.request) {
              console.error("Aucune réponse reçue à la requête:", error.request);
            } else {
              console.error("Erreur de configuration de la requête:", error.message);
            }
          // Informations supplémentaires pour le débogage
          console.error("Configuration de la requête:", error.config);
          if (error.code) console.error("Code d'erreur:", error.code);
          if (error.stack) console.error("Stack Trace:", error.stack);    
        }
      
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch (error) {
        console.error('Complete error:', error);
        res.status(500).json({ 
            message: "Erreur lors de la création de l'utilisateur", 
            error: error.message || error.toString()
        });
    }
};

exports.checkLastPickedUpAndNotify = async () => {
  const thresholdDate = new Date();
  thresholdDate.setDate(thresholdDate.getDate() - 7); // Seuil fixé à 7 jours

  const users = await User.find({ last_picked_up: { $lt: thresholdDate }, has_mail: true });

  users.forEach(async user => {
      const message = "Vous avez des courriers non récupérés depuis plus d'une semaine.";
      await User.findByIdAndUpdate(user._id, {
          $push: { notifications: { message: message } }
      });
  });
};

exports.testAddNotification = async (userId, message) => {
  try {
      await User.findByIdAndUpdate(userId, {
          $push: { notifications: { message: message } }
      });
      console.log("Notification ajoutée avec succès");
  } catch (error) {
      console.error('Erreur lors de l\'ajout de la notification', error);
  }
};

// Afficher le formulaire d'inscription
exports.showRegistrationForm = (req, res) => {
  res.render('createUser');
};

// Affiche tout les utilisateurs
exports.get_all_users = async (req, res) => { // le problème vien d'ici je veut get juste les nom d'entreprise et pas tout
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'obtention des utilisateurs", error });
  }
};

exports.get_all_FirmName = async (req, res) => {
  try {
    const users = await User.find
    ().select('firm_name -_id');
    const firmNames = users.map(user => user.firm_name);
    res.status(200).json({ firmNames });
    } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'obtention des noms des entreprises", error });
    }
};

exports.showGestionForm = async (req, res) => {
  try {
    // Récupération uniquement des noms des entreprises
    const users = await User.find().select('firm_name -_id');
    const firmNames = users.map(user => user.firm_name);
    console.log(firmNames)
    res.status(200).json({ firmNames });
  } catch (error) {
    // Gestion améliorée des erreurs
    console.error('Erreur lors de la récupération des noms des entreprises:', error);
    if (error.name === 'MongoNetworkError') {
      res.status(503).json({ message: 'Problème de connexion à la base de données' });
    } else if (error.name === 'CastError') {
      res.status(400).json({ message: 'Requête mal formée' });
    } else {
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  }
};

// exports.showGestionForm = (req, res) => {
//   res.render('gestionEntreprise');
// };

// Fonction pour générer un token JWT
function generateToken(user) {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
}

async function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

// Connexion de l'utilisateur
exports.login_user = async (req, res) => {
  if (!req.body || !req.body.firm_name || !req.body.four_digit_code) {
      return res.status(400).json({ message: "Données manquantes dans la requête" });
  }

  try {
      const { firm_name, four_digit_code } = req.body;
      const user = await User.findOne({ firm_name });

      if (!user) {
          return res.status(404).json({ message: "Identification échouée. Utilisateur non trouvé." });
      }

      const isPasswordMatch = await comparePassword(four_digit_code, user.four_digit_code);
      if (!isPasswordMatch) {
        // erreur 401 = Mot de passe incorrect
          return res.status(401).json({ message: "Mot de passe incorrect." });
      }

      const token = generateToken(user);
      console.log(token)
      res.status(200).json({ message: "Identification réussie", userId: user._id, firm_name: user.firm_name, is_admin: user.is_admin, token });
    } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'identification", error: error.message });
  }
};

// Vérifier si l'utilisateur a du courrier
exports.check_mail = async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      const hasMail = user.has_mail;
      res.status(200).json({ userId, hasMail });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de la vérification du courrier", error });
  }
};

// Accuser réception du courrier
exports.acknowledge_mail = async (req, res) => {
  try {
      const userId = req.params.userId;
      const user = await User.findByIdAndUpdate(userId, { has_mail: false }, { new: true });

      if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
      }

      res.status(200).json({ message: "Courrier récupéré", user });
  } catch (error) {
      res.status(500).json({ message: "Erreur lors de l'accusation de récupération du courrier", error });
  }
};

// Affiche le nom de l'enreprise
exports.get_user_by_firm_name = async (req, res) => {
  try {
    const user = await User.findOne({ firm_name: req.params.firm_name });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la recherche de l'utilisateur", error });
  }
};

// Met à jour un utilisateur
exports.update_user = async (req, res) => {
  console.log(req)

  // const adminId = req.query.adminId;
  // const userIdToUpdate = req.query.userId;
  // const userRequesting = await User.findById(req.userId);

  // console.log(adminId)
  // console.log(userIdToUpdate)
  // console.log(userRequesting)

  // if (!userRequesting) {
  //   return res.status(404).json({ message: "Utilisateur demandeur non trouvé" });
  // }  

  // // Vérifier si l'utilisateur qui fait la demande est l'administrateur
  // if (!userRequesting.is_admin || userRequesting._id.toString() !== adminId) {
  //   return res.status(403).json({ message: 'Action non autorisée' });
  // }

  // // Vérifier si l'administrateur essaie de se mettre à jour lui-même
  // if (adminId === userIdToUpdate) {
  //   return res.status(400).json({ message: 'Un administrateur ne peut pas se mettre à jour lui-même via cette route' });
  // }

  // console.log("A passer tout les test de validation")

  // try {
  //   const updatedUser = await User.findByIdAndUpdate(userIdToUpdate, req.body, { new: true });
  //   if (!updatedUser) {
  //     return res.status(404).json({ message: 'Utilisateur non trouvé' });
  //   }
  //   res.status(200).json({ message: 'Utilisateur mis à jour', updatedUser });
  // } catch (error) {
  //   res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur', error });
  // }
};

// Supprime un utilisateur
exports.delete_user = async (req, res) => {
  const userIdToDelete = req.params.id;
  const userRequesting = await User.findById(req.userId);

  // Vérifiez si l'utilisateur faisant la requête est un administrateur
  if (!userRequesting.is_admin) {
    return res.status(403).json({ message: 'Action non autorisée' });
  }

  // Logique de suppression de l'utilisateur
  try {
    const deletedUser = await User.findByIdAndDelete(userIdToDelete);
    if (!deletedUser) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur', error });
  }
};

exports.sendModalEntreprise = async (req, res) => {
  const AdminId = req.query.adminId;
  const userAdmin = await User.findById(AdminId).select('is_admin');

  if (!userAdmin || !userAdmin.is_admin) {
    return res.status(403).json({ message: 'Action non autorisée' });
  }

  try {
    let userIds = req.query.userId;
    if (!userIds) {
      return res.status(400).json({ message: 'Aucun userId fourni' });
    }

    // Convertir en tableau si userIds est une chaîne
    if (!Array.isArray(userIds)) {
      userIds = [userIds];
    }

    const users = await User.find({ '_id': { $in: userIds } }).select('firm_name email phone_number has_mail');
    if (users.length !== userIds.length) {
      return res.status(404).json({ message: 'Un ou plusieurs userId ne correspondent pas' });
    }

    const auth = Buffer.from('stagiairesimts:7ef681bd916d088').toString('base64');

    for (const user of users) {
      try {
        await User.findByIdAndUpdate(user._id, { has_mail: true }, { new: true });
        console.log('Status has_mail true et envoie du mail sms à l\'entreprise : ', user.firm_name);
        
        // Envoyer l'email
        let transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_ADDRESS,
                pass: process.env.EMAIL_PASSWORD
            },
            tls: {
              ciphers: 'SSLv3'
          }
        });

        let mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: user.email,
            subject: 'Nouveau Mail',
            text: "Vous avez reçu un message"
        };

        await transporter.sendMail(mailOptions);

        console.log('Email envoyé à : ' + user.email);

        // Envoie de l'SMS avec fetch
        const smsData = {
          from: 'NotiMail',
          to: user.phone_number,
          text: "Vous avez reçu un nouveau message"
        };
          try {
            const response = await fetch('https://api.allmysms.com/sms/send', {
              method: 'POST',
              headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json',
                'cache-control': 'no-cache'
              },
              body: JSON.stringify(smsData)
            });

            const smsResponseData = await response.json();
            console.log('SMS envoyé avec succès:', smsResponseData);
          } catch (error) {
            console.error('Erreur lors de l\'envoi du SMS:', error);
            if (error.response) {
              const statusCode = error.response.status;
              const errorData = error.response.data;
          
              console.error("Détails de la réponse d'erreur:");
              console.error("Données:", errorData);
              console.error("Statut:", statusCode);
              console.error("En-têtes:", error.response.headers);
          
              // Gestion des erreurs spécifiques
              switch (statusCode) {
                case 104:
                  console.error("Erreur 104: Compte non crédité ou crédit insuffisant.");
                  break;
                // Ajoutez ici d'autres cas d'erreur spécifiques à l'API
                default:
                  console.error("Erreur non spécifiée par l'API.");
              }
            } else if (error.request) {
              console.error("Aucune réponse reçue à la requête:", error.request);
            } else {
              console.error("Erreur de configuration de la requête:", error.message);
            }
          // Informations supplémentaires pour le débogage
          console.error("Configuration de la requête:", error.config);
          if (error.code) console.error("Code d'erreur:", error.code);
          if (error.stack) console.error("Stack Trace:", error.stack);    
        }
      } catch (error) {
        console.error('Erreur lors de la mise à jour de has_mail pour l\'utilisateur', user._id, error);
      }
    }
    
    res.status(200).json({ message: 'Traitement réussi', users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur interne du serveur', error: error.message });
  }
};
