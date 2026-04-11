import React, { useState, useEffect } from 'react';
import { Newspaper, ExternalLink, Search, Loader2, Globe, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface NewsArticle {
  title: string;
  snippet: string;
  link: string;
  source: string;
  date?: string;
}

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: "Find the latest local civic news, municipal updates, and infrastructure projects in major Indian cities like Bangalore, Mumbai, and Delhi. Provide a list of 6-8 recent news items with titles, short snippets, and source names.",
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const text = response.text;
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
        
        // If we have grounding chunks, we can try to map them to articles
        // Otherwise, we'll parse the text response
        if (chunks && chunks.length > 0) {
          const newsItems: NewsArticle[] = chunks.map((chunk: any, index: number) => ({
            title: chunk.web?.title || `Civic Update ${index + 1}`,
            snippet: text.split('\n').find(line => line.includes(chunk.web?.title)) || "Latest update on municipal infrastructure and civic services.",
            link: chunk.web?.uri || "#",
            source: new URL(chunk.web?.uri || "https://google.com").hostname.replace('www.', ''),
          }));
          setArticles(newsItems.filter(item => item.link !== "#"));
        } else {
          // Fallback parsing if grounding chunks are missing but text is present
          // This is a simple heuristic
          const lines = text.split('\n').filter(l => l.trim().length > 20);
          const newsItems: NewsArticle[] = lines.slice(0, 6).map((line, i) => ({
            title: line.split(':')[0] || "Municipal Update",
            snippet: line.split(':')[1] || line,
            link: "https://news.google.com/search?q=civic+news+india",
            source: "Google News",
          }));
          setArticles(newsItems);
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load live news. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-24">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold uppercase tracking-widest">
          <Globe className="w-4 h-4" />
          Live Updates
        </div>
        <h1 className="text-5xl font-bold text-slate-900 tracking-tight">Civic News & Updates</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg">
          Stay informed about municipal projects, infrastructure developments, and civic announcements in your area.
        </p>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
          <p className="text-slate-500 font-medium">Fetching latest civic reports...</p>
        </div>
      ) : error ? (
        <div className="bg-rose-50 border border-rose-100 rounded-3xl p-12 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h3 className="text-xl font-bold text-slate-900">{error}</h3>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-all"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map((article, i) => (
            <motion.a
              key={i}
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden flex flex-col cursor-pointer"
            >
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                <img 
                  src={`https://picsum.photos/seed/${i + 100}/600/400`} 
                  alt="News" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-bold text-slate-900 uppercase tracking-widest">
                  {article.source}
                </div>
              </div>
              <div className="p-8 space-y-4 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-blue-600 transition-colors">
                  {article.title}
                </h3>
                <p className="text-slate-500 text-sm line-clamp-3 leading-relaxed flex-1">
                  {article.snippet}
                </p>
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    {article.date || 'Recent'}
                  </span>
                  <div className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors">
                    Read More
                    <ExternalLink className="w-3 h-3" />
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      <div className="bg-slate-900 rounded-[3rem] p-12 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold tracking-tight">Subscribe to Civic Alerts</h2>
            <p className="text-slate-400 max-w-md">
              Get real-time notifications about emergency repairs, water supply schedules, and municipal announcements in your ward.
            </p>
          </div>
          <div className="flex w-full md:w-auto gap-2">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 md:w-64 px-6 py-4 bg-white/10 border border-white/10 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <button className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
              Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
