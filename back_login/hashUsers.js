// hashUsers.js
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

// Configura tu conexión a la base de datos
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'root', // cambia si tu usuario tiene contraseña
    database: 'register_store'
};

async function hashPasswords() {
    const connection = await mysql.createConnection(dbConfig);

    try {
    // Traer usuarios que aún tengan clave sin hash
    const [usuarios] = await connection.execute("SELECT id_usuario, clave FROM usuarios");

    for (const usuario of usuarios) {
      if (!usuario.clave.startsWith('$2b$')) {  // si no es bcrypt
        const hashed = await bcrypt.hash(usuario.clave, 10);
        await connection.execute(
            "UPDATE usuarios SET clave = ? WHERE id_usuario = ?",
            [hashed, usuario.id_usuario]
        );
        console.log(`Usuario ${usuario.id_usuario} actualizado`);
        } else {
        console.log(`Usuario ${usuario.id_usuario} ya tiene contraseña encriptada`);
        }
    }

    console.log('Todas las contraseñas fueron actualizadas.');
    } catch (error) {
    console.error('Error:', error);
    } finally {
    await connection.end();
    }
}

hashPasswords();