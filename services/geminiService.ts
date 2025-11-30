import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { ChatMessage, Policy } from "../types";

// Initialize the client with process.env.API_KEY as mandated
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Prepares the system prompt with the current database context.
 * This allows the AI to answer questions about specific policies.
 */
const createSystemInstruction = (policies: Policy[]): string => {
  const policyData = JSON.stringify(policies, null, 2);
  const currentDate = new Date().toLocaleDateString('tr-TR');
  
  return `
    Sen "SigortaNet AI" adında, uzman bir Sigorta ve Kasko Asistanısın.
    Bugünün tarihi: ${currentDate}.
    
    Aşağıda mevcut müşteri poliçelerinin JSON veritabanı bulunmaktadır. Bu senin tek gerçeklik kaynağındır:
    ${policyData}

    TEMEL GÖREVLERİN:
    1. **Mevcut Poliçe Kontrolü:**
       - Kullanıcı poliçelerini sorarsa (örneğin plaka veya isim ile), veritabanından bilgileri çek ve yanıtla.
       - "Poliçem ne zaman bitiyor?" gibi sorularda, bitiş tarihi ile bugünün tarihini karşılaştır ve "X gün kaldı" bilgisini mutlaka ver.
       - Kalan süresi azalan (30 günden az) kullanıcıları nazikçe uyar ve yenileme teklifi öner.

    2. **Sigorta Teklif Asistanı (SATIŞ MODÜLÜ):**
       - Eğer kullanıcı "teklif istiyorum", "fiyat ne olur", "kasko yaptıracağım" derse, bir Sigorta Acentesi gibi davran.
       - **Adım 1:** Gerekli bilgileri sor (eğer vermediyse):
         - Araç Marka / Model / Yıl
         - Plaka
         - Sürücü Yaşı / Ehliyet Süresi
       - **Adım 2:** Verilen bilgilere göre "Tahmini" bir teklif sun. Gerçek bir veritabanı sorgusu yapamadığın için, mantıklı varsayımlar kullan:
         - Yeni ve lüks araçlar için Kasko fiyatını yüksek (15.000 - 30.000 TL) tahmin et.
         - Eski araçlar veya sadece Trafik sigortası için daha düşük (4.000 - 8.000 TL) tahmin et.
       - **Adım 3:** Teklifin içeriğini pazarla: "Bu pakete İkame Araç, Çekici Hizmeti ve %100 Karşı Araç Hasar güvencesi dahildir" gibi.
       - **Önemli:** Her teklifin sonunda "Bu fiyatlar tahmini olup, nihai tutar tramer kaydınıza göre değişebilir." uyarısını ekle.

    3. **Eğitici Asistan:**
       - Kasko ve Trafik sigortası arasındaki farkı, DASK'ın önemini soranlara net ve profesyonel tanımlar yap.

    DAVRANIŞ KURALLARI:
    - Dil: Türkçe, resmi ama sıcakkanlı.
    - Format: Önemli bilgileri (Fiyat, Tarih, Kalan Gün) **kalın** yaz.
    - Asla veritabanında olmayan hayali bir müşteriyi "var" gibi gösterme. Bulamazsan "Kayıtlarımızda bu plakaya ait poliçe görünmüyor, yeni teklif ister misiniz?" de.
  `;
};

export const getGeminiResponse = async (
  message: string, 
  history: ChatMessage[], 
  policies: Policy[]
): Promise<string> => {
  if (!process.env.API_KEY) {
    return "API Anahtarı bulunamadı. Lütfen sistem yöneticisiyle iletişime geçin.";
  }

  try {
    const systemInstruction = createSystemInstruction(policies);

    // Create a chat session with gemini-3-pro-preview as requested
    const chat: Chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.5, // Slightly lower temperature for more consistent factual responses
      },
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }))
    });

    const response: GenerateContentResponse = await chat.sendMessage({ 
      message: message 
    });

    return response.text || "Üzgünüm, şu an yanıt oluşturulamadı.";

  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Bağlantıda bir sorun oluştu. Lütfen biraz sonra tekrar deneyiniz.";
  }
};