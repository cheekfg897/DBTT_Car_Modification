import { getPopularCombos } from './analyticsEngine';
import { getRecommendations } from './recommendationEngine';
import { MOD_OPTIONS } from '../data/modCatalog';
import { COLOR_PRESETS } from '../data/colorPresets';
import { getMod, getFinish } from '../utils/dataLookup';
import type { CarCustomization } from '../types/customization';

export interface SuggestedBuild {
  bodyColor?: string;
  finishType?: string;
  selectedMods: string[];
  rimColor?: string;
  caliperColor?: string;
  summary: string;
}

const SUGGEST_BUILD_TOOL = {
  type: 'function',
  function: {
    name: 'suggest_build',
    description:
      "Suggest a complete car customization build based on the customer's style preferences. Call this whenever the customer describes a style, vibe, or asks for a build recommendation.",
    parameters: {
      type: 'object',
      properties: {
        bodyColor: {
          type: 'string',
          description: 'Hex color code chosen from the available color presets',
        },
        finishType: {
          type: 'string',
          enum: ['gloss', 'matte', 'satin', 'chrome', 'carbon'],
          description: 'Paint finish type',
        },
        selectedMods: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of exact mod IDs to recommend',
        },
        rimColor: {
          type: 'string',
          description: 'Hex color code for rim color',
        },
        caliperColor: {
          type: 'string',
          description: 'Hex color code for caliper color',
        },
        summary: {
          type: 'string',
          description: 'One or two sentences explaining why this build matches their style',
        },
      },
      required: ['selectedMods', 'summary'],
    },
  },
};

function buildSystemPrompt(customization: CarCustomization): string {
  const combos = getPopularCombos();
  const recs = getRecommendations(customization);

  const selectedModNames = customization.selectedMods.map((id) => getMod(id)?.name).filter(Boolean);
  const currentFinish = getFinish(customization.finishType);

  return `You are an AI assistant for VOS Automotive, a premium car modification workshop.

CURRENT CUSTOMER BUILD:
- Body Color: ${customization.bodyColor}
- Finish: ${currentFinish?.name || customization.finishType} ($${currentFinish?.price || 0})
- Window Tint: ${Math.round(customization.windowTint * 100)}% opacity
- Rim Color: ${customization.rimColor}
- Caliper Color: ${customization.caliperColor}
- Selected Mods: ${selectedModNames.length > 0 ? selectedModNames.join(', ') : 'None yet'}

AVAILABLE COLORS (use exact hex codes):
${COLOR_PRESETS.map((c) => `- ${c.name}: ${c.hex} (${c.category})`).join('\n')}

AVAILABLE MODIFICATIONS (use exact IDs):
${MOD_OPTIONS.map((m) => `- ID: "${m.id}" | ${m.name} ($${m.price.toLocaleString()}): ${m.description}`).join('\n')}

AVAILABLE FINISHES: gloss, matte, satin, chrome, carbon

POPULAR COMBOS:
${combos.map((c) => `- ${c.label}`).join('\n')}

PERSONALIZED RECOMMENDATIONS:
${recs.map((r) => `- ${r.title}: ${r.description}`).join('\n')}

Guidelines:
- When a customer describes a style (e.g. "aggressive", "clean and minimal", "JDM", "luxury", "stealthy"), call the suggest_build function with a tailored build
- Always use exact mod IDs and hex codes from the lists above
- Keep text responses concise (under 120 words)
- After the build is suggested, briefly describe the vibe in your text response`;
}

export async function streamChat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  customization: CarCustomization,
  onChunk: (text: string) => void,
  onDone: () => void,
  onSuggestedBuild: (build: SuggestedBuild) => void,
  signal?: AbortSignal
): Promise<void> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    signal,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      stream: true,
      tools: [SUGGEST_BUILD_TOOL],
      tool_choice: 'auto',
      messages: [
        { role: 'system', content: buildSystemPrompt(customization) },
        ...messages,
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`);
  }

  const reader = response.body!.getReader();
  const decoder = new TextDecoder();

  let toolCallArgs = '';

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split('\n').filter((line) => line.startsWith('data: '));

      for (const line of lines) {
        const data = line.slice(6);
        if (data === '[DONE]') {
          onDone();
          return;
        }
        try {
          const parsed = JSON.parse(data);
          const delta = parsed.choices?.[0]?.delta;
          const finishReason = parsed.choices?.[0]?.finish_reason;

          if (delta?.tool_calls) {
            const argsDelta = delta.tool_calls[0]?.function?.arguments;
            if (argsDelta) toolCallArgs += argsDelta;
          } else if (delta?.content) {
            onChunk(delta.content);
          }

          if (finishReason === 'tool_calls' && toolCallArgs) {
            try {
              onSuggestedBuild(JSON.parse(toolCallArgs) as SuggestedBuild);
            } catch { /* ignore */ }
          }
        } catch { /* skip malformed chunks */ }
      }
    }

    onDone();
  } finally {
    reader.cancel();
  }
}
