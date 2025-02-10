import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt"; //Criptografa senhas
import jwt from "jsonwebtoken"; //Criar e validar tokens JWT
import dotenv from "dotenv"; //Ambiente com arquivo .env
import User from "./models/usuarioModels.js"

dotenv.config(); //Carregar as variaveis de ambientes do arquivo .evn

const app = express();

app.use(express.json());

//Rota aberta
app.get("/", (req, res) => {
  res.status(200).json({ mgs: "Bem vindo a nossa API " });
});

//Criação de usuario
app.post("/auth/register", async (req, res) => {
  const { name, email, password, confirmpassword } = req.body;

  if (!name) {
    return res.status(422).json({ msg: "O nome é obrigatorio" });
  }
  if (!email) {
    return res.status(422).json({ msg: "O Email é obrigatorio" });
  }
  if (!password) {
    return res.status(422).json({ msg: "A senha é obrigatorio" });
  }
  if (password != confirmpassword) {
    return res
      .status(422)
      .json({ msg: "A senha e a confirmação precisa ser iguais" });
  }

  const userExists = await User.findOne({ email: email });

  if (userExists) {
    return res.status(422).json({ msg: "Por afvor, utilize outro E-mail" });
  }

  const salt = await bcrypt.genSalt(12); //Gera um salt para criptografar a senha
  const passwordHast = await bcrypt.hash(password, salt); //Cria um hash da senha usando o salt

  const user = new User({
    name,
    email,
    passwordHast,
  });

  try {
    await user.save();

    res.status(201).json({ msg: "Usuario criado com sucesso" });
  } catch (error) {
    res.status(500).json({ msg: error });
  }
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
