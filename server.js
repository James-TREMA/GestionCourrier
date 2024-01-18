// Chargement des variables d'environnement depuis un fichier .env
require('dotenv').config();
// Importation des tâches cron
require('./cron_jobs');

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
// Initialisation de l'application Express
const app = express();

// Configuration d'EJS comme moteur de template
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware pour analyser les corps de requête JSON
app.use(express.json());

// Connexion à MongoDB avec la chaîne de connexion définie dans les variables d'environnement
mongoose.connect(process.env.URL_BASE, { dbName: "NotiMail" })
.then(() => {
    console.log("Connexion réussie à la base de données NotiMail");
})

.catch(err => {
    console.log("Connexion à la base de données NotiMail échouée", err);
    process.exit();
});

// Pour parser les requêtes JSON
app.use(express.json());

// Configuration CORS pour permettre les requêtes de votre client
app.use(cors({
    origin: 'http://localhost:5173', // Ceci permet l'accès de toutes les origines
    credentials: true,
    // Vous pouvez aussi ajouter des en-têtes spécifiques si nécessaire :
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Importation des routes utilisateur
const userRoutes = require('./client/routes/user_route');

// Utilisation des routes utilisateur dans l'application
app.use('/api/users', userRoutes);

// Route pour afficher le formulaire de création d'utilisateur
app.get('/createUser', (req, res) => {
    res.render('createUser');
});

// Route pour afficher la page de gestion des entreprises
app.get('/gestionEntreprise', (req, res) => {
    res.render('gestionEntreprise');
});

// app.get('/gestionEntrepriseFirmName', (req, res) => {
//     res.render('gestionEntrepriseFirmName');
// });

// Route de base pour tester que le serveur fonctionne
app.get('/', (req, res) => {
    res.json({ "message": "Bienvenue dans votre application de gestion de courrier" });
});

// Démarrage du serveur sur le port défini dans les variables d'environnement ou 3000 par défaut
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Le serveur tourne sur le port ${PORT}.`);
});

// On génère une clés random
// const crypto = require('crypto');
// const secret = crypto.randomBytes(64).toString('hex');
// console.log(secret);