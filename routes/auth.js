const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

function gerarToken(usuario) {
  return jwt.sign(usuario, process.env.JWT_SECRET, { expiresIn: '7d' });
}

function opcoesCookie() {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

router.post('/register', async (req, res) => {
  const { nome, email, senha, cidade_base, curso, telefone } = req.body;

  if (!nome || !email || !senha || !cidade_base) {
    return res
      .status(400)
      .json({ erro: 'Preencha todos os campos obrigatórios' });
  }

  if (senha.length < 6) {
    return res.status(400).json({ erro: 'A senha deve ter pelo menos 6 caracteres' });
  }

  try {
    const existe = await pool.query(
      'SELECT id FROM usuarios WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (existe.rows.length) {
      return res.status(409).json({ erro: 'E-mail já cadastrado' });
    }

    const hash = await bcrypt.hash(senha, 10);
    const { rows } = await pool.query(
      `INSERT INTO usuarios
        (nome, email, senha_hash, cidade_base, curso, telefone)
       VALUES ($1, LOWER($2), $3, $4, $5, $6)
       RETURNING id, nome, email, cidade_base, curso, telefone, eh_admin`,
      [
        nome.trim(),
        email.trim(),
        hash,
        cidade_base.trim(),
        curso?.trim() || null,
        telefone?.trim() || null,
      ]
    );

    const usuario = rows[0];
    const token = gerarToken({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      cidade_base: usuario.cidade_base,
      eh_admin: usuario.eh_admin,
    });

    res.cookie('token', token, opcoesCookie());
    return res.status(201).json({ usuario, token });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

router.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ erro: 'E-mail e senha são obrigatórios' });
  }

  try {
    const { rows } = await pool.query(
      'SELECT * FROM usuarios WHERE LOWER(email) = LOWER($1)',
      [email.trim()]
    );

    if (!rows.length) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const senhaCorreta = await bcrypt.compare(senha, rows[0].senha_hash);
    if (!senhaCorreta) {
      return res.status(401).json({ erro: 'Credenciais inválidas' });
    }

    const usuario = {
      id: rows[0].id,
      nome: rows[0].nome,
      email: rows[0].email,
      cidade_base: rows[0].cidade_base,
      eh_admin: rows[0].eh_admin,
    };
    const token = gerarToken(usuario);

    res.cookie('token', token, opcoesCookie());
    return res.json({ usuario, token });
  } catch (error) {
    console.error('Erro no login:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

router.post('/logout', (_req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
  return res.json({ mensagem: 'Logout realizado' });
});

router.get('/me', auth, (req, res) => {
  res.json({ usuario: req.usuario });
});

module.exports = router;
