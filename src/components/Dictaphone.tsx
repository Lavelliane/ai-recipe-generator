import React, { useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

interface DictaphoneProps {
  onTranscriptChange?: (text: string) => void;
  onComplete?: () => void;
  setVoiceTranscript?: (text: string) => void;
  transcript: string;
  listening: boolean;
  resetTranscript: () => void;
  browserSupportsSpeechRecognition: boolean;
}

const Dictaphone = ({ onTranscriptChange, onComplete, setVoiceTranscript, transcript, listening, resetTranscript, browserSupportsSpeechRecognition }: DictaphoneProps) => {
  useEffect(() => {
    if (onTranscriptChange && transcript) {
      onTranscriptChange(transcript);
    }
  }, [transcript, onTranscriptChange]);

  const handleClear = () => {
    if(resetTranscript) {
      resetTranscript();
    }
    if (setVoiceTranscript) {
      setVoiceTranscript('');
    }
  };

  if (!browserSupportsSpeechRecognition) {
    return <div className="text-amber-700 bg-amber-50 p-3 rounded-lg">Browser doesn't support speech recognition.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${listening ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`}></div>
          <span className="text-sm text-gray-600">Microphone {listening ? 'active' : 'inactive'}</span>
        </div>
        {transcript && (
          <button 
            onClick={handleClear} 
            className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md border border-gray-200"
          >
            Clear
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <button 
          onClick={() => SpeechRecognition.startListening({ continuous: true })} 
          disabled={listening}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            listening 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          }`}
        >
          Start Recording
        </button>
        <button 
          onClick={() => {
            SpeechRecognition.stopListening();
            if (onComplete) {
              onComplete();
            }
          }} 
          disabled={!listening}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            !listening 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-red-100 text-red-700 hover:bg-red-200'
          }`}
        >
          Send Message
        </button>
      </div>
    </div>
  );
};

export default Dictaphone;