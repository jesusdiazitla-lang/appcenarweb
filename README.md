🛒 AppCenar — Plataforma Web de Pedidos Online (Tipo PedidosYa / UberEats)

Aplicación web que simula una plataforma completa de pedidos en línea, donde se gestionan comercios, clientes, repartidores (deliverys) y un panel administrativo.
El sistema permite registrar comercios, crear productos con categorías, manejar carritos de compra, procesar pedidos y administrar todo desde un dashboard central.

🚀 Características principales
🔐 Autenticación y Roles

Admin: gestión total del sistema (usuarios, comercios, pedidos, categorías).

Comercio: puede manejar sus productos, categorías y pedidos recibidos.

Cliente: puede registrarse, iniciar sesión, agregar productos al carrito y realizar pedidos.

Delivery: puede ver pedidos asignados y actualizar su estado.

🛍️ Módulo de Comercios

Registro de comercios (nombre, teléfono, contraseña, ubicación, imágenes).

Gestión de categorías y productos.

Activar/desactivar productos.

Subida de imágenes para fotos de perfil/logo.

📦 Módulo de Compras (Cliente)

Catálogo de comercios.

Visualización por categorías.

Carrito inteligente (solo permite productos del mismo comercio).

Procesamiento de órdenes.

Historial del cliente.

🚚 Módulo Delivery

Recepción de pedidos asignados.

Actualizar estado del pedido (en camino → entregado).

👨‍💼 Módulo Admin

Gestión de usuarios (clientes, deliverys, comercios).

Panel de visualización de pedidos.

Activación/desactivación de cuentas.

🛠️ Tecnologías utilizadas
Categoría	Tecnologías
Backend	Node.js, Express, Express-Session
Frontend	Handlebars (hbs)
Base de Datos	MongoDB + Mongoose
Autenticación	Cookies + Sessions
Almacenamiento de imágenes	FileSystem (o configuración para usar Cloudinary)
Estilo	CSS minimalista propio
Otros	Morgan, bcryptjs, connect-mongo
