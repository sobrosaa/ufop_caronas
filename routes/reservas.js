const express = require('express');
const pool = require('../db/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  const { carona_id } = req.body;
  if (!carona_id) {
    return res.status(400).json({ erro: 'carona_id é obrigatório' });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const carona = await client.query(
      'SELECT * FROM caronas WHERE id = $1 FOR UPDATE',
      [carona_id]
    );

    if (!carona.rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ erro: 'Carona não encontrada' });
    }

    const dadosCarona = carona.rows[0];
    if (dadosCarona.status !== 'ativa') {
      await client.query('ROLLBACK');
      return res.status(400).json({ erro: 'Carona não está ativa' });
    }
    if (dadosCarona.vagas_disponiveis <= 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ erro: 'Sem vagas disponíveis' });
    }
    if (dadosCarona.motorista_id === req.usuario.id) {
      await client.query('ROLLBACK');
      return res
        .status(400)
        .json({ erro: 'Motorista não pode reservar sua própria carona' });
    }

    const existente = await client.query(
      'SELECT * FROM reservas WHERE passageiro_id = $1 AND carona_id = $2',
      [req.usuario.id, carona_id]
    );

    if (existente.rows[0]?.status === 'confirmada') {
      await client.query('ROLLBACK');
      return res
        .status(409)
        .json({ erro: 'Você já tem uma reserva nesta carona' });
    }

    let reserva;
    if (existente.rows.length) {
      const resultado = await client.query(
        `UPDATE reservas
         SET status = 'confirmada', criado_em = CURRENT_TIMESTAMP
         WHERE id = $1
         RETURNING *`,
        [existente.rows[0].id]
      );
      reserva = resultado.rows[0];
    } else {
      const resultado = await client.query(
        `INSERT INTO reservas (passageiro_id, carona_id)
         VALUES ($1, $2)
         RETURNING *`,
        [req.usuario.id, carona_id]
      );
      reserva = resultado.rows[0];
    }

    await client.query('COMMIT');
    return res.status(201).json(reserva);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao realizar reserva:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  } finally {
    client.release();
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM reservas WHERE id = $1',
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ erro: 'Reserva não encontrada' });
    }

    if (rows[0].passageiro_id !== req.usuario.id && !req.usuario.eh_admin) {
      return res.status(403).json({ erro: 'Sem permissão' });
    }

    if (rows[0].status === 'cancelada') {
      return res.status(400).json({ erro: 'Reserva já cancelada' });
    }

    await pool.query(
      "UPDATE reservas SET status = 'cancelada' WHERE id = $1",
      [req.params.id]
    );
    return res.json({ mensagem: 'Reserva cancelada' });
  } catch (error) {
    console.error('Erro ao cancelar reserva:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

module.exports = router;
