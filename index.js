const fs = require('fs');
const readline = require('readline');
const CryptoJS = require('crypto-js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Clé secrète pour chiffrer les mots de passe
const secretKey = 'ma_clé_secrète_123';

rl.question('Nom du site/service : ', (site) => {
  rl.question('Mot de passe : ', (password) => {
    // Chiffrement du mot de passe
    const encrypted = CryptoJS.AES.encrypt(password, secretKey).toString();

    // Lecture du fichier existant ou création d'un objet vide
    let data = {};
    if (fs.existsSync('passwords.json')) {
      data = JSON.parse(fs.readFileSync('passwords.json'));
    }

    // Sauvegarde du mot de passe chiffré
    data[site] = encrypted;

    fs.writeFileSync('passwords.json', JSON.stringify(data, null, 2));
    console.log(`🔐 Mot de passe pour "${site}" enregistré avec succès !`);

    rl.close();
  });
});
