-- ----------------------------
-- Mira Deal - SCHEMA SQL
-- ----------------------------

-- Drop tables if they exist (respecting dependencies)
DROP TABLE IF EXISTS coupons;
DROP TABLE IF EXISTS offres;
DROP TABLE IF EXISTS abonnements_pro;
DROP TABLE IF EXISTS stripe_comptes_pro;
DROP TABLE IF EXISTS users;

-- ----------------------------
-- USERS (clients & pros)
-- ----------------------------
CREATE TABLE users (
id INT AUTO_INCREMENT PRIMARY KEY,
email VARCHAR(255) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
role ENUM('client', 'pro') NOT NULL,
name VARCHAR(100),
city VARCHAR(100),
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ----------------------------
-- ABONNEMENTS PRO
-- ----------------------------
CREATE TABLE abonnements_pro (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
formule ENUM('1_offre', '2_offres', 'illimité') NOT NULL,
date_debut DATE NOT NULL,
actif BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------
-- STRIPE CONNECT
-- ----------------------------
CREATE TABLE stripe_comptes_pro (
id INT AUTO_INCREMENT PRIMARY KEY,
user_id INT NOT NULL,
stripe_account_id VARCHAR(255) NOT NULL,
onboarded BOOLEAN DEFAULT FALSE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------
-- OFFRES PUBLIÉES
-- ----------------------------
CREATE TABLE offres (
id INT AUTO_INCREMENT PRIMARY KEY,
pro_id INT NOT NULL,
titre VARCHAR(255) NOT NULL,
description TEXT,
categorie VARCHAR(100),
ville VARCHAR(100),
prix INT NOT NULL,
image_reference VARCHAR(255),
date_debut DATE NOT NULL,
date_fin DATE NOT NULL,
nombre_coupons INT NOT NULL,
nombre_coupons_restants INT NOT NULL,
active BOOLEAN DEFAULT TRUE,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
FOREIGN KEY (pro_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ----------------------------
-- COUPONS CLIENTS
-- ----------------------------
CREATE TABLE coupons (
id INT AUTO_INCREMENT PRIMARY KEY,
offre_id INT NOT NULL,
client_id INT NOT NULL,
code_coupon VARCHAR(100) UNIQUE,
stripe_intent_id VARCHAR(255),
utilise BOOLEAN DEFAULT FALSE,
statut_rdv ENUM('en_attente', 'honoré', 'non_honoré') DEFAULT 'en_attente',
date_reservation DATETIME DEFAULT CURRENT_TIMESTAMP,
used_at DATETIME,
FOREIGN KEY (offre_id) REFERENCES offres(id) ON DELETE CASCADE,
FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);
