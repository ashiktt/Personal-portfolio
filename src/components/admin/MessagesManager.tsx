import React from 'react';
import { Mail, Trash2, CheckCircle2, Clock, User, Reply, Inbox } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';

interface MessagesManagerProps {
  onShowToast: (type: 'success' | 'error' | 'info', title: string, message?: string) => void;
}

export const MessagesManager: React.FC<MessagesManagerProps> = ({ onShowToast }) => {
  const { messages, deleteMessage, markMessageRead, clearMessages } = usePortfolio();

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Delete inquiry from ${name}?`)) {
      deleteMessage(id);
      onShowToast('info', 'Message Deleted', 'Inquiry removed from inbox.');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all messages from your inbox?')) {
      clearMessages();
      onShowToast('info', 'Inbox Cleared', 'All messages have been deleted.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>Inquiries &amp; Messages Inbox</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/25 font-mono">
              {messages.length} total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Messages submitted from your public contact form are automatically captured and stored here.
          </p>
        </div>

        {messages.length > 0 && (
          <button
            onClick={handleClearAll}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-medium text-rose-300 transition-colors self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Inbox</span>
          </button>
        )}
      </div>

      {/* Messages List */}
      {messages.length === 0 ? (
        <div className="p-12 rounded-3xl bg-[#0E1322]/60 border border-slate-800 text-center space-y-3">
          <Inbox className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">No Messages Yet</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            When recruiters, clients, or visitors submit your contact form, their inquiries will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              onClick={() => markMessageRead(msg.id)}
              className={`p-5 sm:p-6 rounded-2xl bg-[#0E1322]/90 border transition-all duration-200 ${
                msg.read
                  ? 'border-slate-800/80'
                  : 'border-blue-500/40 shadow-lg shadow-blue-500/5'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-600/15 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-sm shrink-0">
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{msg.name}</span>
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      )}
                    </div>
                    <div className="text-xs text-slate-400 font-mono mt-0.5">
                      {msg.email}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {msg.timestamp}
                  </span>

                  <a
                    href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition-colors"
                  >
                    <Reply className="w-3 h-3" />
                    <span>Reply</span>
                  </a>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(msg.id, msg.name);
                    }}
                    className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-300 transition-colors"
                    title="Delete message"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="mt-3.5 space-y-2">
                <div className="text-xs font-semibold text-blue-300">
                  Subject: {msg.subject}
                </div>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-wrap bg-slate-900/60 p-4 rounded-xl border border-slate-800/80">
                  {msg.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
