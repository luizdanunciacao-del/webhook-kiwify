const SUPABASE_URL = 'https://uzbklzxkjzjszytnhgju.supabase.co';
const SUPABASE_KEY = 'sb_publishable_jv-q1ZDE8EKGiJ8bUIamFg_sDpbDA0E';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      error: 'Método não permitido'
    });
  }

  try {
    const body = req.body || {};

    console.log('Kiwify:', body);

    const orderId = body.order_id || '';
    const email = body.Customer?.email || '';
    const produto = body.Product?.product_name || '';
    const nome = body.Customer?.full_name || '';
    const status = body.order_status || '';
    const valor = body.payment_merchant_id || body.price || body.amount || body.total || null;

    const visitorId =
      body.visitor_id ||
      body.tracking?.visitor_id ||
      body.checkout?.visitor_id ||
      body.params?.visitor_id ||
      body.metadata?.visitor_id ||
      '';

    const funil =
      body.funil ||
      body.tracking?.funil ||
      body.params?.funil ||
      '';

    const venda = {
      visitor_id: visitorId,
      email: email,
      produto: produto,
      valor: valor,
      status: status,
      order_id: String(orderId || Date.now()),
      funil: funil
    };

    console.log('DADOS PARA O SUPABASE:', venda);

    const resposta = await fetch(`${SUPABASE_URL}/rest/v1/funil_vendas`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal'
      },
      body: JSON.stringify(venda)
    });

    if (!resposta.ok) {
      const erro = await resposta.text();
      console.error('ERRO SUPABASE:', erro);

      return res.status(500).json({
        success: false,
        erro
      });
    }

    return res.status(200).json({
      success: true
    });

  } catch (e) {
    return res.status(500).json({
      success: false,
      error: e.message
    });
  }
}
