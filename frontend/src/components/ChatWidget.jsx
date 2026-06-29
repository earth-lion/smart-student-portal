import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Award, HelpCircle } from 'lucide-react';
import api from '../services/api';
import './ChatWidget.css';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: 'أهلاً بك! أنا مساعدك الأكاديمي الذكي (دليل Bot). كيف يمكنني مساعدتك اليوم؟', isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const quickQuestions = [
    'ازاي اسجل المواد؟',
    'الجدول الدراسي',
    'المعدل التراكمي GPA',
    'معلومات عن الكليه'
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { text, isBot: false }]);
    setInput('');
    setLoading(true);

    try {
      const response = await api.post('/chatbot', { message: text });
      setMessages(prev => [...prev, { text: response.data.response, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: 'عذراً، حدث خطأ أثناء الاتصال بالخادم. يرجى المحاولة مرة أخرى.', isBot: true }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-widget-container">
      {/* Floating Toggle Button */}
      {!isOpen && (
        <button className="chat-widget-toggle animate-bounce-slow" onClick={() => setIsOpen(true)}>
          <span style={{ fontSize: '28px' }}>🤖</span>
          <span className="chat-badge-dot" />
        </button>
      )}

      {/* Chat Window Popup */}
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header__info">
              <div className="chat-bot-avatar">🤖</div>
              <div>
                <h4>مساعدك الأكاديمي</h4>
                <span className="chat-status">نشط الآن</span>
              </div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-message ${msg.isBot ? 'chat-message--bot' : 'chat-message--user'}`}>
                {msg.isBot && <div className="msg-avatar">🤖</div>}
                <div className="msg-bubble">{msg.text}</div>
              </div>
            ))}
            {loading && (
              <div className="chat-message chat-message--bot">
                <div className="msg-avatar">🤖</div>
                <div className="msg-bubble msg-bubble--typing">
                  <span /><span /><span />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="chat-quick-prompts">
            {quickQuestions.map((q, idx) => (
              <button key={idx} className="quick-prompt-btn" onClick={() => handleSendMessage(q)}>
                <HelpCircle size={12} />
                <span>{q}</span>
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form className="chat-footer" onSubmit={(e) => { e.preventDefault(); handleSendMessage(input); }}>
            <input
              type="text"
              placeholder="اكتب سؤالك هنا باللغة العربية..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
            />
            <button type="submit" className="chat-send-btn" disabled={loading || !input.trim()}>
              <Send size={16} />
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
