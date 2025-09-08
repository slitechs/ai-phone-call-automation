import { NextResponse } from 'next/server';
import { ConversationService } from '../../../lib/conversation-service';
import '../../../lib/init-db';

const VAPI_API_KEY = process.env.VAPI_API_KEY;

export async function POST() {
  try {
    if (!VAPI_API_KEY) {
      return NextResponse.json(
        { error: 'Vapi API key not configured' },
        { status: 500 }
      );
    }

    // Get all conversations that still have the default "Call initiated" summary
    const conversations = await ConversationService.getAllConversations();
    
    const updatedConversations = [];
    
      for (const conv of conversations) {
          try {
            // Use the stored Vapi call ID
            const vapiCallId = conv.vapi_call_id;
            
            // Try to fetch the call details from Vapi to get the actual summary
            const vapiResponse = await fetch(`https://api.vapi.ai/call/${vapiCallId}`, {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${VAPI_API_KEY}`,
                'Content-Type': 'application/json',
              },
            });

          if (vapiResponse.ok) {
            const callData = await vapiResponse.json();

            if (callData.analysis?.summary) {
              // Use the actual Vapi summary
              const updated = await ConversationService.updateConversationSummary(
                conv.call_id, 
                callData.analysis.summary
              );
              updatedConversations.push(updated);
              console.log(`Updated conversation ${conv.call_id} with Vapi summary`);
            } else {
              // Fallback to a basic summary if no Vapi summary available
              const fallbackSummary = `New Call completed. Patient: ${conv.patient_name}. Phone: ${conv.phone_number}. No detailed summary available from Vapi (call may have been too short).`;
              const updated = await ConversationService.updateConversationSummary(
                conv.call_id, 
                fallbackSummary
              );
              updatedConversations.push(updated);
              console.log(`Updated conversation ${conv.call_id} with fallback summary`);
            }
          } else {
            // If Vapi API fails, use a basic summary
            const fallbackSummary = `Call completed. Patient: ${conv.patient_name}. Phone: ${conv.phone_number}. Unable to fetch summary from Vapi.`;
            const updated = await ConversationService.updateConversationSummary(
              conv.call_id, 
              fallbackSummary
            );
            updatedConversations.push(updated);
            console.log(`Updated conversation ${conv.call_id} with fallback summary (Vapi API failed)`);
          }
        } catch (error) {
          console.error(`Error fetching Vapi data for conversation ${conv.call_id}:`, error);
          
          // Fallback to a basic summary
          const fallbackSummary = `Call completed. Patient: ${conv.patient_name}. Phone: ${conv.phone_number}. Error fetching summary from Vapi.`;
          const updated = await ConversationService.updateConversationSummary(
            conv.call_id, 
            fallbackSummary
          );
          updatedConversations.push(updated);
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updatedConversations.length} conversation summaries`,
      updatedConversations
    });

  } catch (error) {
    console.error('Error updating summaries:', error);
    return NextResponse.json(
      { error: 'Failed to update summaries' },
      { status: 500 }
    );
  }
}
