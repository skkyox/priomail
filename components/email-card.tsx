'use client';

import { Mail, AlertCircle, FileText, Zap } from 'lucide-react';

interface EmailCardProps {
  subject: string;
  sender: string;
  category: string;
  urgencyScore: number;
  summary: string;
  onClick?: () => void;
}

export function EmailCard({
  subject,
  sender,
  category,
  urgencyScore,
  summary,
  onClick,
}: EmailCardProps) {
  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'Urgent':
        return <AlertCircle className="w-4 h-4" />;
      case 'Devis':
      case 'Facture':
        return <FileText className="w-4 h-4" />;
      case 'Newsletter':
        return <Mail className="w-4 h-4" />;
      default:
        return <Zap className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (cat: string) => {
    const colors: { [key: string]: string } = {
      'Urgent': 'bg-red-100 text-red-800',
      'Devis': 'bg-blue-100 text-blue-800',
      'Facture': 'bg-green-100 text-green-800',
      'Newsletter': 'bg-gray-100 text-gray-800',
      'Personnel': 'bg-purple-100 text-purple-800',
      'Autre': 'bg-yellow-100 text-yellow-800',
    };
    return colors[cat] || 'bg-gray-100 text-gray-800';
  };

  const getUrgencyColor = (score: number) => {
    if (score > 80) return 'bg-red-600';
    if (score > 50) return 'bg-yellow-600';
    return 'bg-green-600';
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer border-l-4 border-blue-500"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 line-clamp-2">{subject}</h3>
          <p className="text-xs text-gray-500 mt-1">{sender}</p>
        </div>
        <div className={`px-2 py-1 rounded text-xs font-medium flex items-center gap-1 ${getCategoryColor(category)}`}>
          {getCategoryIcon(category)}
          {category}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{summary}</p>

      <div className="flex items-center gap-3">
        <div className="flex-1 bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${getUrgencyColor(urgencyScore)}`}
            style={{ width: `${urgencyScore}%` }}
          />
        </div>
        <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">{urgencyScore}%</span>
      </div>
    </div>
  );
}
