import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();


const transporter = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

export const sendVerificationEmail = (to, link) => {
  const mailOptions = {
    from: '"Support" <no-reply@example.com>',
    to,
    subject: 'Vérification de votre compte',
    text: `Votre lien de vérification : \nCliquez ici pour valider votre compte : ${link}`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) console.error('Erreur email:', error);
    else console.log('📧 Email de vérification envoyé :', info.response);
  });
};