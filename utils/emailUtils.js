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


const sendReservationConfirmationEmail = async (userEmail, reservation) => {
    try {
       

        const transporter = setupTransporter();

        await transporter.sendMail({
            from: 'raouia.ben19@gmail.com', 
            to: userEmail,
            subject: 'Confirmation de réservation',
            html: `Votre réservation a été confirmée pour la salle ${reservation.room} le ${reservation.date} de ${reservation.heureDebut} à ${reservation.heureFin}.`
        });

        console.log('E-mail de confirmation envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail de confirmation :', error);
    }
};



const sendReservationModificationEmail = async (userEmail, reservation) => {
    try {
        const transporter = setupTransporter();

        await transporter.sendMail({
            from: 'raouia.ben19@gmail.com', 
     
            to: userEmail,
            subject: 'Modification de réservation',
            html: `Votre réservation pour la salle ${reservation.room} a été modifiée. Nouvelles informations : date: ${reservation.date}, heure de début: ${reservation.heureDebut}, heure de fin: ${reservation.heureFin}.`
        });

        console.log('E-mail de modification envoyé avec succès');
    } catch (error) {
        console.error('Erreur lors de l\'envoi de l\'e-mail de modification :', error);
    }
};


const sendReservationCancellationEmail = async (userEmail, reservation) => {
    try {
        const transporter = setupTransporter();

        await transporter.sendMail({
            from: 'raouia.ben19@gmail.com', 
           
            to: userEmail,
            subject: 'Annulation de réservation',
            html: `Votre réservation pour la salle ${reservation.room} a été annulée.`
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
