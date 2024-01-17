// require('dotenv').config(); // Charge les variables d'environnement depuis un fichier .env
// const mongoose = require('mongoose');
// const faker = require('faker');
// const User = require('./client/models/user_model'); // Assurez-vous que le chemin d'accès est correct

// mongoose.connect(process.env.URL_BASE, { useNewUrlParser: true, useUnifiedTopology: true })
// .then(() => {
//   console.log("Connexion à la base de données réussie");

//   // Créer 10 utilisateurs fictifs
//   for (let i = 0; i < 10; i++) {
//     const user = new User({
//       firm_name: faker.company.companyName(),
//       first_name: faker.name.firstName(),
//       last_name: faker.name.lastName(),
//       email: faker.internet.email(),
//       phone_number: faker.phone.phoneNumber(),
//       password: faker.internet.password(),
//       last_received_mail: faker.date.past(),
//       last_picked_up: faker.date.past(),
//       has_mail: faker.random.boolean(),
//       is_admin: faker.random.boolean()
//     });

//     user.save()
//     .then(doc => {
//       console.log("Document inséré:", doc);
//     })
//     .catch(err => {
//       console.error("Erreur lors de l'insertion:", err);
//     });
//   }
// })
// .catch(err => {
//   console.error("Erreur de connexion à la base de données:", err);
// });
