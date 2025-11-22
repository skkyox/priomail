import OpenAI from 'openai';
import { env } from './config';

const openai = new OpenAI({
  apiKey: env.openai.apiKey,
});

export async function analyzeEmail(subject: string, content: string, sender: string) {
  try {
    const prompt = `
Tu es un assistant exécutif expert en gestion des emails. Analyse cet email entrant avec précision.

Expéditeur: ${sender}
Sujet: ${subject}
Contenu: ${content}

Effectue les tâches suivantes:
1. Catégorise l'email (Urgent, Devis, Facture, Newsletter, Personnel, Autre)
2. Donne un score d'urgence de 0 à 100
3. Résume l'email en une phrase courte
4. Analyse le sentiment (Positif, Négatif, Neutre)
5. Suggère une réponse courte si pertinent

Réponds UNIQUEMENT en JSON valide avec les clés: category, urgency_score, summary, sentiment, suggested_reply
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Tu es une API JSON stricte. Retourne UNIQUEMENT du JSON valide.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 500,
    });

    const content_result = response.choices[0].message.content;
    if (!content_result) {
      throw new Error('No response from OpenAI');
    }

    const result = JSON.parse(content_result);
    
    return {
      category: result.category || 'Autre',
      urgency_score: Math.min(100, Math.max(0, result.urgency_score || 50)),
      summary: result.summary || 'Email non analysé',
      sentiment: result.sentiment || 'Neutre',
      suggested_reply: result.suggested_reply || '',
    };
  } catch (error) {
    console.error('Error analyzing email:', error);
    return {
      category: 'Autre',
      urgency_score: 50,
      summary: 'Erreur lors de l\'analyse',
      sentiment: 'Neutre',
      suggested_reply: '',
    };
  }
}

export async function generateSmartReply(emailContent: string, category: string) {
  try {
    const prompt = `Tu es un assistant professionnel qui rédige des réponses d'email courtes et appropriées.
Catégorie: ${category}
Email reçu: ${emailContent}

Rédige une réponse professionnelle brève (2-3 phrases max).`;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0].message.content || '';
  } catch (error) {
    console.error('Error generating reply:', error);
    return '';
  }
}
