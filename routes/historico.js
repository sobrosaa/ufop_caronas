const express = require('express');
const pool = require('../db/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const oferecidas = await pool.query(
      `SELECT c.*,
              COUNT(r.id) FILTER (WHERE r.status = 'confirmada') AS total_passageiros
       FROM caronas c
       LEFT JOIN reservas r ON r.carona_id = c.id
       WHERE c.motorista_id = $1
       GROUP BY c.id
       ORDER BY c.data_viagem DESC, c.horario DESC`,
      [req.usuario.id]
    );

    const reservadas = await pool.query(
      `SELECT c.*, u.nome AS motorista_nome,
              u.telefone AS motorista_telefone,
              r.id AS reserva_id, r.status AS reserva_status
       FROM reservas r
       JOIN caronas c ON c.id = r.carona_id
       JOIN usuarios u ON u.id = c.motorista_id
       WHERE r.passageiro_id = $1
       ORDER BY c.data_viagem DESC, c.horario DESC`,
      [req.usuario.id]
    );

    return res.json({
      oferecidas: oferecidas.rows,
      reservadas: reservadas.rows,
    });
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

module.exports = router;
