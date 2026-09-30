import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';

interface ConnectModalProps {
  recipientName: string;
  recipientRole?: string;
  onClose: () => void;
  onSend: (message: string) => void;
}

export const ConnectModal: React.FC<ConnectModalProps> = ({
  recipientName,
  recipientRole,
  onClose,
  onSend
}) => {
  const [message, setMessage] = useState(
    `Hi ${recipientName}, I came across your validated projects on GEOVA and loved your architecture. Would love to connect and exchange thoughts on technical design!`
  );
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => {
      onSend(message);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display font-bold text-lg text-[#0b1c30]">
              Connect with {recipientName}
            </h2>
            {recipientRole && <p className="text-xs text-[#464555]">{recipientRole}</p>}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#777587] hover:text-[#0b1c30] rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sent ? (
          <div className="py-6 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-[#2e7d32] mx-auto" />
            <h3 className="font-bold text-base text-[#0b1c30]">Message Sent!</h3>
            <p className="text-xs text-[#464555]">Invitation and chat initiated with {recipientName}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#0b1c30] mb-1">
                Personalized Note
              </label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={4}
                required
                className="w-full bg-[#f8f9ff] border border-[#c7c4d8]/60 focus:border-[#3525cd] rounded-xl p-3 text-xs text-[#0b1c30] outline-hidden"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#eceef3]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#464555] hover:bg-[#eceef3] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#3525cd] hover:bg-[#1e00a9] text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                Send Request
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
