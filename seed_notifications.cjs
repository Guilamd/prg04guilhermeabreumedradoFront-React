const https = require('https');

const host = 'prg04guilhermeabreumedradoback-end.onrender.com';

const options = {
  hostname: host,
  path: '/usuarios',
  method: 'GET'
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    let usuarios = [];
    try {
        usuarios = JSON.parse(data);
    } catch (e) {
        console.error("Falha ao ler usuarios");
        return;
    }
    
    if (!usuarios || usuarios.length === 0) {
      console.log("Nenhum usuário encontrado na API para associar a notificação.");
      return;
    }
    const userId = usuarios[0].id; // Vamos associar ao primeiro usuário
    console.log(`Usuário selecionado: ${userId}`);

    const notificacoes = [
      {
        mensagem: "Sua fatura do cartão Mercado Pago vence no dia 15. Evite juros!",
        dataEnvio: new Date(new Date().getTime() - 2 * 60 * 60 * 1000).toISOString(),
        lido: false,
        usuarioId: userId
      },
      {
        mensagem: "Você recebeu um PIX de R$ 250,00.",
        dataEnvio: new Date(new Date().getTime() - 24 * 60 * 60 * 1000).toISOString(),
        lido: false,
        usuarioId: userId
      }
    ];

    notificacoes.forEach(notif => {
      const postData = JSON.stringify(notif);
      const postReq = https.request({
        hostname: host,
        path: '/notificacoes',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      }, (postRes) => {
        console.log(`Notificação criada, Status: ${postRes.statusCode}`);
      });
      postReq.on('error', console.error);
      postReq.write(postData);
      postReq.end();
    });
  });
});
req.on('error', console.error);
req.end();
