import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt"; //Criptografa senhas
import jwt from "jsonwebtoken"; //Criar e validar tokens JWT
import dotenv from "dotenv"; //Ambiente com arquivo .env

dotenv.config(); //Carregar as variaveis de ambientes do arquivo .evn

const app = express();

app.use(express.json());

//Rota aberta
app.get("/", (req, res) => {
  res.status(200).json({ mgs: "Bem vindo a nossa API " });
});

//Credenciais
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;

mongoose
  .connect(
    `mongodb+srv://${dbUser}:${dbPassword}@api.uqh5w.mongodb.net/?retryWrites=true&w=majority&appName=API`
  )
  .then(() => {
    app.listen(3000);
    console.log("Conectou ao banco");
  })
  .catch((err) => console.log(err));