const express = require("express");
const bodyParser = require("body-parser");
const { v4: uuidv4 } = require("uuid");
const jwt = require("jsonwebtoken");

const app = express();
const secretKey = "12345678910";

app.use(bodyParser.json());

function AuthGuard(request,response,next ) {
    const { headers } = request;
    const { authorization } = headers;
    try {
      const decoded = jwt.verify(authorization, secretKey);
      if (decoded.email === ADMIN.email && decoded.password === ADMIN.password) {
        next();
      }
    } catch (error) {
      response.status(401).send("Usuario nao autorizado");
    }
  }

// Dados do ADMIN (usuário administrador)
const ADMIN = {
  name: "charle",
  password: "1234",
};
const lista = []; // Array para armazenar os usuários cadastrados

// Autenticando o usuário
app.post("/login", (req, res) => {
  const { name, password } = req.body;
  if (name === ADMIN.name && password === ADMIN.password) {
    const token = jwt.sign({ name, password }, secretKey, {
      expiresIn: "1h", 
    });
    res.json({ token });
    return;
  }
  res.status(401).json({ error: "Credenciais inválidas" });
});

// Rota para cadastrar um usuário
app.post("/cadastrando", (req, res) => {
  const { name, password } = req.body;
  const id =uuidv4();
  if (!name || !password) {
    return res.status(400).json({ error: "Nome e senha são obrigatórios" });
  }

  // Verifica se já existe um usuário com o mesmo nome
  const existingUser = lista.find(user => user.name === name);
  if (existingUser) {
    return res.status(409).json({ error: "Usuário já existe" });
  }

  const newUser = {
    id: uuidv4(),
    name,
    
  };

  lista.push(newUser);
  res.status(201).json({ message: "Usuário cadastrado com sucesso", user: newUser });
});

// retorna a Lista de usuários cadastrados
app.get("/usuarios",AuthGuard, (req, res) => {
  res.json(lista);
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
