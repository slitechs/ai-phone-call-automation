import { NextRequest, NextResponse } from 'next/server';
import { ConversationService } from '../../../lib/conversation-service';
import '../../../lib/init-db';

export async function POST(request: NextRequest) {
  try {
    const { patientName, phoneNumber } = await request.json();

    if (!patientName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Patient name and phone number are required' },
        { status: 400 }
      );
    }

    // Create conversation record in database
    const conversation = await ConversationService.createConversation(
      patientName,
      phoneNumber,
      'Call initiated - summary will be updated after call completion'
    );

    // TODO: Integrate with Vapi to make the actual call
    // For now, we'll simulate a successful call
    console.log('Call initiated:', { 
      callId: conversation.call_id, 
      patientName, 
      phoneNumber 
    });

    return NextResponse.json({
      success: true,
      callId: conversation.call_id,
      message: 'Call initiated successfully'
    });

  } catch (error) {
    console.error('Error initiating call:', error);
    return NextResponse.json(
      { error: 'Failed to initiate call' },
      { status: 500 }
    );
  }
}
