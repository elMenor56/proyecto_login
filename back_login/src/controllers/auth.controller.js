const db = require('../config/db');
const bcrypt = require('bcrypt');

class AuthController {
    //Registro de nuevos usuarios
    async registrar(userData) {
        try {
            //Verificar si el email ya existe
            const [emailExistente] = await db.query('SELECT email FROM usuarios WHERE email = ?', [userData.email]);

            if (emailExistente.length > 0) {
                return {
                    success: false,
                    message: 'El email ya esta registrado'
                };
            }

            //Encriptar la contraseña
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash(userData.clave, saltRounds);

            //Crear el objeto de usuario con la contraseña encriptada
            const usuario = {
                ...userData,
                clave: hashedPassword
            };

            //Insertar el usuario en la base de datos 
            const [resultado] = await db.query('INSERT INTO usuarios SET ?', [usuario]);

            return {
                success: true,
                message: 'Usuario registrado exitosamente',
                userId: resultado.insertId
            };
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            throw error;
        }
    }

    //Inico de sesion
    async iniciarSesion(email, clave) {
        try {
            //Buscar el usuario por email
            const [usuarios] = await db.query('SELECT * FROM usuarios WHERE email = ?', [email]);

            if(usuarios.length === 0) {
                return{
                    success: false,
                    message: 'Credenciales invalidas'
                };
            }

            const usuario = usuarios[0];

            //Verificar la contraseña
            const passwordMatch = await bcrypt.compare(clave, usuario.clave);

            if (!passwordMatch) {
                return {
                    success: false,
                    message: 'Credenciales invalidas'
                };
            }

            //Crear un objeto con los datos del usuario (excluyendo la contraseña)
            const usuarioData = {
                id_usuario: usuario.id_usuario,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol || 'cliente'
            };

            return {
                success: true,
                message: 'Inicio de sesion exitoso',
                usuario: usuarioData
            };
        } catch (error) {
            console.error('Error al iniciar sesion:', error);
            throw error
        }
    }

    //Verificar si un usuario esta autentificado
    async verificarUsuario(userId) {
        try {
            const [usuarios] = await db.query('SELECT id_usuario, nombre, apellido, email, rol FROM usuarios WHERE id_usuario = ?', [userId]);

            if (usuarios.length === 0) {
                return {
                    success: false,
                    message: 'Usuario no encontrado'
                };
            }

            return {
                success: true,
                usuario: usuarios[0]
            };
        } catch (error) {
            console.error('Error al verificar usuario:', error);
            throw error
        }
    }
}

module.exports = new AuthController();