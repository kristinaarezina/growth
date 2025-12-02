import React, { useState } from 'react';
import { Search, UserPlus, Send, CheckCircle } from 'lucide-react';
import ReviewerSelect from './ReviewerSelect'


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
}

export default ProjectForm;