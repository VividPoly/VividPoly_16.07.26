import { useState, useRef, useCallback } from "react";

interface VoiceAssistantState {
  isListening: boolean;
  isSpeaking: boolean;
  transcript: string;
  isSupported: boolean;
}

export function useVoiceAssistant() {
  const [state, setState] = useState<VoiceAssistantState>({
    isListening: false,
    isSpeaking: false,
    transcript: "",
    isSupported: typeof window !== "undefined" && ("webkitSpeechRecognition" in window || "SpeechRecognition" in window),
  });

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(
    typeof window !== "undefined" ? window.speechSynthesis : null
  );

  const startListening = useCallback(() => {
    if (!state.isSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setState(prev => ({ ...prev, isListening: true, transcript: "" }));
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        }
      }
      if (finalTranscript) {
        setState(prev => ({ ...prev, transcript: finalTranscript }));
      }
    };

    recognition.onerror = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognition.onend = () => {
      setState(prev => ({ ...prev, isListening: false }));
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [state.isSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setState(prev => ({ ...prev, isListening: false }));
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (!synthRef.current) return;
    
    // Cancel any ongoing speech
    synthRef.current.cancel();

    // Clean markdown from text
    const cleanText = text
      .replace(/[#*_~`]/g, "")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/\n+/g, ". ")
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to use a natural-sounding English voice
    const voices = synthRef.current.getVoices();
    const preferredVoice = voices.find(v => 
      v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural") || v.name.includes("Samantha"))
    ) || voices.find(v => v.lang.startsWith("en"));
    
    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      setState(prev => ({ ...prev, isSpeaking: true }));
    };

    utterance.onend = () => {
      setState(prev => ({ ...prev, isSpeaking: false }));
    };

    utterance.onerror = () => {
      setState(prev => ({ ...prev, isSpeaking: false }));
    };

    synthRef.current.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setState(prev => ({ ...prev, isSpeaking: false }));
    }
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  };
}
