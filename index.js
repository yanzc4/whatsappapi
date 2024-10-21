const express = require('express');
const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const QRCode  = require('qrcode');
const fs = require('fs');

// Crear la aplicación de Express
const app = express();
app.use(express.json()); // Para parsear el cuerpo de las solicitudes JSON

let conn; // Declarar una variable global para almacenar el socket de WhatsApp
// Función para iniciar la conexión de WhatsApp
async function startWhatsApp() {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');
    conn = makeWASocket({ auth: state });

    conn.ev.on('connection.update', async (update) => {
        const { qr, connection, lastDisconnect } = update;

        if (qr) {
            const qrImagePath = 'whatsapp-qr.png';
            await QRCode.toFile(qrImagePath, qr);
            console.log('QR code generated. Scan it with WhatsApp to authenticate:\n', qr);
        }


        if (connection === 'close') {
            console.log('Conexión cerrada.');

            if (lastDisconnect.error.output.statusCode !== 401) {
                console.log('Reconectando...');
                startWhatsApp(); // Intenta reconectar
            } else {
                console.log('Se ha cerrado la sesión. Por favor, vuelve a escanear el código QR.');
            }
        } else if (connection === 'open') {
            console.log('Conexión establecida.');
            conn.ev.on('creds.update', saveCreds);
        } else if (connection === 'connecting') {
            console.log('Conectando...');
        }
    });

    conn.ev.on('creds.update', async () => {
        await saveCreds();
        console.log('Credenciales guardadas.');
    });

    conn.ev.on('error', (error) => {
        console.error('Error de conexión:', error);
        // Puedes añadir lógica adicional aquí para manejar errores específicos
    });

    conn.ev.on('registered', () => {
        console.log('Registro exitoso en WhatsApp.');
    });
    
    conn.ev.on('notLoggedIn', () => {
        console.log('No has iniciado sesión, intentando registro...');
        // Aquí puedes agregar lógica adicional si es necesario para manejar el registro
    });
}

// Llamar a la función para iniciar la conexión
startWhatsApp().catch(console.error);

// Ruta para enviar un mensaje de texto
app.post('/send-message', async (req, res) => {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
        return res.status(400).send('Número de celular y mensaje son requeridos.');
    }

    try {
        const result = await conn.sendMessage(phoneNumber + '@s.whatsapp.net', { text: message });
        res.status(200).send(`Mensaje enviado: ${result}`);
    } catch (error) {
        console.error('Error al enviar mensaje:', error);
        res.status(500).send('Error al enviar mensaje.');
    }
});

// Ruta para enviar un PDF
app.post('/send-pdf', async (req, res) => {
    const { phoneNumber, pdfPath } = req.body;

    if (!phoneNumber || !pdfPath) {
        return res.status(400).send('Número de celular y ruta del PDF son requeridos.');
    }

    try {
        const pdfBuffer = fs.readFileSync(pdfPath);
        const result = await conn.sendMessage(phoneNumber + '@s.whatsapp.net', { document: pdfBuffer, mimetype: 'application/pdf' });
        res.status(200).send(`PDF enviado: ${result}`);
    } catch (error) {
        console.error('Error al enviar PDF:', error);
        res.status(500).send('Error al enviar PDF.');
    }
});

// Iniciar el servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
