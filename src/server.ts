import express from "express"; // Importation d'Express pour créer le serveur
import bodyParser from "body-parser"; // Importation de body-parser pour parser les requêtes JSON
import cors from "cors"; // Importation de cors pour gérer les problèmes de Cross-Origin Resource Sharing
import mongoose from "mongoose"; // Importation de Mongoose pour interagir avec MongoDB

const app = express(); // Création de l'application Express
const port = 3000; // Définition du port sur lequel le serveur va écouter

// Middleware pour parser les requêtes JSON
app.use(bodyParser.json());
// Middleware pour gérer les CORS
app.use(cors());

// Connexion à la base de données MongoDB nommée "taskdb"
mongoose.connect("mongodb://localhost:27017/taskdb", {
  //useNewUrlParser: true, // Utilisation de l'analyseur d'URL de nouvelle génération
  //useUnifiedTopology: true, // Utilisation de la topologie unifiée pour le client MongoDB
});

// Schéma pour les utilisateurs avec les champs "login" et "mdp"
const loginSchema = new mongoose.Schema({
  login: String,
  mdp: String,
});

// Création du modèle "Login" basé sur le schéma loginSchema
const Users = mongoose.model("Login", loginSchema);

// Route pour récupérer tous les logins
app.get("/logins", async (req, res) => {
  const logins = await Users.find(); // Récupère tous les documents de la collection "Login"
  console.log("get all logins");
  res.json(logins); // Renvoie les logins sous forme de JSON
});

// Route pour récupérer un login par ID
app.get("/login/:id", async (req, res) => {
  const login = await Users.findById(req.params.id); // Récupère un document par son ID
  console.log("get login by id");
  res.json(login); // Renvoie le login sous forme de JSON
});

// Route pour ajouter un nouveau login
app.post("/loginAdd", async (req, res) => {
  const newLogin = new Users(req.body); // Crée un nouveau document basé sur les données de la requête
  await newLogin.save(); // Sauvegarde le nouveau document dans la collection "Login"
  res.json(newLogin); // Renvoie le nouveau login sous forme de JSON
  console.log("add login");
});

// Route pour mettre à jour un login par ID
app.put("/login/:id", async (req, res) => {
  const updatedLogin = await Users.findByIdAndUpdate(req.params.id, req.body, {
    new: true, // Renvoie le document mis à jour
  });
  res.json(updatedLogin); // Renvoie le login mis à jour sous forme de JSON
  console.log("update login");
});

// Route pour supprimer un login par ID
app.delete("/login/:id", async (req, res) => {
  await Users.findByIdAndDelete(req.params.id); // Supprime un document par son ID
  console.log("delete login");
  res.sendStatus(204); // Renvoie un statut 204 (No Content) pour indiquer que la suppression a réussi
});

// Démarrage du serveur sur le port défini
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
