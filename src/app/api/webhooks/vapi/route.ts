import { NextRequest, NextResponse } from 'next/server';
import { ConversationService } from '../../../../lib/conversation-service';
import '../../../../lib/init-db';

export async function POST(request: NextRequest) {
  try {
    const webhookData = await request.json();
    
    console.log('Vapi webhook received:', JSON.stringify(webhookData, null, 2));

    // Extract conversation ID from metadata or call object
    const conversationId = webhookData.metadata?.conversationId || 
                          webhookData.call?.metadata?.conversationId;
    
    if (!conversationId) {
      console.error('No conversation ID found in webhook data:', {
        metadata: webhookData.metadata,
        call: webhookData.call
      });
      return NextResponse.json({ error: 'No conversation ID' }, { status: 400 });
    }

    console.log('Processing webhook for conversation ID:', conversationId);

    // Handle different webhook events
    switch (webhookData.type) {
      case 'end-of-call-report':
        console.log('Handling end-of-call-report');
        await handleCallEnd(conversationId, webhookData);
        break;
      case 'transcript':
        console.log('Transcript received for conversation:', conversationId);
        // Could store transcript if needed
        break;
      case 'status-update':
        console.log('Status update received:', webhookData.status);
        break;
      default:
        console.log('Unhandled webhook type:', webhookData.type);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error processing Vapi webhook:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function handleCallEnd(conversationId: number, webhookData: any) {
  try {
    console.log('Handling call end for conversation:', conversationId, 'with data:', webhookData);
    
    const { transcript, summary, endReason, duration, call, analysis } = webhookData;
    
    let callSummary = '';
    
    // Priority order: Vapi analysis summary > webhook summary > fallback
    if (analysis?.summary) {
      callSummary = analysis.summary;
      console.log('Using Vapi analysis summary:', callSummary);
    } else if (summary) {
      callSummary = summary;
      console.log('Using webhook summary:', callSummary);
    } else if (transcript) {
      // Use transcript directly or create a basic summary
      callSummary = `Call completed. Duration: ${Math.round((duration || 0) / 60)} minutes. End reason: ${endReason || 'Unknown'}. Full transcript available.`;
    } else {
      callSummary = `Call completed. Duration: ${Math.round((duration || 0) / 60)} minutes. End reason: ${endReason || 'Unknown'}.`;
    }

    console.log('Updating conversation summary:', callSummary);

    // Update the conversation with the summary
    const updatedConversation = await ConversationService.updateConversationSummary(conversationId, callSummary);
    
    console.log('Successfully updated conversation summary for ID:', conversationId, 'Result:', updatedConversation);

  } catch (error) {
    console.error('Error updating conversation summary:', error);
    // Try to update with a basic summary even if AI fails
    try {
      await ConversationService.updateConversationSummary(
        conversationId, 
        `Call completed with error: ${error.message}`
      );
    } catch (fallbackError) {
      console.error('Fallback summary update also failed:', fallbackError);
    }
  }
}
