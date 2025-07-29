import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import authRoutes from './routes/authRoute.js';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configurer Twig (package twig)
app.set('view engine', 'twig');
app.set('views', path.join(__dirname, 'views'));

// Middleware pour parser JSON + données de formulaire (x-www-form-urlencoded)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir les fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Route d'accueil : affiche home.twig avec articles fictifs
app.get('/', (req, res) => {
  const articles = [
    {
      title: 'Premier article',
      description: 'Description du premier article',
      image_url: 'https://via.placeholder.com/400x200',
      created_at: '2025-07-29'
    },
    {
      title: 'Second article',
      description: 'Description du second article',
      image_url: 'https://via.placeholder.com/400x200',
      created_at: '2025-07-28'
    }
  ];
  res.render('home', { articles });
});

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Middleware 404
app.use((req, res) => {
  res.status(404).send('Page non trouvée');
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
