import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { v4 as uuidv4 } from "uuid";
import jwt from "jsonwebtoken";


const app = express();
const secretKey = "12345678910";

app.use(bodyParser.json());

interface User {
  id: string;
  name: string;
  password: string;
}

interface TokenPayload {
  name: string;
}

function AuthGuard(request: express.Request, response: express.Response, next: express.NextFunction) {
  const { headers } = request;
  const { authorization } = headers;
  try {
    const decoded = jwt.verify(authorization as string, secretKey) as TokenPayload;
    if (decoded.name === ADMIN.name) {
      next();
    }
  } catch (error) {
    response.status(401).send("Usuário não autorizado");
  }
}

// Dados do ADMIN (usuário administrador)
const ADMIN: User = {
  id: uuidv4(),
  name: "charle",
  password: "1234",
};

const lista: User[] = []; // Array para armazenar os usuários cadastrados

// Autenticando o usuário
app.post("/login", (req, res) => {
  const { name, password } = req.body;
  if (name === ADMIN.name && password === ADMIN.password) {
    const token = jwt.sign({ name }, secretKey, {
      expiresIn: "1h",
    });
    res.json({ token });
  } else {
    res.status(401).json({ error: "Credenciais inválidas" });
  }
});

// Rota para cadastrar um usuário
app.post("/usuarios", (req, res) => {
  const { name, password } = req.body;
  const id = uuidv4();
  if (!name || !password) {
    return res.status(400).json({ error: "Nome e senha são obrigatórios" });
  }

  const existingUser = lista.find((user) => user.name === name);
  if (existingUser) {
    return res.status(409).json({ error: "Usuário já existe" });
  }

  const newUser: User = {
    id: uuidv4(),
    name,
    password,
  };

  lista.push(newUser);
  res.status(201).json({ message: "Usuário cadastrado com sucesso", user: newUser });
});

// Listar os usuários cadastrados
app.get("/usuarios", AuthGuard, (req, res) => {
  const usersWithoutPasswords = lista.map((user) => ({ id: user.id, name: user.name }));
  res.json(usersWithoutPasswords);
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log("Servidor rodando na porta 3000");
});
