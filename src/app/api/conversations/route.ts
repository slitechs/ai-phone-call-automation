import { NextResponse } from 'next/server';
import { ConversationService } from '../../../lib/conversation-service';
import '../../../lib/init-db';

export async function GET() {
  try {
    const conversations = await ConversationService.getAllConversations();
    
    // Transform database format to frontend format
    const formattedConversations = conversations.map(conv => ({
      callId: conv.call_id,
      date: conv.date,
      patientName: conv.patient_name,
      phoneNumber: conv.phone_number,
      summary: conv.summary
    }));

    return NextResponse.json({
      conversations: formattedConversations
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
