import pool from './db';

export interface Conversation {
  call_id: number;
  date: string;
  patient_name: string;
  phone_number: string;
  summary: string;
  vapi_call_id?: string;
}

export class ConversationService {
  static async createConversation(
    patientName: string,
    phoneNumber: string,
    summary: string = '',
    vapiCallId?: string
  ): Promise<Conversation> {
    const query = `
      INSERT INTO conversations (patient_name, phone_number, summary, vapi_call_id)
      VALUES ($1, $2, $3, $4)
      RETURNING call_id, date, patient_name, phone_number, summary, vapi_call_id
    `;
    
    const values = [patientName, phoneNumber, summary, vapiCallId];
    const result = await pool.query(query, values);
    
    return result.rows[0];
  }

  static async getAllConversations(): Promise<Conversation[]> {
    const query = `
      SELECT call_id, date, patient_name, phone_number, summary, vapi_call_id
      FROM conversations
      ORDER BY date DESC
    `;
    
    const result = await pool.query(query);
    return result.rows;
  }

  static async getConversationById(callId: number): Promise<Conversation | null> {
    const query = `
      SELECT call_id, date, patient_name, phone_number, summary, vapi_call_id
      FROM conversations
      WHERE call_id = $1
    `;
    
    const result = await pool.query(query, [callId]);
    return result.rows[0] || null;
  }

  static async updateConversationSummary(callId: number, summary: string): Promise<Conversation> {
    const query = `
      UPDATE conversations
      SET summary = $2
      WHERE call_id = $1
      RETURNING call_id, date, patient_name, phone_number, summary, vapi_call_id
    `;
    
    const result = await pool.query(query, [callId, summary]);
    return result.rows[0];
  }

  static async updateVapiCallId(callId: number, vapiCallId: string): Promise<Conversation> {
    const query = `
      UPDATE conversations
      SET vapi_call_id = $2
      WHERE call_id = $1
      RETURNING call_id, date, patient_name, phone_number, summary, vapi_call_id
    `;
    
    const result = await pool.query(query, [callId, vapiCallId]);
    return result.rows[0];
  }
}
