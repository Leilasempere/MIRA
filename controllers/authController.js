import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/UserModel.js';
import { sendVerificationEmail } from '../utils/mailer.js';





// Enregistrement d’un nouvel utilisateur
export const register = async (req, res) => {
  const { email, password, confirmPassword, role, city, name } = req.body;
  const userRole = role || 'user';

  if (password !== confirmPassword) {
    return res.status(400).render('register', { error: "Les mots de passe ne correspondent pas" });
  }

  if (!email || !password || !city || !name) {
    return res.status(400).render('register', { error: "Tous les champs sont requis" });
  }

  try {
    const existing = await User.findByEmail(email);
    if (existing.length > 0) {
      return res.status(409).render('register', { error: "Email déjà utilisé" });
    }

    const hashed = await bcrypt.hash(password, 10);
    await User.create({ email, password: hashed, role: userRole });

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1d" });

    const link = `http:localhost:5000/api/auth/verify/${token}`;
    await sendVerificationEmail(email, link);

    res.status(201).render('register', { success: "Utilisateur créé avec succès. Vérifiez votre email." });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement :", error);
    res.status(500).render('register', { error: "Erreur interne du serveur" });
  }
};

// Vérification du compte utilisateur
export const verifyAccount = async (req, res) => {
  try {
    const { token } = req.params;
    const { email } = jwt.verify(token, JWT_SECRET);

    const users = await User.findByEmail(email);
    if (users.length === 0) {
      return res.status(404).render('home', { error: "Utilisateur introuvable." });
    }

    await User.verifyUser(email);
    res.render('home', { message: "Compte vérifié avec succès. Vous pouvez maintenant vous connecter." });
  } catch (err) {
    res.status(400).render('home', { error: "Token invalide ou expiré." });
  }
};

// Connexion de l’utilisateur
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await User.findByEmail(email);
    if (users.length === 0) {
      return res.status(401).render('login', { error: "Identifiants invalides." });
    }

    const user = users[0];

    if (!user.is_verified) {
      return res.status(403).render('login', { error: "Veuillez vérifier votre email." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).render('login', { error: "Mot de passe incorrect." });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.render('home', { message: "Connexion réussie.", token });
  } catch (err) {
    res.status(500).render('login', { error: "Erreur serveur." });
  }
};
