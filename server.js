const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ API correcta: createTransport (no createTransporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER, // tu gmail
    pass: process.env.MAIL_PASS  // app password
  }
});

// (Opcional) Verificar conexión SMTP al arrancar
transporter.verify().then(()=>{
  console.log('SMTP listo para enviar');
}).catch(err=>{
  console.error('Error SMTP:', err);
});

// Ruta de prueba (ejemplo ético: formulario de contacto)
app.post('/submit', async (req, res) => {
  const { email, message } = req.body; // no recolectar contraseñas reales

  try {
    await transporter.sendMail({
      from: `"Contacto" <${process.env.MAIL_USER}>`, // usa tu propio gmail
      to: process.env.MAIL_USER,
      subject: 'Nuevo mensaje de contacto',
      html: `
        <h2>Nuevo mensaje</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Mensaje:</strong> ${message}</p>
        <hr/>
        <p><strong>User-Agent:</strong> ${req.headers['user-agent']}</p>
        <p><strong>Fecha:</strong> ${new Date().toISOString()}</p>
      `
    });
    res.json({ success: true });
  } catch (error) {
    console.error('Error enviando email:', error);
    res.status(500).json({ success: false, error: 'No se pudo enviar' });
  }
});

app.get('/', (_, res) => res.send('Servidor ok'));
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor en puerto ${PORT}`));
