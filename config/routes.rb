Rails.application.routes.draw do
  # --- Authentication Setup (Devise) ---
  # Assuming you are using Devise for API-only usage (e.g., JWT, or token-based authentication)
  # You might need to adjust this based on how Devise is configured for API use.
  # If you are using Devise Token Auth, the routes might be different (e.g., mount_devise_token_auth_for)
  devise_for :users, skip: [:registrations, :passwords, :confirmations] # Skip unnecessary views for API

  # --- API Namespace ---
  namespace :api do
    namespace :v1 do
      # Resources for finding users to assign as reviewers (e.g., /api/v1/users)
      # We skip 'show' and 'destroy' as they aren't necessary for reviewer selection.
      resources :users, only: [:index, :update] 

      # Core Project Resources
      resources :projects, only: [:index, :show, :create, :update, :destroy] do
        
        # CRITICAL: Custom route for status change (POST /api/v1/projects/:id/status)
        # This route hits the gate logic we just implemented.
        post :status, on: :member, to: 'projects#update_status'
        
        # Nested resources for a specific project
        resources :reviews, only: [:create, :index]
        resources :progress_updates, only: [:create, :index]
      end
    end
  end

  # --- Health Check ---
  get "up" => "rails/health#show", as: :rails_health_check

  # --- Remove the non-API root route ---
  # You had: root: "member#index" which points to a view; we remove this for an API project.
  # The frontend (React) handles the application routing.
end