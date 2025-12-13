// Inicialización de MongoDB para Docker Compose
db = db.getSiblingDB('appcenar');

// Crear colecciones
db.createCollection('usuarios');
db.createCollection('pedidos');
db.createCollection('productos');
db.createCollection('categorias');
db.createCollection('direcciones');
db.createCollection('tiposcomercios');
db.createCollection('configuracions');

// Crear índices
db.usuarios.createIndex({ correo: 1 }, { unique: true });
db.usuarios.createIndex({ nombreUsuario: 1 }, { unique: true, sparse: true });
db.usuarios.createIndex({ rol: 1 });

db.pedidos.createIndex({ cliente: 1, fechaPedido: -1 });
db.pedidos.createIndex({ comercio: 1, fechaPedido: -1 });
db.pedidos.createIndex({ estado: 1 });

db.productos.createIndex({ comercio: 1 });
db.productos.createIndex({ categoria: 1 });

print('✅ Base de datos AppCenar inicializada correctamente');