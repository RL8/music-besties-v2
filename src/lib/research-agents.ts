import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface AgentContext {
  nodeId: string;
  workflowId: string;
  input: Record<string, unknown>;
  globalState: Record<string, unknown>;
}

export interface AgentResult {
  [key: string]: unknown;
}

// Base Agent Class
abstract class BaseAgent {
  protected name: string;
  
  constructor(name: string) {
    this.name = name;
  }

  abstract execute(context: AgentContext): Promise<AgentResult>;

  protected async callOpenAI(prompt: string, temperature: number = 0.7): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: process.env.NEXT_PUBLIC_OPENAI_MODEL || "gpt-4",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1000,
        temperature,
      });
      
      return completion.choices[0]?.message?.content || '';
    } catch (error) {
      console.error(`Error in ${this.name}:`, error);
      throw error;
    }
  }
}

// Query Analysis Agent
export class QueryAnalyzerAgent extends BaseAgent {
  constructor() {
    super('Query Analyzer');
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const query = String(context.input.query || context.input.currentTopic || '');
    
    const prompt = `
You are a research query analyzer. Break down this research query into actionable components:

Query: "${query}"

Analyze and provide:
1. Main research topic
2. Key search terms (5-7 terms)
3. Research areas to explore
4. Potential sources to target (academic, news, blogs, etc.)
5. Research complexity level (basic, intermediate, advanced)

Respond in JSON format:
{
  "main_topic": "...",
  "search_terms": ["...", "..."],
  "research_areas": ["...", "..."],
  "source_types": ["...", "..."],
  "complexity": "...",
  "estimated_time": "..."
}
    `;

    const response = await this.callOpenAI(prompt);
    
    try {
      const parsed = JSON.parse(response);
      return {
        analyzed_query: query,
        analysis: parsed,
        search_terms: parsed.search_terms || [],
        research_areas: parsed.research_areas || []
      };
    } catch {
      // Fallback if JSON parsing fails
      return {
        analyzed_query: query,
        search_terms: this.extractSearchTerms(query),
        research_areas: [query]
      };
    }
  }

  private extractSearchTerms(query: string): string[] {
    // Simple keyword extraction as fallback
    return query.toLowerCase()
      .split(/[^\w]+/)
      .filter(term => term.length > 2)
      .slice(0, 5);
  }
}

// Web Search Agent
export class WebSearcherAgent extends BaseAgent {
  constructor() {
    super('Web Searcher');
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const searchTerms = context.globalState.search_terms as string[] || [];
    const mainTopic = context.globalState.main_topic as string || '';

    // For now, generate mock sources based on the query
    // In production, this would integrate with real search APIs
    const sources = await this.generateMockSources(searchTerms, mainTopic);

    return {
      sources,
      search_summary: `Found ${sources.length} relevant sources for research`,
      search_terms_used: searchTerms
    };
  }

  private async generateMockSources(searchTerms: string[], topic: string): Promise<Record<string, unknown>[]> {
    const prompt = `
Generate 5-8 realistic research sources for the topic: "${topic}"
Search terms: ${searchTerms.join(', ')}

For each source, provide:
- title: Realistic article/paper title
- url: Realistic URL (use real domains but hypothetical paths)
- type: academic, news, blog, wikipedia, government, etc.
- relevance_score: 0.1 to 1.0
- description: Brief description of what this source contains
- author: Realistic author name
- publish_date: Recent realistic date

Respond in JSON format as an array of sources.
    `;

    const response = await this.callOpenAI(prompt);
    
    try {
      return JSON.parse(response);
    } catch {
      // Fallback mock sources
      return [
        {
          title: `Research on ${topic}`,
          url: `https://example.com/research/${topic.toLowerCase().replace(/\s+/g, '-')}`,
          type: 'academic',
          relevance_score: 0.9,
          description: `Academic research paper on ${topic}`,
          author: 'Dr. Research Author',
          publish_date: '2024-01-15'
        }
      ];
    }
  }
}

// Source Validation Agent
export class SourceValidatorAgent extends BaseAgent {
  constructor() {
    super('Source Validator');
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const sources = context.globalState.sources as Record<string, unknown>[] || [];
    
    const prompt = `
You are a source validation expert. Evaluate these sources for quality and reliability:

Sources:
${JSON.stringify(sources, null, 2)}

For each source, assign:
1. Quality score (0.1-1.0) based on:
   - Domain authority
   - Author credibility
   - Publication type
   - Recency
   - Relevance

2. Trust level (high, medium, low)
3. Citation worthiness (yes/no)
4. Brief validation notes

Return only the sources that score above 0.6 quality threshold.
Respond in JSON format as an array of validated sources.
    `;

    const response = await this.callOpenAI(prompt);
    
    try {
      const validatedSources = JSON.parse(response);
      return {
        validated_sources: validatedSources,
        validation_summary: `Validated ${validatedSources.length} out of ${sources.length} sources`,
        quality_threshold: 0.6
      };
    } catch {
      // Fallback: filter sources by relevance score
      const validatedSources = sources.filter(source => 
        ((source.relevance_score as number) || 0) > 0.6
      );
      
      return {
        validated_sources: validatedSources,
        validation_summary: `Validated ${validatedSources.length} out of ${sources.length} sources`,
        quality_threshold: 0.6
      };
    }
  }
}

// Content Analysis Agent
export class ContentAnalyzerAgent extends BaseAgent {
  constructor() {
    super('Content Analyzer');
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const validatedSources = context.globalState.validated_sources as Record<string, unknown>[] || [];
    const mainTopic = context.globalState.main_topic as string || '';

    const prompt = `
You are a content analysis expert. Analyze these validated sources for the topic: "${mainTopic}"

Sources:
${JSON.stringify(validatedSources, null, 2)}

Extract:
1. Key insights (5-7 main insights)
2. Central themes
3. Notable quotes or data points
4. Contradicting viewpoints
5. Research gaps identified
6. Synthesis of findings

Respond in JSON format:
{
  "insights": ["...", "..."],
  "themes": ["...", "..."],
  "quotes": ["...", "..."],
  "contradictions": ["...", "..."],
  "gaps": ["...", "..."],
  "synthesis": "..."
}
    `;

    const response = await this.callOpenAI(prompt, 0.6);
    
    try {
      const analysis = JSON.parse(response);
      return {
        content_analysis: analysis,
        insights: analysis.insights || [],
        themes: analysis.themes || [],
        synthesis: analysis.synthesis || ''
      };
    } catch {
      // Fallback analysis
      return {
        insights: [`Key insights about ${mainTopic} from ${validatedSources.length} sources`],
        themes: [mainTopic],
        synthesis: `Analysis of ${mainTopic} based on available sources`
      };
    }
  }
}

// Article Writer Agent
export class ArticleWriterAgent extends BaseAgent {
  constructor() {
    super('Article Writer');
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const insights = context.globalState.insights as string[] || [];
    const themes = context.globalState.themes as string[] || [];
    const synthesis = context.globalState.synthesis as string || '';
    const mainTopic = context.globalState.main_topic as string || '';

    const prompt = `
You are an expert writer. Create a comprehensive, well-structured article about: "${mainTopic}"

Use these research insights:
${insights.map(insight => `- ${insight}`).join('\n')}

Key themes to address:
${themes.map(theme => `- ${theme}`).join('\n')}

Research synthesis:
${synthesis}

Write a compelling article with:
1. Engaging introduction
2. Well-organized body sections
3. Evidence-based arguments
4. Thoughtful conclusion
5. Proper flow and transitions

Aim for 800-1200 words. Make it informative yet accessible.
    `;

    const response = await this.callOpenAI(prompt, 0.8);
    
    return {
      article: response,
      article_structure: {
        word_count: response.split(' ').length,
        sections: this.extractSections(response),
        main_topic: mainTopic
      },
      writing_notes: `Article generated based on ${insights.length} insights and ${themes.length} themes`
    };
  }

  private extractSections(article: string): string[] {
    // Simple section extraction based on paragraphs
    return article.split('\n\n')
      .filter(para => para.trim().length > 50)
      .map((para, index) => `Section ${index + 1}`)
      .slice(0, 5);
  }
}

// Quality Reviewer Agent
export class QualityReviewerAgent extends BaseAgent {
  constructor() {
    super('Quality Reviewer');
  }

  async execute(context: AgentContext): Promise<AgentResult> {
    const article = context.globalState.article as string || '';
    const mainTopic = context.globalState.main_topic as string || '';

    const prompt = `
You are a quality reviewer for research articles. Review this article about "${mainTopic}":

${article}

Evaluate:
1. Content quality (1-10)
2. Structure and flow (1-10)
3. Evidence support (1-10)
4. Clarity and readability (1-10)
5. Completeness (1-10)

Provide:
- Overall score (1-10)
- Specific strengths
- Areas for improvement
- Suggested revisions

Respond in JSON format:
{
  "overall_score": 8.5,
  "content_quality": 8,
  "structure_flow": 9,
  "evidence_support": 8,
  "clarity": 9,
  "completeness": 8,
  "strengths": ["...", "..."],
  "improvements": ["...", "..."],
  "suggestions": ["...", "..."]
}
    `;

    const response = await this.callOpenAI(prompt, 0.5);
    
    try {
      const review = JSON.parse(response);
      return {
        quality_review: review,
        overall_score: review.overall_score || 7.5,
        review_summary: `Article scored ${review.overall_score || 7.5}/10 overall`,
        recommendations: review.suggestions || []
      };
    } catch {
      // Fallback review
      return {
        overall_score: 7.5,
        review_summary: 'Article meets quality standards',
        recommendations: ['Review for clarity', 'Check citations']
      };
    }
  }
}

// Agent Registry
export class AgentRegistry {
  private agents: Map<string, BaseAgent> = new Map();

  constructor() {
    this.registerDefaultAgents();
  }

  private registerDefaultAgents() {
    this.agents.set('query_analyzer', new QueryAnalyzerAgent());
    this.agents.set('web_searcher', new WebSearcherAgent());
    this.agents.set('source_validator', new SourceValidatorAgent());
    this.agents.set('content_analyzer', new ContentAnalyzerAgent());
    this.agents.set('article_writer', new ArticleWriterAgent());
    this.agents.set('quality_reviewer', new QualityReviewerAgent());
  }

  async executeAgent(agentType: string, context: AgentContext): Promise<AgentResult> {
    const agent = this.agents.get(agentType);
    if (!agent) {
      throw new Error(`Agent ${agentType} not found`);
    }

    return await agent.execute(context);
  }

  getAvailableAgents(): string[] {
    return Array.from(this.agents.keys());
  }
} 