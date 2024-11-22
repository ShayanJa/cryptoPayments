import React from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-fadeIn">
      <div 
        className="fixed inset-0 bg-black/50 animate-fadeIn" 
        onClick={onClose} 
      />
      <div className="relative z-50 w-full max-w-md mx-4 animate-slideUp">
        <div className="relative bg-white rounded-xl shadow-xl">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          {children}
        </div>
      </div>
    </div>
  );
}