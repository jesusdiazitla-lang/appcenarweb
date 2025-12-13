const request = require('supertest');
const express = require('express');
const session = require('express-session');
const { describe, test, expect, beforeAll } = require('@jest/globals');
const Usuario = require('../../models/Usuario');
const authRoutes = require('../../routes/authRoutes');

// Crear app de Express para testing
const createApp = () => {
  const app = express();
  
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  app.use(session({
    secret: 'test-secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));
  
  // Mock de flash
  app.use((req, res, next) => {
    req.flash = (_type, _message) => {};
    next();
  });
  
  app.use('/auth', authRoutes);
  
  return app;
};

describe('Auth Integration Tests', () => {
  let app;

  beforeAll(() => {
    app = createApp();
  });

  describe('POST /auth/register-cliente', () => {
    test('debe registrar un nuevo cliente exitosamente', async () => {
      const clienteData = {
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '8091234567',
        correo: 'juan@test.com',
        nombreUsuario: 'juanperez',
        rol: 'cliente',
        password: 'password123',
        confirmarPassword: 'password123'
      };

      // Como redirige, esperamos un 302
      const response = await request(app)
        .post('/auth/register-cliente')
        .send(clienteData);

      expect([200, 302]).toContain(response.status);

      // Verificar que se creó en la BD
      const usuario = await Usuario.findOne({ correo: 'juan@test.com' });
      expect(usuario).toBeTruthy();
      expect(usuario.nombre).toBe('Juan');
      expect(usuario.rol).toBe('cliente');
    });

    test('debe rechazar registro con contraseñas no coincidentes', async () => {
      const clienteData = {
        nombre: 'María',
        apellido: 'García',
        telefono: '8097654321',
        correo: 'maria@test.com',
        nombreUsuario: 'mariagarcia',
        rol: 'cliente',
        password: 'password123',
        confirmarPassword: 'password456' // No coincide
      };

      const response = await request(app)
        .post('/auth/register-cliente')
        .send(clienteData);

      // Debe redirigir de vuelta
      expect(response.status).toBe(302);

      // No debe crear el usuario
      const usuario = await Usuario.findOne({ correo: 'maria@test.com' });
      expect(usuario).toBeFalsy();
    });
  });

  describe('POST /auth/login', () => {
    beforeAll(async () => {
      // Crear usuario de prueba
      const usuario = new Usuario({
        nombre: 'Test',
        apellido: 'Login',
        correo: 'login@test.com',
        nombreUsuario: 'testlogin',
        password: 'password123',
        rol: 'cliente',
        activo: true
      });
      await usuario.save();
    });

    test('debe iniciar sesión con credenciales correctas', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          usuarioOrEmail: 'testlogin',
          password: 'password123'
        });

      expect([200, 302]).toContain(response.status);
    });

    test('debe rechazar login con credenciales incorrectas', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({
          usuarioOrEmail: 'testlogin',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(302);
    });
  });
});