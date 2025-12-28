import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from 'fs';
import path from 'path';

// Initialize Gemini API
const genAI = new GoogleGenerativeAI("AIzaSyC6MA6NprkRCXCJhiJncyfoA28MRXlT6Gg");

export async function POST(req) {
    try {
        const { message, history } = await req.json();

        // 1. Load Product Data for Context
        const dbPath = path.join(process.cwd(), 'db.json');
        const dbData = fs.readFileSync(dbPath, 'utf8');
        const db = JSON.parse(dbData);
        const products = db.products;

        // 2. Create System Prompt with Context
        const productContext = products.map(p =>
            `- ${p.name} ($${p.price}): ${p.description} (Category: ${p.category}, Stock: ${p.stock})`
        ).join('\n');

        const systemPrompt = `
      أنت مساعد التسوق الذكي لمتجر المنتجات الغذائية.
      You are the friendly AI shopping assistant for our Food Market store.
      Our store offers fresh, high-quality food products including fruits, vegetables, dairy, meats, bakery items, beverages, and more.
      
      Your goal is to help customers find food products, answer questions about ingredients, provide dietary information, and ensure a pleasant shopping experience.
      
      Here is our current product inventory:
      ${productContext}
      
      Guidelines:
      - Be helpful, warm, and friendly like a local grocery store assistant.
      - You can respond in Arabic or English based on the user's language.
      - Use a welcoming tone (e.g., "أهلاً وسهلاً!", "بالتأكيد!", "Welcome!", "Great choice!").
      - If a user asks about a product we have, provide details, price, and suggest recipes or pairings.
      - If we don't have a product, suggest similar alternatives from our inventory.
      - Do NOT invent products that are not in the inventory list.
      - You can format prices with currency symbols.
      - If asked about delivery, say "نوفر توصيل سريع للمنازل - We offer fast home delivery."
      - If asked about freshness, say "جميع منتجاتنا طازجة يومياً - All our products are fresh daily."
      - If asked about returns/refunds, say "نقبل الإرجاع خلال 24 ساعة للمنتجات الغير مفتوحة - Returns accepted within 24 hours for unopened products."
      - Be knowledgeable about food storage tips, nutritional info, and cooking suggestions when relevant.
    `;

        // 3. Prepare Chat History for Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "مفهوم! أنا مساعدك الذكي لمتجر الأغذية، جاهز لمساعدتك في التسوق. Understood! I'm your Food Market assistant, ready to help you shop." }],
                },
                // Map previous history if needed, but simple context injection works well for stateless turns
                // For strictly following history given by client:
                ...history.slice(0, -1).map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }]
                }))
            ],
        });

        // 4. Generate Response
        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        return new Response(JSON.stringify({ reply: text }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Gemini API Error:', error);
        return new Response(JSON.stringify({ error: 'Failed to process request', details: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
