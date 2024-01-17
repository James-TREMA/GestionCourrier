const cron = require('node-cron');
const userController = require('./client/controllers/user_controller');

// Planifier pour exécuter tous les jours à minuit
cron.schedule('0 0 * * *', () => {
    userController.checkLastPickedUpAndNotify();
});