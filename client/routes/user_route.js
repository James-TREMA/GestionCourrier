// Importation du module Express pour la création de routes
const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/auth');


// Importation du contrôleur utilisateur pour gérer les requêtes
const userController = require('../controllers/user_controller');

// Route pour afficher le formulaire d'inscription (GET)
router.get('/createUser', userController.showRegistrationForm);

// Route pour créer un nouvel utilisateur (POST)
router.post('/createUser', userController.create_user);

// Route pour obtenir un utilisateur par son nom de firme (GET)
router.get('/firm/:firm_name', userController.get_user_by_firm_name);

// Route pour obtenir toutes les données des entreprises (POST)
router.get('/gestionEntreprise', userController.get_all_users);

router.get('/gestionEntrepriseFirmName', userController.get_all_FirmName)

// Route pour afficher la page de gestion des entreprises (POST) si je use mon fichier ejs
// router.post('/gestionEntreprise', userController.showGestionForm);

// Route pour mettre à jour un utilisateur par son ID (PUT)
router.put('/update/:id', verifyToken, userController.update_user);

// Route pour supprimer un utilisateur par son ID (DELETE)
router.delete('/delete/:id', verifyToken, userController.delete_user);

// Route pour l'identification du client (POST)
router.post('/login', userController.login_user);

// Route pour vérifier si un utilisateur a du courrier en attente (GET)
router.get('/checkMail/:userId', userController.check_mail);

// Route pour accuser la récupération du courrier par un utilisateur (POST)
router.post('/acknowledgeMail/:userId', userController.acknowledge_mail);

// Route pour notification quand on appuie sur le button envoie Mail et SMS (POST)
router.post('/sendModalEntreprise', userController.sendModalEntreprise);

// Route pour ajouter une notification à un utilisateur (POST)
router.post('/testNotification/:userId', async (req, res) => {
    try {
        await userController.testAddNotification(req.params.userId, req.body.message);
        res.status(200).json({ message: "Notification de test ajoutée avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout de la notification de test", error });
    }
});

// Exportation du routeur pour utilisation dans l'application principale
module.exports = router;
