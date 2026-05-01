import React from 'react';

interface Props {
  onClick: () => void;
  isOpen: boolean;
}

export default function AIFloatingButton({ onClick, isOpen }: Props) {
  return (
    <button
      onClick={onClick}
      className={`ai-floating-btn ${isOpen ? 'active' : ''}`}
      title="Open AI Sidebar"
    >
      <span className="ai-icon">✨</span>
      
      <style jsx>{`
        .ai-floating-btn {
          position: fixed;
          bottom: 30px;
          right: 30px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
          border: none;
          color: white;
          font-size: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 25px -5px rgba(99, 102, 241, 0.5);
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1100;
        }
        .ai-floating-btn:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 15px 35px -5px rgba(99, 102, 241, 0.6);
        }
        .ai-floating-btn.active {
          transform: rotate(90deg);
          border-radius: 20px;
        }
        .ai-icon {
          line-height: 1;
        }
      `}</style>
    </button>
  );
}
