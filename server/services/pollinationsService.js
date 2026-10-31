const axios = require('axios');
const FormData = require('form-data');

// Style prompt enhancers
const stylePrompts = {
  realistic: 'photorealistic, ultra detailed, 8k resolution, professional photography, sharp focus',
  anime: 'anime style, manga art, vibrant colors, Studio Ghibli inspired, detailed illustration',
  '3d': '3D render, octane render, cinema 4D, volumetric lighting, ray tracing, highly detailed',
  cartoon: 'cartoon style, colorful, flat design, comic book art, bold outlines, vibrant',
  cyberpunk: 'cyberpunk aesthetic, neon lights, futuristic city, dark atmosphere, blade runner style',
  fantasy: 'fantasy art, magical, ethereal, epic, detailed world-building, concept art',
  abstract: 'abstract art, surreal, artistic, creative, modern art, digital painting',
};

const enhancePrompt = (prompt, style) => {
  const styleEnhancer = stylePrompts[style] || stylePrompts.realistic;
  return `${prompt}, ${styleEnhancer}, masterpiece, best quality`;
};

/**
 * Generate image using Clipdrop API (text-to-image)
 */
const generateImage = async (prompt, style = 'realistic', width = 1024, height = 1024) => {
  const enhancedPrompt = enhancePrompt(prompt, style);

  const form = new FormData();
  form.append('prompt', enhancedPrompt);

  const response = await axios.post(
    'https://clipdrop-api.co/text-to-image/v1',
    form,
    {
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY,
        ...form.getHeaders(),
      },
      responseType: 'arraybuffer',
      timeout: 60000,
    }
  );

  // Convert binary image to base64 data URL
  const base64 = Buffer.from(response.data).toString('base64');
  const imageUrl = `data:image/png;base64,${base64}`;

  return {
    success: true,
    imageUrl,
    enhancedPrompt,
  };
};

module.exports = { generateImage, enhancePrompt };
