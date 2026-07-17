const express = require('express');
const pool = require('../db/database');
const { auth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  const { origem, destino, data, vagas_min } = req.query;
  let query = `
    SELECT c.*, u.nome AS motorista_nome,
           u.telefone AS motorista_telefone,
           u.curso AS motorista_curso
    FROM caronas c
    JOIN usuarios u ON u.id = c.motorista_id
    WHERE c.status = 'ativa'
      AND c.data_viagem >= CURRENT_DATE
      AND c.vagas_disponiveis > 0
  `;
  const params = [];

  if (origem) {
    params.push(`%${origem}%`);
    query += ` AND c.origem ILIKE $${params.length}`;
  }
  if (destino) {
    params.push(`%${destino}%`);
    query += ` AND c.destino ILIKE $${params.length}`;
  }
  if (data) {
    params.push(data);
    query += ` AND c.data_viagem = $${params.length}`;
  }
  if (vagas_min) {
    const vagas = Number.parseInt(vagas_min, 10);
    if (Number.isNaN(vagas) || vagas < 1) {
      return res.status(400).json({ erro: 'vagas_min inválido' });
    }
    params.push(vagas);
    query += ` AND c.vagas_disponiveis >= $${params.length}`;
  }

  query += ' ORDER BY c.data_viagem, c.horario';

  try {
    const { rows } = await pool.query(query, params);
    return res.json(rows);
  } catch (error) {
    console.error('Erro ao buscar caronas:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

router.get('/:id/passageiros', auth, async (req, res) => {
  try {
    const carona = await pool.query(
      'SELECT motorista_id FROM caronas WHERE id = $1',
      [req.params.id]
    );

    if (!carona.rows.length) {
      return res.status(404).json({ erro: 'Carona não encontrada' });
    }

    if (
      carona.rows[0].motorista_id !== req.usuario.id &&
      !req.usuario.eh_admin
    ) {
      return res.status(403).json({ erro: 'Sem permissão' });
    }

    const { rows } = await pool.query(
      `SELECT u.nome, u.email, u.telefone, u.curso,
              r.criado_em, r.id AS reserva_id
       FROM reservas r
       JOIN usuarios u ON u.id = r.passageiro_id
       WHERE r.carona_id = $1 AND r.status = 'confirmada'`,
      [req.params.id]
    );

    return res.json(rows);
  } catch (error) {
    console.error('Erro ao listar passageiros:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT c.*, u.nome AS motorista_nome,
              u.telefone AS motorista_telefone
       FROM caronas c
       JOIN usuarios u ON u.id = c.motorista_id
       WHERE c.id = $1`,
      [req.params.id]
    );

    if (!rows.length) {
      return res.status(404).json({ erro: 'Carona não encontrada' });
    }

    return res.json(rows[0]);
  } catch (error) {
    console.error('Erro ao buscar carona:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

router.post('/', auth, async (req, res) => {
  const {
    origem,
    destino,
    data_viagem,
    horario,
    vagas_total,
    valor_contribuicao,
    observacoes,
  } = req.body;

  const vagas = Number.parseInt(vagas_total, 10);
  if (!origem || !destino || !data_viagem || !horario || !vagas_total) {
    return res
      .status(400)
      .json({ erro: 'Preencha todos os campos obrigatórios' });
  }
  if (Number.isNaN(vagas) || vagas < 1) {
    return res.status(400).json({ erro: 'Número de vagas inválido' });
  }

  const dataHora = new Date(`${data_viagem}T${horario}`);
  if (Number.isNaN(dataHora.getTime()) || dataHora <= new Date()) {
    return res.status(400).json({ erro: 'Informe uma data e horário futuros' });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO caronas
        (motorista_id, origem, destino, data_viagem, horario,
         vagas_total, vagas_disponiveis, valor_contribuicao, observacoes)
       VALUES ($1, $2, $3, $4, $5, $6, $6, $7, $8)
       RETURNING *`,
      [
        req.usuario.id,
        origem.trim(),
        destino.trim(),
        data_viagem,
        horario,
        vagas,
        valor_contribuicao || 0,
        observacoes?.trim() || null,
      ]
    );

    return res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Erro ao criar carona:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { rows } = await client.query(
      'SELECT * FROM caronas WHERE id = $1 FOR UPDATE',
      [req.params.id]
    );

    if (!rows.length) {
      await client.query('ROLLBACK');
      return res.status(404).json({ erro: 'Carona não encontrada' });
    }

    if (rows[0].motorista_id !== req.usuario.id && !req.usuario.eh_admin) {
      await client.query('ROLLBACK');
      return res.status(403).json({ erro: 'Sem permissão' });
    }

    if (rows[0].status !== 'ativa') {
      await client.query('ROLLBACK');
      return res.status(400).json({ erro: 'A carona não está ativa' });
    }

    await client.query(
      "UPDATE caronas SET status = 'cancelada' WHERE id = $1",
      [req.params.id]
    );
    await client.query(
      "UPDATE reservas SET status = 'cancelada' WHERE carona_id = $1 AND status = 'confirmada'",
      [req.params.id]
    );

    await client.query('COMMIT');
    return res.json({ mensagem: 'Carona cancelada' });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Erro ao cancelar carona:', error);
    return res.status(500).json({ erro: 'Erro interno' });
  } finally {
    client.release();
  }
});

module.exports = router;
