import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Fetch from database when database is set up
    // For now, return mock data
    const mockConversations = [
      {
        callId: 1,
        date: new Date().toISOString(),
        patientName: 'John Doe',
        phoneNumber: '+1 123-555-0123',
        summary: 'Patient confirmed availability for delivery tomorrow at 2 PM. No medication changes needed. Previous shipment was received without issues.'
      },
      {
        callId: 2,
        date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        patientName: 'Jane Smith',
        phoneNumber: '+1 123-555-0456',
        summary: 'Patient requested delivery time change to evening hours. Mentioned missing one dose last week. No issues with last shipment.'
      }
    ];

    return NextResponse.json({
      conversations: mockConversations
    });

  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch conversations' },
      { status: 500 }
    );
  }
}
