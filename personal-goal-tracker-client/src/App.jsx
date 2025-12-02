import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Search, UserPlus, X, Send, CheckCircle, Clock, ArrowRight, XCircle, FileText, MinusCircle, User } from 'lucide-react';


// Mock API base URL (replace with your actual Rails API URL if needed)
const API_BASE_URL = '/api/v1'; 

// --- MOCK DATA ---
const MOCK_PROJECT = {
    id: 1,
    title: "Launch Personal Portfolio Site",
    description: "Build a single-page React portfolio to showcase recent projects. Must include contact form functionality, be fully responsive (mobile-first), and achieve a lighthouse performance score of 95+.\n\nKey Milestones:\n1. Wireframe Completion (Day 7)\n2. Initial React Component Build (Day 20)\n3. Contact Form API Integration (Day 30)\n4. Final Polish and Deployment (Day 45)",
    duration_days: 45,
    status: 'Proposal', // Can be 'Proposal', 'Execution', 'Complete'
    owner_id: 1,
    created_at: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    
    designated_reviewers: [
        { id: 2, email: "alice.r@example.com", name: "Alice R." },
        { id: 3, email: "bob.l@example.com", name: "Bob L." },
        { id: 4, email: "claire.d@example.com", name: "Claire D." },
    ],
    reviews: [
        { id: 101, user_id: 2, body: "Great plan, but include a fallback for the contact form if the API fails. Otherwise, it's a solid proposal. Approved!", is_approved: true, created_at: "2025-11-28" },
        { id: 102, user_id: 3, body: "Looks solid. Design must prioritize mobile-first approach as stated. Approved!", is_approved: true, created_at: "2025-11-29" },
    ],
    unique_approvals_count: 2, 
    gate_status_code: 'approved', // 'approved', 'awaiting_additional_approvals', 'no_approvals_yet'
};
// --- END MOCK DATA ---


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

// --- 2. Project Proposal Form Component (Styling Updated) ---
const ProjectForm = ({ setCurrentView, updateProjectData }) => {
    const initialProjectState = {
        title: '',
        description: '',
        impact: '',
        duration_days: 30,
        visibility: 'Shared', 
    };
    const [project, setProject] = useState(initialProjectState);
    const [designatedReviewers, setDesignatedReviewers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState(null);
    const currentUserId = 1; 

    const isFormValid = project.title && project.description && designatedReviewers.length >= 2;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProject(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setMessage({ type: 'error', text: 'Please complete all required fields and assign at least 2 reviewers.' });
            return;
        }

        setIsSubmitting(true);
        setMessage(null);

        const payload = {
            project: {
                ...project,
                reviewer_ids: designatedReviewers.map(r => r.id),
            }
        };

        try {
            // Mocking POST request to /api/v1/projects endpoint
            await new Promise(resolve => setTimeout(resolve, 1500));
            const newProject = { ...MOCK_PROJECT, title: project.title, description: project.description, unique_approvals_count: 0, reviews: [], gate_status_code: 'no_approvals_yet', status: 'Proposal' };
            
            setMessage({ type: 'success', text: `Project "${newProject.title}" proposal created successfully!` });
            
            // Use the passed function to update data and switch view
            updateProjectData(newProject);
            setCurrentView({ name: 'detail', id: newProject.id, data: newProject });

        } catch (err) {
            setMessage({ type: 'error', text: err.message || 'An unexpected error occurred during submission.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "mt-1 block w-full rounded-xl border-slate-300 shadow-sm text-sm p-3 focus:border-indigo-500 focus:ring-indigo-500 transition";
    const labelClasses = "block text-sm text-slate-700 font-medium";

    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 bg-slate-50 min-h-screen">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-8">Submit New Project Proposal</h1>
            
            {message && (
                <div 
                    className={`p-4 rounded-xl mb-6 shadow-md ${message.type === 'success' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-700 border border-red-200'}`}
                    role="alert"
                >
                    {message.text}
                </div>
            )}

                <form 
                  onSubmit={handleSubmit}
                  className="w-full max-w-full space-y-8 bg-white p-6 md:p-10 rounded-none shadow-none"
                >
                {/* Project Details Section */}
                <section className="space-y-5">
                    <h2 className="text-xl font-bold text-indigo-700 border-b pb-3 mb-4 flex items-center">
                        <CheckCircle className="w-5 h-5 mr-3" /> Project Details
                    </h2>
                    
                    <label className={labelClasses}>
                        Title *
                        <input
                            type="text"
                            name="title"
                            value={project.title}
                            onChange={handleChange}
                            required
                            className={inputClasses}
                            placeholder="e.g., Launch Personal Portfolio Site"
                        />
                    </label>

                    <label className={labelClasses}>
                        Description *
                        <textarea
                            name="description"
                            value={project.description}
                            onChange={handleChange}
                            rows="5"
                            required
                            className={inputClasses}
                            placeholder="What exactly will you do and how will you measure success? Include key milestones."
                        ></textarea>
                    </label>

                    <label className={labelClasses}>
                        Expected Duration (Days)
                        <input
                            type="number"
                            name="duration_days"
                            value={project.duration_days}
                            onChange={handleChange}
                            min="1"
                            max="365"
                            className={inputClasses}
                        />
                    </label>
                </section>

                <hr className="border-slate-100" />

                {/* Reviewer Assignment Section */}
                <section className="space-y-5">
                    <h2 className="text-xl font-bold text-indigo-700 border-b pb-3 mb-4 flex items-center">
                        <UserPlus className="w-5 h-5 mr-3" /> Accountability Partners
                    </h2>
                    <ReviewerSelect
                        designatedReviewers={designatedReviewers}
                        setDesignatedReviewers={setDesignatedReviewers}
                        currentUserId={currentUserId}
                    />
                </section>
                
                <hr className="border-slate-100" />

                {/* Submission Button */}
                <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-lg font-bold rounded-xl text-white shadow-xl transition-all duration-300 transform hover:scale-[1.01] ${
                        isFormValid && !isSubmitting
                            ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-300'
                            : 'bg-slate-400 cursor-not-allowed shadow-slate-300'
                    }`}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Proposal for Approval'}
                    <Send className="w-5 h-5 ml-3" />
                </button>
            </form>
        </div>
    );
};

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


// --- 6. Main Application Component ---
const App = () => {
    const [currentProjectData, setCurrentProjectData] = useState(MOCK_PROJECT);
    const [currentView, setCurrentView] = useState({ name: 'detail', id: MOCK_PROJECT.id, data: MOCK_PROJECT }); 

    const updateProjectData = (newProject) => {
        setCurrentProjectData(newProject);
        setCurrentView(prev => ({ ...prev, data: newProject }));
    };
    
    return (
        <div className="font-sans antialiased bg-slate-100 min-h-screen min-w-screen">
            {/* Navigation Bar */}
            <header className="bg-white shadow sticky top-0 z-20">
                <div className="w-full px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold text-indigo-600">Goal Gate</h1>
                    <div className="flex space-x-3">
                         <button 
                            onClick={() => setCurrentView({ name: 'detail', id: MOCK_PROJECT.id, data: currentProjectData })}
                            className="text-sm font-medium px-3 py-1.5 rounded-lg text-slate-600 hover:bg-slate-100 transition"
                        >
                            View Detail
                        </button>
                        <button 
                            onClick={() => setCurrentView({ name: 'form' })}
                            className="text-sm font-medium px-3 py-1.5 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600 transition shadow-md"
                        >
                            + New Proposal
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {currentView.name === 'form' && <ProjectForm setCurrentView={setCurrentView} updateProjectData={updateProjectData} />}
                {currentView.name === 'detail' && 
                    <ProjectDetail 
                        projectData={currentProjectData} 
                        setProjectData={updateProjectData} 
                    />}

                <div className="mt-12 text-center text-slate-400 text-xs pb-10">
                    UI Status: {currentView.name}
                </div>
            </main>
        </div>
    );
};

export default App;