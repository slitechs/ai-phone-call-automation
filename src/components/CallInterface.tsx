'use client';

import { useState } from 'react';

interface CallFormData {
  patientName: string;
  phoneNumber: string;
}

export default function CallInterface() {
  const [formData, setFormData] = useState<CallFormData>({
    patientName: '',
    phoneNumber: ''
  });
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<string>('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    return formData.patientName.trim() !== '' && formData.phoneNumber.trim() !== '';
  };

  const handleCall = async () => {
    if (!validateForm()) {
      setCallStatus('Please fill in both patient name and phone number');
      return;
    }

    setIsCalling(true);
    setCallStatus('Initiating call...');

    try {
      const response = await fetch('/api/calls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientName: formData.patientName,
          phoneNumber: formData.phoneNumber,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to initiate call');
      }

      const result = await response.json();
      setCallStatus(`Call initiated successfully! Call ID: ${result.callId}`);
      
      // Reset form after successful call
      setFormData({ patientName: '', phoneNumber: '' });
    } catch (error) {
      setCallStatus('Error initiating call. Please try again.');
      console.error('Call error:', error);
    } finally {
      setIsCalling(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white shadow-lg rounded-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Initiate Patient Call
        </h2>
        
        <div className="space-y-6">
          <div>
            <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 mb-2">
              Patient Name
            </label>
            <input
              type="text"
              id="patientName"
              name="patientName"
              value={formData.patientName}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter patient's full name"
              disabled={isCalling}
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter patient's phone number"
              disabled={isCalling}
            />
          </div>

          <div className="pt-4">
            <button
              onClick={handleCall}
              disabled={!validateForm() || isCalling}
              className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                validateForm() && !isCalling
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isCalling ? 'Calling...' : 'Make Call'}
            </button>
          </div>

          {callStatus && (
            <div className={`p-4 rounded-md ${
              callStatus.includes('Error') || callStatus.includes('Please fill')
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {callStatus}
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-blue-50 rounded-md">
          <h3 className="text-sm font-medium text-blue-900 mb-2">What happens during the call:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Confirms next medication delivery availability and timing</li>
            <li>• Checks for changes in patient medication needs</li>
            <li>• Records any issues with previous shipments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
