require('dotenv').config();
const mongoose = require('mongoose');

async function crearAdmin() {
  try {
    await mongoose.connect('mongodb://mongo:27017/appcenar');
    
    const Usuario = require('./models/Usuario');
    
    // Eliminar admin si existe
    await Usuario.deleteOne({ nombreUsuario: 'admin' });
    
    // Crear admin (el modelo hasheará la password automáticamente)
    const admin = new Usuario({
      nombre: 'Admin',
      apellido: 'Sistema',
      cedula: '00000000000',
      correo: 'admin@appcenar.com',
      nombreUsuario: 'admin',
      password: 'admin123', // ← Password SIN hashear
      rol: 'administrador',
      activo: true,
      requiereCambioPassword: false
    });

    await admin.save();
    console.log('✅ Admin creado exitosamente');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

crearAdmin();