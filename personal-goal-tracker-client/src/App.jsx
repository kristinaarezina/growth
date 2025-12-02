import React, { useState} from 'react';
import ProjectForm from './components/ProjectForm'
import ProjectDetail from './components/ProjectDetail'

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