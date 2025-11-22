import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { subject, content, sender } = await request.json();

    if (!subject || !content || !sender) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const prompt = `
      Tu es un assistant exécutif expert. Analyse cet email.
      Expéditeur: ${sender}
      Sujet: ${subject}
      Contenu: ${content}

      Tâche :
      1. Catégorise l'email (Urgent, Devis, Facture, Newsletter, Personnel, Autre).
      2. Donne un score d'urgence de 0 à 100.
      3. Résume l'email en une phrase.
      4. Suggère une réponse courte si nécessaire.
      
      Réponds UNIQUEMENT au format JSON avec les clés: category, urgency_score, summary, suggested_reply
    `;

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Tu es une API JSON stricte.' },
        { role: 'user', content: prompt },
      ],
      response_format: { type: 'json_object' },
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error analyzing email:', error);
    return NextResponse.json(
      { error: 'Failed to analyze email' },
      { status: 500 }
    );
  }
}
