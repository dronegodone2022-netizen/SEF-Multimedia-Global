
import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Loader2, Send, X, MessageSquare, Bot } from 'lucide-react';
import { geminiService } from '../services/geminiService';

const AIConsultant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [service, setService] = useState('Photography');
  const [goal, setGoal] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'bot'; content: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;

    const userMessage = goal;
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setGoal('');
    setLoading(true);

    try {
      const suggestion = await geminiService.getCreativeIdeas(service, userMessage);
      setMessages(prev => [...prev, { role: 'bot', content: suggestion || "I couldn't generate ideas right now. Please try again." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'bot', content: "Sorry, I encountered an error. Please try again later." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-24 right-8 z-50 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-indigo-600 text-white'
        }`}
        aria-label="Toggle AI Consultant"
      >
        {isOpen ? <X size={28} /> : <Bot size={28} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-indigo-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      {/* Chat Window */}
      <div className={`fixed bottom-44 right-8 z-50 w-[90vw] md:w-[400px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-500 transform ${
        isOpen ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Sparkles size={20} className="text-yellow-400" />
            </div>
            <div>
              <h3 className="font-bold league-spartan">SEF AI Consultant</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Creative Brainstorming</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
          {messages.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                <Bot size={32} />
              </div>
              <p className="text-slate-600 font-medium">Hello! I'm your creative assistant. Select a service and tell me your goal to start brainstorming.</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-indigo-600" />
                <span className="text-xs font-medium text-slate-400">Brainstorming...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-6 bg-white border-t border-slate-100">
          <div className="mb-4">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Service Category</label>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {['Photography', 'Videography', 'Design', 'Web'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setService(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    service === cat ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="relative">
            <input 
              type="text"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              placeholder="Describe your project goal..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-12 text-sm focus:ring-2 focus:ring-indigo-600 outline-none transition-all"
            />
            <button 
              type="submit"
              disabled={loading || !goal.trim()}
              className="absolute right-2 top-2 bg-indigo-600 text-white p-1.5 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AIConsultant;
