import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, UserPlus, X, Send, CheckCircle, Clock, ArrowRight, XCircle, FileText, MinusCircle, User } from 'lucide-react';
import ApprovalStatusBoard from './ApprovalStatusBoard'

// --- 5. Project Detail Component (Styling Updated) ---
const ProjectDetail = ({ projectData, setProjectData }) => {
    if (!projectData) {
        return <div className="text-center p-10 text-slate-500">Loading project details...</div>;
    }

    const { title, description, duration_days, status, created_at, reviews } = projectData;
    
    // Component for Reviewer Feedback
    const ReviewFeedback = () => (
        <div className="max-w-6xl mx-auto bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
            <h2 className="text-xl font-bold text-indigo-700 mb-4 border-b pb-3">Reviewer Feedback ({reviews.length})</h2>
            
            {reviews.length === 0 ? (
                <p className="text-slate-500 italic">No feedback submitted yet. Waiting for designated reviewers...</p>
            ) : (
                <div className="space-y-4">
                    {reviews.map(review => {
                        const reviewer = projectData.designated_reviewers.find(r => r.id === review.user_id);
                        const isApproved = review.is_approved;
                        const borderColor = isApproved ? 'border-green-300' : 'border-red-300';
                        const bgColor = isApproved ? 'bg-green-50' : 'bg-red-50';
                        const statusText = isApproved ? 'Approved' : 'Denied';

                        return (
                            <div key={review.id} className={`p-4 rounded-xl border-l-4 ${borderColor} ${bgColor}`}>
                                <div className="flex justify-between items-center mb-2">
                                    <p className="font-bold text-sm text-slate-800 flex items-center">
                                        {reviewer?.name || reviewer?.email || `User ${review.user_id}`}
                                    </p>
                                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${isApproved ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                                        {statusText}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{review.body}</p>
                                <p className="text-xs text-slate-500 mt-2">Submitted: {review.created_at}</p>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
    
    return (
      <div className="w-full p-4 md:p-8 bg-slate-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-2">{title}</h1>
            <p className="text-base text-slate-600 mb-6">Status: <span className={`font-semibold ${status === 'Execution' ? 'text-teal-600' : 'text-amber-600'}`}>{status}</span> | Proposed Duration: {duration_days} days | Submitted: {created_at}</p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Column: Approval Status Board & Reviews */}
                <div className="lg:col-span-2 space-y-8">
                    <ApprovalStatusBoard project={projectData} setProjectData={setProjectData} />

                    {/* Project Proposal Card */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                        <h2 className="text-xl font-bold text-indigo-700 mb-4 border-b pb-3">Proposal Description</h2>
                        <p className="text-slate-700 whitespace-pre-wrap leading-relaxed">{description}</p>
                    </div>

                    <ReviewFeedback />
                </div>

                {/* Right Column: Progress Tracking/Streak */}
                <div className="lg:col-span-1 space-y-8">
                    {/* Placeholder for Action Button */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                        <h2 className="text-xl font-bold text-teal-700 mb-4">Take Action</h2>
                        <button
                             className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-bold rounded-xl text-white bg-indigo-500 hover:bg-indigo-600 transition shadow-md"
                        >
                            Submit Your Review
                        </button>
                        <p className="text-xs text-slate-500 mt-3 text-center">*(If you are a designated reviewer)*</p>
                    </div>

                    {/* Placeholder for StreakCalendar */}
                    <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
                        <h2 className="text-xl font-bold text-teal-700 mb-4 border-b pb-3">Execution Streak</h2>
                        <p className="text-slate-500 text-sm italic">
                            This streak tracks daily check-ins once the project is in the Execution phase.
                        </p>
                        <div className="text-5xl font-extrabold text-teal-600 mt-4">17</div>
                        <p className="text-lg font-semibold text-teal-600">Day Current Streak</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProjectDetail;