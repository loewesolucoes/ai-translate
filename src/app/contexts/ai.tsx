"use client";

// Extend the Window interface to include __google
declare global {
  interface Window {
    __google: any;
  }
}

import React, { createContext, useEffect, useState } from "react"
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { useStorage } from "./storage";
import { GOOGLE_GENERATIVE_AI_API_KEY } from "../repositories/parametros";
import { NotificationUtil } from "../utils/notification";

const AiContext = createContext({
  fetchAiData: async (system: string, prompt: string, onStreamText: (text: string) => void, onThinkLoad?: (thinkContent: string) => void) => { console.warn("fetchAiData not implemented"); return { answer: "", think: "" }; }
});

export function AiProvider(props: any) {
  const { repository, isDbOk } = useStorage();
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    isDbOk && load();
  }, [isDbOk]);

  async function load() {
    // Initialization logic if needed
    const apiKey = await repository.params.getValorByKey(GOOGLE_GENERATIVE_AI_API_KEY);
    console.log("AI Provider initialized", apiKey);

    if (apiKey?.trim() === "") {
      console.error("Google Generative AI API key is not set. Please set NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY in your configuration params.");
      NotificationUtil.send(`Google Generative AI API key is not set. Please set it in your configuration params (${GOOGLE_GENERATIVE_AI_API_KEY})`);
      return;
    }

    if (window.__google == null) {
      window.__google = createGoogleGenerativeAI({
        apiKey: apiKey,
      });
    }

    setIsInitialized(true);
  }

  async function fetchAiData(systemPrompt: string, prompt: string, onChunkLoad: (text: string) => void, onThinkLoad: (thinkContent: string) => void = () => { }) {
    //    model: "gemma-3-27b-it",
    // model: "gemini-2.5-flash-preview-05-20",
    // model: "gemini-2.0-flash",
    const google = window.__google;

    if (google == null || !isInitialized) {
      NotificationUtil.send(`Google Generative AI API key is not set. Please set it in your configuration params (${GOOGLE_GENERATIVE_AI_API_KEY})`);
      return { answer: "Error to fetch ai", think: "" };
    }

    const { textStream } = streamText({
      model: google('gemma-3-27b-it'),
      messages: [
        { role: 'assistant', content: systemPrompt },
        { role: 'user', content: `{{{START}}}\n${prompt}\n{{{END}}}` }
      ],
    });

    let finalOriginalChunk = '';
    let finalChunk = '';
    let thinkContent = '';

    for await (const originalChunk of textStream) {
      finalOriginalChunk += originalChunk;
      // Extract content inside <think> tag, even if </think> is missing
      let modifiedChunk = finalChunk;

      const thinkStart = finalOriginalChunk.indexOf('<think>');
      const thinkEnd = finalOriginalChunk.indexOf('</think>');

      if (thinkStart !== -1) {
        if (thinkEnd !== -1 && thinkEnd > thinkStart) {
          // Both <think> and </think> present
          thinkContent = finalOriginalChunk.substring(thinkStart + 7, thinkEnd);
          // Remove <think>...</think> from chunk
          modifiedChunk = finalOriginalChunk.slice(0, thinkStart) + finalOriginalChunk.slice(thinkEnd + 8);
        } else {
          // <think> present but </think> missing, take everything after <think>
          thinkContent = finalOriginalChunk.substring(thinkStart + 7);
          // Remove <think> and everything after from chunk
          modifiedChunk = finalOriginalChunk.slice(0, thinkStart);
        }
      }

      finalChunk = modifiedChunk;

      onChunkLoad(finalChunk);
      onThinkLoad(thinkContent);
      // Optionally, you can use thinkContent as needed
    }

    console.timeLog('Streaming response time');
    console.log('Streaming response completed.');

    return { answer: finalChunk, think: thinkContent };
  }

  return (
    <AiContext.Provider
      value={{
        fetchAiData,
      }}
      {...props}
    />
  )
}

export const useAi = () => React.useContext(AiContext)