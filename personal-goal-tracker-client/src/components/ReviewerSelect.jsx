import React, { useState, useEffect, useCallback, useMemo, Clock } from 'react';
import { Search, UserPlus, X, MinusCircle, User } from 'lucide-react';


// --- 1. Reviewer Selection Component (Styling Updated) ---
const ReviewerSelect = ({ designatedReviewers, setDesignatedReviewers, currentUserId }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const availableResults = useMemo(() => {
        const designatedIds = designatedReviewers.map(r => r.id);
        return searchResults.filter(user => !designatedIds.includes(user.id));
    }, [searchResults, designatedReviewers]);

    const handleSearch = useCallback(async (query) => {
        if (query.length < 3) {
            setSearchResults([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        
        try {
            // Mocking the API call
            const data = [
                { id: 5, email: "mark.s@example.com", name: "Mark S." },
                { id: 6, email: "jane.d@example.com", name: "Jane D." },
                { id: 7, email: "admin@corp.com", name: "Admin User" },
            ].filter(user => user.email.includes(query) || user.name.includes(query));

            await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
            
            const filteredData = data.filter(user => user.id !== currentUserId);
            setSearchResults(filteredData);

        } catch (err) {
            setError("Could not search for users. Try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [currentUserId]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearch(searchTerm);
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [searchTerm, handleSearch]);

    const addReviewer = (reviewer) => {
        if (!designatedReviewers.find(r => r.id === reviewer.id)) {
            setDesignatedReviewers([...designatedReviewers, reviewer]);
            setSearchTerm(''); 
            setSearchResults([]);
        }
    };

    const removeReviewer = (reviewerId) => {
        setDesignatedReviewers(designatedReviewers.filter(r => r.id !== reviewerId));
    };

    return (
        <div className="space-y-4">
            <h3 className="text-base font-semibold text-slate-700">Designated Reviewers ({designatedReviewers.length}/2+ Required)</h3>
            
            {/* Reviewer Search Input */}
            <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                    type="text"
                    placeholder="Search reviewers by email or name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 transition shadow-sm"
                />
            </div>

            {/* Search Results */}
            {isLoading && <p className="text-slate-500 text-sm flex items-center"><Clock className="w-4 h-4 mr-2 animate-spin"/> Searching...</p>}
            {error && <p className="text-red-600 text-sm p-3 bg-red-50 rounded-lg border border-red-200">{error}</p>}
            
            {availableResults.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-xl shadow-md max-h-40 overflow-y-auto">
                    {availableResults.map((user) => (
                        <div key={user.id} className="flex justify-between items-center p-3 border-b border-slate-100 last:border-b-0 hover:bg-indigo-50 transition">
                            <span className="text-sm font-medium text-slate-700 truncate">{user.name || user.email}</span>
                            <button
                                type="button"
                                onClick={() => addReviewer(user)}
                                className="text-indigo-600 hover:text-indigo-800 p-1 rounded-full hover:bg-white transition"
                                title="Add as Reviewer"
                            >
                                <UserPlus className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            
            {/* Designated Reviewer Chips */}
            {designatedReviewers.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                    {designatedReviewers.map(reviewer => (
                        <div 
                            key={reviewer.id} 
                            className="flex items-center bg-indigo-50 text-indigo-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-inner border border-indigo-200"
                        >
                            <User className="w-3 h-3 mr-1" />
                            <span className="truncate max-w-xs">{reviewer.name || reviewer.email}</span>
                            <button
                                type="button"
                                onClick={() => removeReviewer(reviewer.id)}
                                className="ml-2 text-indigo-500 hover:text-indigo-700 transition"
                                title="Remove Reviewer"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
             {/* Approval Requirement Status */}
            {designatedReviewers.length < 2 && (
                <p className="text-sm text-amber-700 bg-amber-50 p-3 rounded-xl border border-amber-200 flex items-center">
                    <MinusCircle className="w-4 h-4 mr-2 flex-shrink-0"/>
                    A minimum of 2 designated reviewers is required for project approval.
                </p>
            )}
        </div>
    );
};

export default ReviewerSelect;