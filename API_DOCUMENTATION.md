# Documentation API - GestionCourrier

## Aperçu

Cette documentation décrit les points de terminaison de l'API pour l'application GestionCourrier. L'API permet la gestion des utilisateurs et des courriers pour les clients et les gestionnaires.

## Base URL

Toutes les requêtes sont relatives à la base URL suivante : `http://localhost:3000/api/users`

## Endpoints

### 1. Créer un Utilisateur

- **URL** : `/createUser`
- **Méthode** : `POST`
- **Description** : Crée un nouvel utilisateur.
- **Corps de la Requête** :
  ```json
  {
      "firm_name": "Nom de la Firme",
      "first_name": "Prénom",
      "last_name": "Nom",
      "email": "email@example.com",
      "phone_number": "0123456789",
  }
  ```

### 2. Obtenir un Utilisateur par Nom de Firme

- **URL** : `/firm/:firm_name`
- **Méthode** : `GET`
- **Description** : Récupère un utilisateur par son nom de firme.
- **Paramètres URL** : `firm_name` - Nom de la firme de l'utilisateur.

### 3. Obtenir Tous les Utilisateurs

- **URL** : `/gestionEntreprise`
- **Méthode** : `GET`
- **Description** : Récupère tous les utilisateurs.

### 4. Obtenir tous les noms d'entreprise

- **URL** : `/gestionEntrepriseFirmName`
- **Méthode** : `GET`
- **Description** : Récupère tous les noms d'entreprise.

### 5. Mettre à Jour un Utilisateur

- **URL** : `/update/:id`
- **Méthode** : `PUT`
- **Description** : Met à jour les informations d'un utilisateur.
- **Paramètres URL** : `id` - ID de l'utilisateur.
- **Corps de la Requête** :
  ```json
  {
      "first_name": "Nouveau Prénom",
      "last_name": "Nouveau Nom"
  }
  ```

### 6. Supprimer un Utilisateur

- **URL** : `/delete/:id`
- **Méthode** : `DELETE`
- **Description** : Supprime un utilisateur.
- **Paramètres URL** : `id` - ID de l'utilisateur.

### 7. Identification du Client

- **URL** : `/login`
- **Méthode** : `POST`
- **Description** : Permet à un client de s'identifier.
- **Corps de la Requête** :
  ```json
  {
      "firm_name": "Nom de la Firme",
      "four_digit_code": "1234"
  }
  ```

### 8. Vérifier le Courrier en Attente

- **URL** : `/checkMail/:userId`
- **Méthode** : `GET`
- **Description** : Vérifie si un utilisateur a du courrier en attente.
- **Paramètres URL** : `userId` - ID de l'utilisateur.

### 9. Accuser la Récupération du Courrier

- **URL** : `/acknowledgeMail/:userId`
- **Méthode** : `POST`
- **Description** : Permet à un utilisateur d'accuser la récupération de son courrier.
- **Paramètres URL** : `userId` - ID de l'utilisateur.

### 10. Envoyer des Notifications par Mail et SMS (sendModalEntreprise)

- **URL** : `/sendModalEntreprise`
- **Méthode** : `POST`
- **Description** : Envoie des notifications par mail et SMS aux utilisateurs spécifiés. Cette route est utilisée pour envoyer des alertes aux utilisateurs sélectionnés depuis le frontend.
- **Paramètres URL** : 
  - `userId` : ID des utilisateurs. Peut être un seul ID ou un tableau d'ID.
- **Corps de la Requête** : Aucun (les données sont passées via les paramètres URL).
- **Exemple de Requête** :

## Utilisation

Pour utiliser cette API, envoyez des requêtes HTTP aux points de terminaison décrits ci-dessus avec les méthodes, paramètres et corps de requête appropriés.