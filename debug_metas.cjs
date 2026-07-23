const https = require('https');
const host = 'prg04guilhermeabreumedradoback-end.onrender.com';

function fetch(path) {
  return new Promise((resolve) => {
    https.get({ host, path }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
  });
}

async function run() {
  const transacoes = await fetch('/transacoes?size=100');
  const metas = await fetch('/metas-orcamento');
  
  console.log("=== TRANSACOES ===");
  transacoes.content.forEach(t => {
    console.log(`[${t.id}] ${t.titulo} - Categoria ID: ${t.categoriaId} (${t.categoriaNome})`);
  });

  console.log("\n=== METAS ===");
  metas.forEach(m => {
    console.log(`[${m.id}] Meta: ${m.categoriaNome} - Categoria ID: ${m.categoriaId}`);
  });
}

run();
