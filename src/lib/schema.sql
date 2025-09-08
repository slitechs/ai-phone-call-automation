-- Create the conversations table
CREATE TABLE IF NOT EXISTS conversations (
    call_id SERIAL PRIMARY KEY,
    date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    patient_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    summary TEXT
);

-- Create an index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_conversations_date ON conversations(date);

-- Create an index on patient_name for faster searches
CREATE INDEX IF NOT EXISTS idx_conversations_patient_name ON conversations(patient_name);
