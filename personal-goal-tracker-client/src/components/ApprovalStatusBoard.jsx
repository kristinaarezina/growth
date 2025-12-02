import React, { useState } from 'react';
import { CheckCircle, Clock, ArrowRight, FileText, MinusCircle } from 'lucide-react';
import StatusBadge from './StatusBadge'

// --- 4. Core Component: Approval Status Board (Styling Updated) ---
const ApprovalStatusBoard = ({ project, setProjectData }) => {
    const { id, designated_reviewers, reviews, unique_approvals_count, status } = project;
    const requiredApprovals = 2; 
    const isApproved = unique_approvals_count >= requiredApprovals;
    const isExecution = status === 'Execution';

    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [statusMessage, setStatusMessage] = useState(null);

    const handleMoveToExecution = async () => {
        if (!isApproved || isExecution) return;

        setIsUpdatingStatus(true);
        setStatusMessage(null);

        try {
            // Mocking API CALL: POST /api/v1/projects/:id/status
            await new Promise(resolve => setTimeout(resolve, 1000));
            const updatedProject = { ...project, status: 'Execution' };

            setProjectData(updatedProject); 
            setStatusMessage({ type: 'success', text: `Project successfully moved to Execution status! Time to get started!` });

        } catch (err) {
            setStatusMessage({ type: 'error', text: err.message || 'Error: Could not start execution.' });
        } finally {
            setIsUpdatingStatus(false);
        }
    };
    
    // Determine the main status banner content
    let banner = { text: '', color: 'bg-slate-50 text-slate-700 border-slate-300', icon: Clock };
    if (isExecution) {
        banner = { text: 'Project is ACTIVE (Execution Phase)', color: 'bg-teal-50 text-teal-800 border-teal-300', icon: CheckCircle };
    } else if (isApproved) {
        banner = { text: 'Ready for Execution! Get Started Now.', color: 'bg-green-50 text-green-700 border-green-300', icon: CheckCircle };
    } else if (unique_approvals_count > 0) {
        banner = { text: `Awaiting Approvals (${unique_approvals_count}/${requiredApprovals} Signed Off)`, color: 'bg-amber-50 text-amber-700 border-amber-300', icon: Clock };
    } else {
        banner = { text: 'Awaiting Initial Approvals', color: 'bg-red-50 text-red-700 border-red-300', icon: MinusCircle };
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center border-b pb-3">
                <FileText className="w-5 h-5 mr-3 text-indigo-600"/> Approval Gate Status
            </h3>
            
            {statusMessage && (
                <div 
                    className={`p-3 rounded-xl mb-4 text-sm font-medium ${statusMessage.type === 'success' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'} border`}
                    role="alert"
                >
                    {statusMessage.text}
                </div>
            )}

            {/* Overall Status Banner */}
            <div className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl mb-6 ${banner.color} border shadow-inner`}>
                <div className="flex items-center font-bold text-lg mb-2 sm:mb-0">
                    <banner.icon className="w-6 h-6 mr-3 flex-shrink-0" />
                    {banner.text}
                </div>
                
                {/* Move to Execution Button */}
                <button 
                    onClick={handleMoveToExecution}
                    disabled={!isApproved || isExecution || isUpdatingStatus}
                    className={`px-4 py-2 rounded-lg text-white font-medium transition flex items-center shadow-md text-sm whitespace-nowrap ${
                        isApproved && !isExecution
                            ? 'bg-green-600 hover:bg-green-700'
                            : 'bg-slate-400 cursor-not-allowed'
                    }`}
                >
                    {isUpdatingStatus ? 'Processing...' : isExecution ? 'Active' : 'Move to Execution'}
                    {!isExecution && <ArrowRight className="w-4 h-4 ml-2" />}
                </button>
            </div>


            <h4 className="text-lg font-semibold text-slate-700 mb-3">Accountability Partners ({requiredApprovals} Approvals Required)</h4>
            
            {/* Reviewer List/Grid */}
            <div className="space-y-3">
                {designated_reviewers.map(reviewer => (
                    <div key={reviewer.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm">
                        <div className="flex items-center">
                            {/* Simple Avatar Placeholder */}
                            <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm mr-3">
                                {reviewer.name ? reviewer.name[0] : reviewer.email[0]}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium text-slate-800 text-sm">{reviewer.name || reviewer.email}</span>
                                <span className="text-xs text-slate-500">{reviewer.email}</span>
                            </div>
                        </div>
                        <StatusBadge reviewer={reviewer} projectReviews={reviews} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ApprovalStatusBoard;