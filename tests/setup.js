require('dotenv').config({ path: '.env.test' });
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

jest.setTimeout(30000);

global.testUser = {
  nombre: 'Test',
  apellido: 'Usuario',
  correo: 'test@test.com',
  nombreUsuario: 'testuser',
  password: 'test123',
  telefono: '8091234567'
};

beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    
    // ✅ Sin las opciones deprecadas
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB en memoria conectado');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    if (mongoServer) {
      await mongoServer.stop();
    }
  } catch (error) {
    console.error('❌ Error limpiando:', error);
  }
});

afterEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});