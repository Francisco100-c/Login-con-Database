const pool  = require('./conexion')
const bcrypt = require('bcryptjs')


const getUsuarios = async () => {
    const { rows: usuarios } = await pool.query("SELECT * FROM usuarios")
    return usuarios
};

const agregarUsuario = async (email, password, rol, lenguage)=>{
    const consulta = 'INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4 )';
    const passwordEncriptada = await bcrypt.hash(password, 8)
    password = passwordEncriptada
    const values = [email, passwordEncriptada, rol, lenguage];
    
    
    try {
        await pool.query(consulta, values); 
        
    } catch (error) {
        return false;
    }
    console.log("Usuario Agregado");
    return true;
       
};

const verificarCredenciales = async (email, password) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1 AND password = $2"
    const values = [email, password]
    const { rowCount } = await pool.query(consulta, values)
    if (!rowCount)
        throw { code: 404, message: "No se encontró ningún usuario con estas credenciales" }

};

const obtenerUsuario = async (email) => {
    const consulta = "SELECT * FROM usuarios WHERE email = $1"
    const values = [email];
    const { row } = await pool.query(consulta, values);
    return row;
    
};

module.exports= { getUsuarios, agregarUsuario, verificarCredenciales, obtenerUsuario };


