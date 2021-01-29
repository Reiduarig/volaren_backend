
const { getConnection } = require("./db");

const performQuery = async (query, params) => {
    let connection;

    try {
        connection = await getConnection();

        const [result] = await connection.query(query, params)

        return result;
        
    } catch (e) {
        throw new Error(e)

    } finally {
        if (connection) {
            connection.release()
        }
    }
}

const register = async(username, email, password, validation_code) => {

  
    const query = "INSERT INTO usuario (username, password, email, validation_code) values(?,?,?,?)";
    const params = [ username, password, email, validation_code];

    await performQuery(query, params);

  
}

const getUser = async(email) => {
    
    const query = `select * from usuario where email = ?`
    const params = [email]

    const result = await performQuery(query, params)
    return result;
}

const checkValidationCode = async (code) => {
    // comprobar si existe un usuario que esté pendiente de validación
    const query = `SELECT * FROM usuario WHERE validation_code = ?`
    const params = [code]

    const [result] = await performQuery(query, params)
    
    // si existe un usuario con ese código de validación
    // lo marcamos como activo
    if (result) {
       
        const query = `UPDATE usuario SET active = true, validation_code = '' WHERE id = ?`
        await performQuery(query, [result.id])
    } else {
        throw new Error('validation-error')
    }

}


module.exports = {
    performQuery,
    getUser,
    register, 
    checkValidationCode
}