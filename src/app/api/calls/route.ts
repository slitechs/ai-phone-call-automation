import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { patientName, phoneNumber } = await request.json();

    if (!patientName || !phoneNumber) {
      return NextResponse.json(
        { error: 'Patient name and phone number are required' },
        { status: 400 }
      );
    }

    // TODO: Integrate with Vapi to make the actual call
    // For now, we'll simulate a successful call
    const callId = Math.floor(Math.random() * 10000) + 1;
    
    // TODO: Save to database when database is set up
    console.log('Call initiated:', { callId, patientName, phoneNumber });

    return NextResponse.json({
      success: true,
      callId,
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
