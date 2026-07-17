require('dotenv').config();

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET não definido');
}

const pool = require('./db/database');
const authRoutes = require('./routes/auth');
const caronasRoutes = require('./routes/caronas');
const reservasRoutes = require('./routes/reservas');
const historicoRoutes = require('./routes/historico');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public', 'pages')));

app.get('/', (_req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

app.get('/api/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ status: 'ok', banco: 'conectado' });
  } catch (error) {
    console.error('Erro de conexão com o PostgreSQL:', error.message);
    return res.status(503).json({
      status: 'erro',
      banco: 'desconectado',
      detalhe: 'Confira DATABASE_URL e se o PostgreSQL está em execução',
    });
  }
});

app.use('/api/auth', authRoutes);
app.use('/api/caronas', caronasRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/historico', historicoRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);

app.use('/api', (_req, res) => {
  res.status(404).json({ erro: 'Rota da API não encontrada' });
});

app.listen(PORT, () => {
  console.log(`\n🚗 UFOP Caronas rodando em http://localhost:${PORT}\n`);
});
