import React, { useState } from 'react';
import { parseNaturalLanguageExpense } from '../../api/ai';
import { addExpenseApi } from '../../api/expenses'; // Existing API
import { Sparkles, Send, Check, X, AlertCircle, Loader2 } from 'lucide-react';

const NaturalLanguageExpense = ({ onExpenseAdded }) => {
  const [text, setText] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleParse = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    setError('');
    setParsedData(null);

    try {
      const res = await parseNaturalLanguageExpense(text);
      if (res.success) {
        setParsedData(res.parsedData);
      }
    } catch (err) {
      setError('Failed to understand the expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    try {
      setLoading(true);
      // Calls your existing standard expense creation endpoint
      await addExpenseApi({
        title: parsedData.title,
        amount: parsedData.amount,
        category: parsedData.category || 'General',
        date: parsedData.date || new Date().toISOString(),
        paymentMethod: parsedData.paymentMethod || 'Cash'
      });
      setText('');
      setParsedData(null);
      if (onExpenseAdded) onExpenseAdded();
    } catch (err) {
      setError('Failed to save the expense.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-indigo-100 p-5 mb-6">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-5 h-5 text-indigo-500" />
        <h3 className="font-semibold text-gray-800">Quick Add with AI</h3>
      </div>
      
      {!parsedData ? (
        <form onSubmit={handleParse} className="relative">
          <input
            type="text"
            className="w-full pl-4 pr-12 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            placeholder="e.g., 'I spent $45 on groceries at Walmart today'"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={loading}
          />
          <button 
            type="submit" 
            disabled={loading || !text.trim()}
            className="absolute right-2 top-2 p-1.5 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
          </button>
        </form>
      ) : (
        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
          <p className="text-sm text-indigo-800 font-medium mb-3">Does this look right?</p>
          
          <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
            <div><span className="text-gray-500">Title:</span> <span className="font-semibold">{parsedData.title || '—'}</span></div>
            <div><span className="text-gray-500">Amount:</span> <span className="font-semibold text-red-600">{parsedData.amount ? `$${parsedData.amount}` : '—'}</span></div>
            <div><span className="text-gray-500">Category:</span> <span className="font-semibold">{parsedData.category || '—'}</span></div>
            <div><span className="text-gray-500">Date:</span> <span className="font-semibold">{parsedData.date || '—'}</span></div>
          </div>

          {parsedData.missingFields?.length > 0 && (
            <div className="flex items-start gap-2 text-xs text-orange-700 bg-orange-100 p-2 rounded mb-3">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p>Missing info: {parsedData.missingFields.join(', ')}. Default values will be used.</p>
            </div>
          )}

          <div className="flex gap-2">
            <button onClick={handleConfirm} disabled={loading} className="flex-1 bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 flex items-center justify-center gap-2">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Check className="w-4 h-4" /> Confirm & Add</>}
            </button>
            <button onClick={() => setParsedData(null)} disabled={loading} className="flex-1 bg-white border border-gray-300 text-gray-700 py-2 rounded-md font-medium hover:bg-gray-50 flex items-center justify-center gap-2">
              <X className="w-4 h-4" /> Cancel
            </button>
          </div>
        </div>
      )}
      
      {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
    </div>
  );
};

export default NaturalLanguageExpense;