import { NextRequest, NextResponse } from 'next/server';
import { ConversationService } from '../../../lib/conversation-service';
import { AIService } from '../../../lib/ai-service';
import '../../../lib/init-db';

export async function POST(request: NextRequest) {
  try {
    const { callId, transcript } = await request.json();

    if (!callId) {
      return NextResponse.json(
        { error: 'Call ID is required' },
        { status: 400 }
      );
    }

    // Generate AI summary
    let summary = 'Test summary generated';
    if (transcript) {
      try {
        summary = await AIService.generateConversationSummary(transcript);
      } catch (error) {
        console.error('AI summary generation failed:', error);
        summary = `Call completed. Transcript: ${transcript.substring(0, 200)}...`;
      }
    }

    // Update the conversation
    const updatedConversation = await ConversationService.updateConversationSummary(callId, summary);

    return NextResponse.json({
      success: true,
      conversation: updatedConversation,
      summary: summary
    });

  } catch (error) {
    console.error('Error in test webhook:', error);
    return NextResponse.json(
      { error: 'Test webhook failed' },
      { status: 500 }
    );
  }
}
