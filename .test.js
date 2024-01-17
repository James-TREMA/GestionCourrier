const request = require('supertest');
const app = require('./server'); // Assurez-vous que le chemin est correct

describe('Tests de l\'API Utilisateur', () => {
  it('Créer un nouvel utilisateur', async () => {
    const userData = {
      firm_name: "NomFirmeTest",
      first_name: "PrénomTest",
      last_name: "NomTest",
      email: "test@example.com",
      phone_number: "0123456789",
      // Ajoutez ici d'autres champs requis par votre modèle d'utilisateur
    };

    const response = await request(app)
      .post('/api/users/createUser')
      .send(userData);

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('firm_name', userData.firm_name);
    // Ajoutez ici d'autres assertions pour vérifier les propriétés de l'utilisateur créé
  });

  it('Échec de la création d\'un utilisateur avec des données manquantes', async () => {
    const userData = {
      // Données incomplètes
      firm_name: "NomFirmeTest",
      email: "test@example.com"
    };

    const response = await request(app)
      .post('/api/users/createUser')
      .send(userData);

    expect(response.statusCode).toBe(400);
    expect(response.body).toHaveProperty('message');
    // Vérifiez ici le message d'erreur spécifique retourné par votre API
  });

  // Ajoutez d'autres tests pour différentes routes et cas ici
});
