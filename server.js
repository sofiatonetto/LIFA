const express = require('express');
const { Pool } = require('pg');
const multer = require('multer');
const path = require('path');

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'lifa',
  password: 'ahapaapa107',
  port: 5432,
});

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, `grade-${req.body.matricula}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage });

app.post('/cadastrar', upload.single('grade_foto'), async (req, res) => {
  const { nome, matricula, email, linha_pesquisa } = req.body;
  const grade_url = req.file ? req.file.filename : null;

  try {
    const query = `
      INSERT INTO bolsistas (nome, matricula, email, linha_pesquisa, grade_horario_url)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(query, [nome, matricula, email, linha_pesquisa, grade_url]);
    
    res.send('<h1>Sucesso! Bolsista cadastrado no banco.</h1><a href="/">Voltar</a>');
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao salvar no banco: ' + err.message);
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000');
});