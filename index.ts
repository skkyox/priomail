import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeEmail(subject: string, content: string, sender: string) {
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
    
    Réponds UNIQUEMENT au format JSON.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Tu es une API JSON stricte." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error("No response content from OpenAI");
    }
    
    const result = JSON.parse(content);
    return result;
  } catch (error) {
    console.error("Error analyzing email:", error);
    throw error;
  }
}

// Email worker for processing inbox

export interface DecryptOptions {
  password: string;
}

export function decrypt(encrypted: string): string {
  // Placeholder implementation - in production, use proper encryption
  return encrypted;
}

export async function processInbox(userAccount: any) {
  try {
    // Note: Requires proper IMAP setup with encrypted credentials
    // This is a template function - implement based on your email provider
    console.log(`Processing inbox for account: ${userAccount.email}`);
    
    // In production, you would:
    // 1. Establish IMAP connection
    // 2. Fetch unread messages
    // 3. Parse and analyze with AI
    // 4. Store results in database
    
    return { success: true, message: "Inbox processing started" };
  } catch (error) {
    console.error("Error processing inbox:", error);
    throw error;
  }
}

// Dashboard component (React/Next.js)
export async function getDashboardData(supabaseClient: any) {
  try {
    const { data: emails, error } = await supabaseClient
      .from('emails')
      .select('*')
      .order('ai_urgency_score', { ascending: false })
      .limit(50);

    if (error) {
      console.error("Error fetching emails:", error);
      return { emails: [] };
    }

    return { emails: emails || [] };
  } catch (error) {
    console.error("Error in getDashboardData:", error);
    throw error;
  }
}
