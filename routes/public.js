const express = require('express');
const pool = require('../db/database');

const router = express.Router();

router.get('/estatisticas', async (_req, res) => {
  try {
    const [usuarios, caronas, reservas] = await Promise.all([
      pool.query('SELECT COUNT(*) FROM usuarios WHERE NOT eh_admin'),
      pool.query("SELECT COUNT(*) FROM caronas WHERE status = 'ativa'"),
      pool.query("SELECT COUNT(*) FROM reservas WHERE status = 'confirmada'"),
    ]);

    return res.json({
      total_usuarios: Number.parseInt(usuarios.rows[0].count, 10),
      caronas_ativas: Number.parseInt(caronas.rows[0].count, 10),
      total_reservas: Number.parseInt(reservas.rows[0].count, 10),
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

module.exports = router;
