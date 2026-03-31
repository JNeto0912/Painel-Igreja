const bcrypt = require('bcryptjs');

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10); // O '10' é o saltRounds
  console.log(`Senha original: ${password}`);
  console.log(`Hash gerado: ${hash}`);
}

hashPassword('igreja123');