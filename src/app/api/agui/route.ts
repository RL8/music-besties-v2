import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Sample resources for intelligent responses
const SAMPLE_RESOURCES = [
  {
    id: "1",
    title: "Climate Change Research",
    description: "Comprehensive analysis of global climate patterns",
    url: "https://example.com/climate-research",
    type: "research",
  },
  {
    id: "2", 
    title: "Taylor Swift: Philosopher of the Modern Age",
    description: "An exploration of philosophical themes in contemporary music",
    url: "https://example.com/taylor-swift-philosophy",
    type: "article",
  },
  {
    id: "3",
    title: "AI and Music: The Future of Creativity",
    description: "How artificial intelligence is reshaping musical composition",
    url: "https://example.com/ai-music-future",
    type: "research",
  },
];

// Core AI conversation logic
async function generateIntelligentResponse(message: string) {
  try {
    const systemPrompt = `You are an intelligent research assistant with access to resources and the ability to generate content. 
    You help users with research questions, finding sources, and creating articles.
    
    Available capabilities:
    - Find relevant resources based on topics
    - Generate article content with examples (like Taylor Swift as philosopher)
    - Provide contextual responses based on conversation history
    - Manage research canvas state
    
    Respond helpfully and intelligently to user queries.`;

    const completion = await openai.chat.completions.create({
      model: process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message },
      ],
      max_tokens: 1000,
      temperature: 0.7,
    });

    return completion.choices[0]?.message?.content || "I couldn't generate a response.";
  } catch (error) {
    console.error("Error generating intelligent response:", error);
    return "I'm having trouble processing your request. Please try again.";
  }
}

// Article generation with Taylor Swift example
async function generateArticleContent(topic: string) {
  try {
    const articlePrompt = `Write a compelling article about "${topic}". 
    Make it engaging, well-structured, and informative. 
    Include examples and insights that would be valuable for research.
    
    If the topic is about Taylor Swift or music philosophy, explore themes like:
    - The intersection of pop culture and philosophical thought
    - How modern artists express complex ideas through accessible media
    - The role of storytelling in contemporary music
    
    Structure the article with clear sections and compelling arguments.`;

    const completion = await openai.chat.completions.create({
      model: process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-4",
      messages: [
        { role: "system", content: "You are an expert writer and researcher." },
        { role: "user", content: articlePrompt },
      ],
      max_tokens: 2000,
      temperature: 0.8,
    });

    return completion.choices[0]?.message?.content || "Article generation failed.";
  } catch (error) {
    console.error("Error generating article:", error);
    return "Unable to generate article content.";
  }
}

// Find relevant resources
function findRelevantResources(query: string) {
  const lowercaseQuery = query.toLowerCase();
  return SAMPLE_RESOURCES.filter(resource => 
    resource.title.toLowerCase().includes(lowercaseQuery) ||
    resource.description.toLowerCase().includes(lowercaseQuery)
  );
}

// Main API handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, action, context } = body;

    switch (action) {
      case "chat":
        const response = await generateIntelligentResponse(message);
        return NextResponse.json({ 
          response,
          type: "chat"
        });

      case "find_resources":
        const resources = findRelevantResources(message);
        return NextResponse.json({
          resources,
          type: "resources"
        });

      case "generate_article":
        const article = await generateArticleContent(message);
        return NextResponse.json({
          article,
          type: "article"
        });

      case "update_state":
        // Handle state updates for bidirectional sync
        return NextResponse.json({
          success: true,
          state: context,
          type: "state_update"
        });

      default:
        // Default intelligent response
        const defaultResponse = await generateIntelligentResponse(message);
        return NextResponse.json({
          response: defaultResponse,
          type: "response"
        });
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: "ok", 
    message: "AG-UI API is running",
    capabilities: ["chat", "find_resources", "generate_article", "update_state"]
  });
} 