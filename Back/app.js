const express = require ('express');
const fs = require('fs')
const app = express();
const cors = require('cors');
const pool  = require('./conexion');
const jwt = require("jsonwebtoken");


const {getUsuarios, agregarUsuario, verificarCredenciales, obtenerUsuario} = require('./consultas')


app.use(cors());
app.use(express.json());

app.listen( 3000, console.log("SERVER ON SOFTJOBS"))

app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await getUsuarios();
        res.json(usuarios)
    } catch (error) {
        res.status(error.code || 500).send(error)
    }
});

app.post("/usuarios", async (req, res) => {//Ruta o pagina de internet
    
        const { email, password, rol, lenguage } = req.body
        const result = await agregarUsuario(email, password, rol, lenguage);
        res.send("Usuario agregado con éxito");
        if(result){
            res.send("Usuario agregado con éxito");
        }else{
            res.status(500).send("No se puede agregar el usuario")
        }
          
 });

 app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        await verificarCredenciales(email, password)
        const token = jwt.sign({ email }, "az_AZ")
        res.send(token)
    } catch (error) {
        console.log(error)
        res.status(error.code || 500).send(error)
    }
});


app.get("/usuarios", async (req, res) => {
    const Authorization = req.header("Authorization")
        const token = Authorization.split("Bearer ")[1]
        jwt.verify(token, "az_AZ")
        const { email } = jwt.decode(token)
        const result = await obtenerUsuario(email);
        res.status(200).send(result)

});

