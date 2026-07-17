const jwt = require('jsonwebtoken');

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET não definido');
  return secret;
}

function auth(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Não autenticado' });
  }

  try {
    req.usuario = jwt.verify(token, getJwtSecret());
    return next();
  } catch {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

function adminAuth(req, res, next) {
  return auth(req, res, () => {
    if (!req.usuario.eh_admin) {
      return res.status(403).json({ erro: 'Acesso negado' });
    }
    return next();
  });
}

module.exports = { auth, adminAuth };
