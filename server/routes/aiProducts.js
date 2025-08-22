// server/routes/aiProducts.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

const router = express.Router();

// __dirname workaround not needed in CommonJS
const tmpDir = path.join(__dirname, '../tmp');
fs.mkdirSync(tmpDir, { recursive: true });

async function checkTogetherAPI() {
  const res = await fetch('https://api.together.xyz/v1/images/generations', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'black-forest-labs/FLUX.1-schnell-Free',
      prompt: 'Test image',
      width: 1,
      height: 1,
      steps: 1,
      n: 1,
      response_format: 'url',
    }),
  });

  if (!res.ok) throw new Error(await res.text());
  const data = await res.json();
  if (!data.generations) throw new Error('Together API returned no generations');
  return true;
}

// Dummy AI product info
router.get('/info', (req, res) => {
  res.json([
    { name: 'AI T-Shirt', price: 19.99 },
    { name: 'AI Mug', price: 9.99 },
  ]);
});

// Generate product + image
router.get('/', async (req, res) => {
  try {
    await checkTogetherAPI();

    const aiProductRes = await fetch('http://localhost:5001/api/ai-products/info');
    const aiProducts = await aiProductRes.json();
    const product = aiProducts[0];

    const fluxRes = await fetch('https://api.together.xyz/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TOGETHER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'black-forest-labs/FLUX.1-schnell-Free',
        prompt: `Product image for: ${product.name}`,
        width: 512,
        height: 512,
        steps: 28,
        n: 1,
        response_format: 'url',
      }),
    });

    const fluxData = await fluxRes.json();
    const imageUrl = fluxData.generations[0].url;

    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    const fileName = `ai-product-${Date.now()}.png`;
    const filePath = path.join(tmpDir, fileName);

    fs.writeFileSync(filePath, Buffer.from(imageBuffer));

    res.json({
      name: product.name,
      price: product.price,
      imagePath: `/tmp/${fileName}`, // served statically
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'AI generation failed', error: err.message });
  }
});

module.exports = router;
