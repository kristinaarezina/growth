class Api::V1::UsersController < ApplicationController
    # Assumes authentication is handled by a before_action (e.g., authenticate_user!)
  
    # GET /api/v1/users?query=jane@example.com
    def index
      query = params[:query].to_s.downcase
      
      # We only want to search by email or partial name match
      # Exclude the current user from the list of potential reviewers
      users = User.where.not(id: current_user.id)
                  .where("lower(email) LIKE :query OR lower(name) LIKE :query", query: "%#{query}%")
                  .limit(10)
  
      # Return only the necessary details for selection
      render json: users.select(:id, :email, :name) 
    end
    
    # ... other actions like 'update' could be here if needed for user profile.
  
    private
    
    # Temporary mock for current_user until full Devise authentication is integrated
    def current_user
      # NOTE: Replace this with the actual authenticated user helper provided by Devise/JWT!
      User.first || User.create!(email: "mock_user_1@example.com", password: "password", name: "Mock Owner") 
    end
  end