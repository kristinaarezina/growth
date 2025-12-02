import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, UserPlus, X, Send, CheckCircle, Clock, ArrowRight, XCircle, FileText, MinusCircle, User } from 'lucide-react';

// --- 3. Helper: Reviewer Status Badge (Styling Updated) ---
const StatusBadge = ({ reviewer, projectReviews = [] }) => {
    const review = projectReviews.find(r => r.user_id === reviewer.id);

    if (!review) {
        return (
            <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-300">
                <Clock className="w-3 h-3 mr-1" /> Pending
            </span>
        );
    }

    if (review.is_approved) {
        return (
            <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700 border border-green-300">
                <CheckCircle className="w-3 h-3 mr-1" /> Approved
            </span>
        );
    }

    return (
        <span className="inline-flex items-center text-xs font-medium px-3 py-1 rounded-full bg-red-100 text-red-700 border border-red-300">
            <XCircle className="w-3 h-3 mr-1" /> Denied
        </span>
    );
};

export default StatusBadge;