import { getPopularCombos } from './analyticsEngine';
import { getRecommendations } from './recommendationEngine';
import { MOD_OPTIONS, FINISH_PRESETS } from '../data/modCatalog';
import type { CarCustomization } from '../types/customization';

function buildSystemPrompt(customization: CarCustomization): string {
  const combos = getPopularCombos();
  const recs = getRecommendations(customization);

  const selectedModNames = customization.selectedMods
    .map((id) => MOD_OPTIONS.find((m) => m.id === id)?.name)
    .filter(Boolean);

  const currentFinish = FINISH_PRESETS.find((f) => f.type === customization.finishType);

  return `You are an AI assistant for Los Santos Customs, a premium car modification workshop. Help customers choose the best modifications and customizations for their vehicle.

CURRENT CUSTOMER BUILD:
- Body Color: ${customization.bodyColor}
- Finish: ${currentFinish?.name || customization.finishType} ($${currentFinish?.price || 0})
- Window Tint: ${Math.round(customization.windowTint * 100)}% opacity
- Rim Color: ${customization.rimColor}
- Caliper Color: ${customization.caliperColor}
- Selected Mods: ${selectedModNames.length > 0 ? selectedModNames.join(', ') : 'None yet'}

AVAILABLE MODIFICATIONS:
${MOD_OPTIONS.map((m) => `- ${m.name} ($${m.price.toLocaleString()}): ${m.description}`).join('\n')}

POPULAR COMBOS (frequently bought together):
${combos.map((c) => `- ${c.label}`).join('\n')}

PERSONALIZED RECOMMENDATIONS:
${recs.map((r) => `- ${r.title}: ${r.description}`).join('\n')}

Guidelines:
- Suggest specific mods with prices
- Reference popular combos when relevant
- Be enthusiastic but concise (under 120 words unless asked for detail)
- Use the customer's current build to tailor suggestions`;
}

export async function streamChat(
  messages: { role: 'user' | 'assistant'; content: string }[],
  customization: CarCustomization,
  onChunk: (text: string) => void,
  onDone: () => void
): Promise<void> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      stream: true,
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
        const text = parsed.choices?.[0]?.delta?.content;
        if (text) onChunk(text);
      } catch {
        // skip malformed chunks
      }
    }
  }

  onDone();
}
