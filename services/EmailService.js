// services/EmailService.js - MODO SIMULACIÓN (SIN ENVÍO REAL)

const nodemailer = require('nodemailer');

// ========================================
// 🔧 CONFIGURACIÓN - CAMBIAR AQUÍ
// ========================================
const MOCK_MODE = true; // ✅ Cambiar a false para activar envío real

// ========================================
// Configuración del transporter
// ========================================
let transporter = null;

if (!MOCK_MODE) {
  // Configuración real de nodemailer
  transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    },
    tls: {
      rejectUnauthorized: false
    }
  });
} else {
  // Transporter simulado (no hace nada real)
  console.log('📧 EmailService iniciado en MODO SIMULACIÓN');
  console.log('⚠️  Los correos NO se enviarán realmente');
}

// ========================================
// Función de envío de correos
// ========================================
const sendEmail = async (to, subject, html) => {
  if (MOCK_MODE) {
    // ✅ MODO SIMULACIÓN - Solo registra en consola
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📧 [SIMULACIÓN] Correo "enviado"');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📬 Para:', to);
    console.log('📝 Asunto:', subject);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // Simular un pequeño delay como si enviara el correo
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retornar un objeto simulado de respuesta
    return {
      messageId: `mock-${Date.now()}@appcenar.com`,
      accepted: [to],
      response: '250 Mensaje simulado aceptado'
    };
  }

  // ========================================
  // MODO REAL - Envío real de correos
  // ========================================
  try {
    const info = await transporter.sendMail({
      from: `"AppCenar" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    });
    
    console.log(`✅ Email enviado a ${to}`);
    return info;
  } catch (error) {
    console.error('❌ Error al enviar email:', error.message);
    throw error;
  }
};

// ========================================
// FUNCIONES EXPORTADAS
// ========================================

/**
 * Envía correo de activación de cuenta
 */
exports.enviarCorreoActivacion = async (correo, nombre, urlActivacion) => {
  const subject = 'Activa tu cuenta de AppCenar';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #E91E63;">Hola ${nombre},</h1>
      <p style="font-size: 16px;">Gracias por registrarte en AppCenar. Por favor, haz clic en el siguiente enlace para activar tu cuenta:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${urlActivacion}" 
           style="background-color: #E91E63; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Activar Cuenta Ahora
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">Si no solicitaste este registro, ignora este correo.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">AppCenar - Sistema de Pedidos y Delivery</p>
    </div>
  `;
  
  if (MOCK_MODE) {
    console.log('🔗 URL de activación:', urlActivacion);
  }
  
  return sendEmail(correo, subject, html);
};

/**
 * Envía correo de recuperación de contraseña
 */
exports.enviarCorreoResetPassword = async (correo, nombre, urlReset) => {
  const subject = 'Restablecer Contraseña de AppCenar';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #FFC107;">Hola ${nombre},</h1>
      <p style="font-size: 16px;">Has solicitado restablecer tu contraseña. Haz clic en el siguiente enlace:</p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${urlReset}" 
           style="background-color: #FFC107; color: #000; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          Restablecer Contraseña
        </a>
      </div>
      <p style="color: #666; font-size: 14px;">Este enlace expirará en 1 hora.</p>
      <p style="color: #666; font-size: 14px;">Si no solicitaste este cambio, ignora este correo.</p>
      <hr style="border: 1px solid #eee; margin: 20px 0;">
      <p style="color: #999; font-size: 12px;">AppCenar - Sistema de Pedidos y Delivery</p>
    </div>
  `;
  
  if (MOCK_MODE) {
    console.log('🔗 URL de reset:', urlReset);
  }
  
  return sendEmail(correo, subject, html);
};

// ========================================
// Mensaje de inicialización
// ========================================
if (MOCK_MODE) {
  console.log('');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  📧 EMAIL SERVICE - MODO SIMULACIÓN ACTIVADO');
  console.log('═══════════════════════════════════════════════════════');
  console.log('  ⚠️  Los correos NO se enviarán realmente');
  console.log('  ✅ Las URLs de activación/reset se mostrarán en consola');
  console.log('  🔧 Para activar envío real: cambiar MOCK_MODE a false');
  console.log('═══════════════════════════════════════════════════════');
  console.log('');
}