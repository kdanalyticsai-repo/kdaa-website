from fastapi import APIRouter
from fastapi.responses import HTMLResponse

router = APIRouter()


@router.get("/api/cvproai/subscribe", response_class=HTMLResponse, include_in_schema=False)
async def cvproai_subscribe():
    """Razorpay checkout page for CVProAI Pro upgrades."""
    return """<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>CVProAI Pro – Upgrade</title>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;background:#f5f5f5;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:24px}
    .card{background:#fff;border-radius:16px;padding:40px 32px;max-width:420px;width:100%;box-shadow:0 4px 24px rgba(0,0,0,.08);text-align:center}
    .logo{font-size:40px;margin-bottom:16px}
    h1{font-size:22px;font-weight:700;color:#1a1a1a;margin-bottom:8px}
    .subtitle{color:#666;font-size:15px;margin-bottom:28px;line-height:1.5}
    .features{text-align:left;margin-bottom:28px;background:#f8f9ff;border-radius:12px;padding:16px}
    .feature{display:flex;align-items:center;gap:10px;padding:5px 0;font-size:14px;color:#333}
    .check{color:#22c55e;font-weight:700;font-size:16px}
    .pay-btn{width:100%;background:#4361EE;color:#fff;border:none;border-radius:12px;padding:16px;font-size:16px;font-weight:700;cursor:pointer;transition:opacity .2s}
    .pay-btn:hover{opacity:.9}
    .pay-btn:disabled{opacity:.6;cursor:not-allowed}
    .note{font-size:12px;color:#999;margin-top:16px;line-height:1.6}
    #success{display:none}
    #success .icon{font-size:48px;margin-bottom:16px}
    #success h2{color:#22c55e;font-size:24px;margin-bottom:12px}
    #success p{color:#555;font-size:15px;line-height:1.6}
  </style>
</head>
<body>
<div class="card">
  <div id="payment-view">
    <div class="logo">✦</div>
    <h1>Upgrade to CVProAI Pro</h1>
    <p class="subtitle">Unlimited AI coaching, job matches, and resume tools — all in one app.</p>
    <div class="features">
      <div class="feature"><span class="check">✓</span> Unlimited AI Career Coach chats</div>
      <div class="feature"><span class="check">✓</span> Unlimited interview prep</div>
      <div class="feature"><span class="check">✓</span> Unlimited job matches</div>
      <div class="feature"><span class="check">✓</span> 10 resume tailorings / month</div>
      <div class="feature"><span class="check">✓</span> Unlimited cover letters</div>
      <div class="feature"><span class="check">✓</span> Up to 5 resume uploads</div>
      <div class="feature"><span class="check">✓</span> Unlimited application tracking</div>
    </div>
    <button class="pay-btn" id="payBtn" onclick="startPayment()">
      Pay via UPI / Card / Net Banking
    </button>
    <p class="note">
      Powered by Razorpay &middot; Secure payment<br>
      After payment, return to the CVProAI app and pull down to refresh your profile.
    </p>
  </div>
  <div id="success">
    <div class="icon">🎉</div>
    <h2>Payment Successful!</h2>
    <p>
      Your CVProAI account has been upgraded to Pro.<br><br>
      Return to the app and pull down to refresh your profile —
      your Pro badge will appear within a minute.
    </p>
  </div>
</div>
<script>
  var p = new URLSearchParams(window.location.search);
  function startPayment() {
    var btn = document.getElementById('payBtn');
    btn.disabled = true;
    btn.textContent = 'Opening payment…';
    new Razorpay({
      key:      p.get('key'),
      order_id: p.get('order_id'),
      amount:   parseInt(p.get('amount') || '100'),
      currency: 'INR',
      name:     'CVProAI',
      description: 'Pro subscription — monthly',
      prefill:  { email: p.get('email') || '', name: p.get('name') || '' },
      notes:    { user_id: p.get('uid'), plan: 'pro' },
      theme:    { color: '#4361EE' },
      handler: function() {
        document.getElementById('payment-view').style.display = 'none';
        document.getElementById('success').style.display = 'block';
        setTimeout(function() { window.location.href = 'cvpilot://payment-success'; }, 2000);
      },
      modal: {
        ondismiss: function() {
          btn.disabled = false;
          btn.textContent = 'Pay via UPI / Card / Net Banking';
        }
      }
    }).open();
  }
</script>
</body>
</html>"""
