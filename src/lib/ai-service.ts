import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class AIService {
  static async generateConversationSummary(transcript: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a medical assistant that summarizes pharmacy patient calls. 
            Extract key information about:
            1. Delivery availability and timing
            2. Medication changes or issues
            3. Problems with previous shipments
            4. Any other important patient feedback
            
            Keep the summary concise but comprehensive, focusing on actionable information for the pharmacist.`
          },
          {
            role: "user",
            content: `Please summarize this pharmacy patient call transcript:\n\n${transcript}`
          }
        ],
        temperature: 0.3,
        max_tokens: 500
      });

      return completion.choices[0]?.message?.content || 'Summary generation failed';
    } catch (error) {
      console.error('Error generating AI summary:', error);
      return 'AI summary generation failed';
    }
  }

  static async extractKeyInformation(transcript: string): Promise<{
    deliveryTime?: string;
    medicationChanges?: string;
    shipmentIssues?: string;
    otherNotes?: string;
  }> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Extract structured information from a pharmacy patient call transcript. 
            Return a JSON object with these fields:
            - deliveryTime: When the patient will be available for delivery
            - medicationChanges: Any changes to medication needs or dosages
            - shipmentIssues: Problems with previous shipments
            - otherNotes: Any other important information
            
            If a field doesn't apply, set it to null.`
          },
          {
            role: "user",
            content: `Extract information from this transcript:\n\n${transcript}`
          }
        ],
        temperature: 0.2,
        response_format: { type: "json_object" }
      });

      const content = completion.choices[0]?.message?.content;
      return content ? JSON.parse(content) : {};
    } catch (error) {
      console.error('Error extracting key information:', error);
      return {};
    }
  }
}
