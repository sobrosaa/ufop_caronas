const express = require('express');
const pool = require('../db/database');
const { adminAuth } = require('../middleware/auth');

const router = express.Router();
router.use(adminAuth);

router.get('/relatorios', async (_req, res) => {
  try {
    const [usuarios, caronas, reservas, ativas, canceladas, concluidas] =
      await Promise.all([
        pool.query('SELECT COUNT(*) FROM usuarios WHERE NOT eh_admin'),
        pool.query('SELECT COUNT(*) FROM caronas'),
        pool.query("SELECT COUNT(*) FROM reservas WHERE status = 'confirmada'"),
        pool.query("SELECT COUNT(*) FROM caronas WHERE status = 'ativa'"),
        pool.query("SELECT COUNT(*) FROM caronas WHERE status = 'cancelada'"),
        pool.query("SELECT COUNT(*) FROM caronas WHERE status = 'concluida'"),
      ]);

    return res.json({
      total_usuarios: Number.parseInt(usuarios.rows[0].count, 10),
      total_caronas: Number.parseInt(caronas.rows[0].count, 10),
      total_reservas: Number.parseInt(reservas.rows[0].count, 10),
      caronas_ativas: Number.parseInt(ativas.rows[0].count, 10),
      caronas_canceladas: Number.parseInt(canceladas.rows[0].count, 10),
      caronas_concluidas: Number.parseInt(concluidas.rows[0].count, 10),
    });
  } catch (error) {
    console.error('Erro no relatório administrativo:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

router.get('/rotas', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT origem, destino, COUNT(*) AS total,
             SUM(CASE WHEN status = 'ativa' THEN 1 ELSE 0 END) AS ativas,
             SUM(CASE WHEN status = 'concluida' THEN 1 ELSE 0 END) AS concluidas
      FROM caronas
      GROUP BY origem, destino
      ORDER BY total DESC
      LIMIT 20
    `);
    return res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar rotas:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

router.get('/usuarios', async (_req, res) => {
  try {
    const { rows } = await pool.query(`
      SELECT u.id, u.nome, u.email, u.cidade_base, u.curso, u.criado_em,
             COUNT(DISTINCT c.id) AS caronas_oferecidas,
             COUNT(DISTINCT r.id) AS reservas_feitas
      FROM usuarios u
      LEFT JOIN caronas c ON c.motorista_id = u.id
      LEFT JOIN reservas r
        ON r.passageiro_id = u.id AND r.status = 'confirmada'
      WHERE NOT u.eh_admin
      GROUP BY u.id
      ORDER BY u.criado_em DESC
    `);
    return res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

module.exports = router;
