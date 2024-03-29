const nodemailer = require('nodemailer');


const setupTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        host:"raouia.ben19@gmail.com",
        port:587,
        secure:false,
        auth: {
            user: 'raouia.ben19@gmail.com', 
            pass: 'pxnj xokt owhk zurv'
        }
    });
};

const formatDate = (date) => {
  
    const day = date.getDate().toString().padStart(2, '0'); 
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const year = date.getFullYear();

   
    return `${day}/${month}/${year}`;
};

const sendReservationConfirmationEmail = async (userEmail, reservation, roomName) => {
    try {
        const transporter = setupTransporter();

      
        const formattedDate = formatDate(new Date(reservation.date));

        await transporter.sendMail({
            from: 'raouia.ben19@gmail.com',
            to: userEmail,
            subject: 'Confirmation de réservation',
            html: `Votre réservation a été confirmée pour la salle ${roomName} le ${formattedDate} de ${reservation.heureDebut} à ${reservation.heureFin}.`
        });

        console.log('E-mail de confirmation envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail de confirmation :', error);
    }
};

const sendReservationModificationEmail = async (userEmail, reservation, roomName) => {
    try {
        const transporter = setupTransporter();

        
        const formattedDate = formatDate(new Date(reservation.date));

        await transporter.sendMail({
            from: 'raouia.ben19@gmail.com', 
            to: userEmail,
            subject: 'Modification de réservation',
            html: `Votre réservation pour la salle ${roomName}a été modifiée. Nouvelles informations : date: ${formattedDate}, heure de début: ${reservation.heureDebut}, heure de fin: ${reservation.heureFin}.`
        });

        console.log('E-mail de modification envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail de modification :', error);
    }
};

const sendReservationCancellationEmail = async (userEmail, reservation, roomName) => {
    try {
        const transporter = setupTransporter();

        await transporter.sendMail({
            from: 'raouia.ben19@gmail.com', 
            to: userEmail,
            subject: 'Annulation de réservation',
            html: `Votre réservation pour la salle ${roomName} a été annulée.`
        });

        console.log('E-mail d\'annulation envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail d\'annulation :', error);
    }
};

module.exports = {
    sendReservationConfirmationEmail,
    sendReservationModificationEmail,
    sendReservationCancellationEmail
};
