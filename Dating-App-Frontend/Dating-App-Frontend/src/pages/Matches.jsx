import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, Check, X, Send } from 'lucide-react';
import { getReceivedRequests, getMyConnections, respondConnection } from '../services/api';

export default function Matches() {
  const [activeTab, setActiveTab] = useState('matches'); // 'matches' | 'requests'
  const [matches, setMatches] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [msgInput, setMsgInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [matchesRes, requestsRes] = await Promise.all([
        getMyConnections(),
        getReceivedRequests()
      ]);
      setMatches(matchesRes.data || mockMatches);
      setRequests(requestsRes.data || mockRequests);
    } catch (e) {
      setMatches(mockMatches);
      setRequests(mockRequests);
    }
  };

  const handleResponse = async (reqId, status) => {
    try {
      await respondConnection(reqId, status);
      setRequests(prev => prev.filter(r => r.id !== reqId));
      if (status === 'ACCEPTED') {
        fetchData();
      }
    } catch (e) {
      setRequests(prev => prev.filter(r => r.id !== reqId));
    }
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!msgInput.trim()) return;
    setMessages(prev => [...prev, { sender: 'me', text: msgInput, time: 'Just now' }]);
    setMsgInput('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-100px)]">
      
      {/* Left Sidebar List */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 flex flex-col shadow-sm">
        
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
          <button
            onClick={() => setActiveTab('matches')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'matches' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Matches ({matches.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              activeTab === 'requests' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Requests ({requests.length})
          </button>
        </div>

        {/* Matches List */}
        {activeTab === 'matches' && (
          <div className="flex-1 overflow-y-auto space-y-2 no-scrollbar">
            {matches.map(item => (
              <div
                key={item.id}
                onClick={() => {
                  setSelectedChat(item);
                  setMessages([
                    { sender: 'them', text: `Hey! Great to match with you 😊`, time: '10:30 AM' }
                  ]);
                }}
                className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition ${
                  selectedChat?.id === item.id ? 'bg-rose-50 border border-rose-200' : 'hover:bg-slate-50'
                }`}
              >
                <img src={item.imageUrl} alt={item.fullName} className="w-12 h-12 rounded-full object-cover" />
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 text-sm truncate">{item.fullName}</h4>
                  <p className="text-xs text-slate-500 truncate">Tap to chat...</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Connection Requests */}
        {activeTab === 'requests' && (
          <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar">
            {requests.map(req => (
              <div key={req.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center gap-3">
                  <img src={req.senderImage} alt={req.senderName} className="w-10 h-10 rounded-full object-cover" />
                  <div>
                    <h5 className="font-bold text-xs text-slate-800">{req.senderName}</h5>
                    <span className="text-[10px] text-rose-500 font-semibold">{req.requestType}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleResponse(req.id, 'ACCEPTED')}
                    className="flex-1 py-1.5 bg-rose-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5" /> Accept
                  </button>
                  <button
                    onClick={() => handleResponse(req.id, 'REJECTED')}
                    className="p-1.5 bg-slate-200 text-slate-600 rounded-xl text-xs hover:bg-slate-300"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Container */}
      <div className="md:col-span-2 bg-white border border-slate-200 rounded-3xl flex flex-col shadow-sm overflow-hidden">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <img src={selectedChat.imageUrl} alt={selectedChat.fullName} className="w-10 h-10 rounded-full object-cover" />
              <div>
                <h3 className="font-bold text-slate-800 text-sm">{selectedChat.fullName}</h3>
                <span className="text-[11px] text-emerald-500 font-medium">Online</span>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-xs shadow-sm ${
                    msg.sender === 'me' 
                      ? 'bg-rose-500 text-white rounded-br-none' 
                      : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
                  }`}>
                    <p>{msg.text}</p>
                    <span className={`block text-[9px] mt-1 text-right ${msg.sender === 'me' ? 'text-rose-200' : 'text-slate-400'}`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Box */}
            <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-100 flex gap-2">
              <input
                type="text"
                value={msgInput}
                onChange={(e) => setMsgInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-slate-100 border-none rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
              <button type="submit" className="p-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-slate-400">
            <MessageSquare className="w-12 h-12 mb-2 stroke-[1.5]" />
            <p className="text-sm">Select a match from the left list to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

const mockMatches = [
  { id: 201, fullName: 'Simran Gupta', imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800' },
  { id: 202, fullName: 'Karan Malhotra', imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=800' }
];

const mockRequests = [
  { id: 301, senderName: 'Riya Sen', senderImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800', requestType: 'SUPERLIKE' }
];
