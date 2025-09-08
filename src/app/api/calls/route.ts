import { NextRequest, NextResponse } from 'next/server';
import { ConversationService } from '../../../lib/conversation-service';
import '../../../lib/init-db';

// Vapi configuration
const VAPI_API_KEY = process.env.VAPI_API_KEY;
const ASSISTANT_ID = '16d2110f-8f97-43b9-9725-9085f58add56';
const PHONE_NUMBER_ID = '5c123f0d-ffb6-4065-8f69-e5eec1f4ef20';

export async function POST(request: NextRequest) {
  try {
    const { patientName, phoneNumber } = await request.json();

    if (!patientName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Patient name and phone number are required' },
        { status: 400 }
      );
    }

    if (!VAPI_API_KEY) {
      return NextResponse.json(
        { error: 'Vapi API key not configured' },
        { status: 500 }
      );
    }

    // Create conversation record in database
    const conversation = await ConversationService.createConversation(
      patientName,
      phoneNumber,
      'Call initiated - summary will be updated after call completion'
    );

    // Make the actual call using Vapi
    const callResponse = await fetch('https://api.vapi.ai/call', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${VAPI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        assistantId: ASSISTANT_ID,
        phoneNumberId: PHONE_NUMBER_ID,
        customer: {
          number: phoneNumber,
          name: patientName
        },
        metadata: {
          conversationId: conversation.call_id,
          patientName: patientName
        }
      }),
    });

    if (!callResponse.ok) {
      const errorData = await callResponse.json();
      console.error('Vapi call failed:', errorData);
      
      // Update conversation with error status
      await ConversationService.updateConversationSummary(
        conversation.call_id,
        `Call failed: ${errorData.message || 'Unknown error'}`
      );

      return NextResponse.json(
        { error: 'Failed to initiate call with Vapi' },
        { status: 500 }
      );
    }

    const callData = await callResponse.json();
    console.log('Vapi call initiated successfully:', callData);

    // Update the conversation with the Vapi call ID
    await ConversationService.updateVapiCallId(conversation.call_id, callData.id);

    return NextResponse.json({
      success: true,
      callId: conversation.call_id,
      vapiCallId: callData.id,
      message: 'Call initiated successfully with Vapi'
    });

  } catch (error) {
    console.error('Error initiating call:', error);
    return NextResponse.json(
      { error: 'Failed to initiate call' },
      { status: 500 }
    );
  }
}
