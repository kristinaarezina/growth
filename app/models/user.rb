class User < ApplicationRecord
    # Devise handles authentication. Ensure Devise is installed and
    # the appropriate migrations were generated (e.g. :database_authenticatable).
    devise :database_authenticatable, :registerable, :validatable
    
    
    # Projects this user owns (project owner)
    has_many :projects, dependent: :destroy
    
    
    # Reviews this user submits (review submitter)
    has_many :reviews, dependent: :destroy
    
    
    # Join records where this user is listed as a designated reviewer
    has_many :designated_reviews,
    foreign_key: :reviewer_id,
    class_name: 'DesignatedReviewer',
    dependent: :destroy
    
    
    # Projects this user is assigned to review via the designated_reviews join table
    has_many :projects_to_review,
    through: :designated_reviews,
    source: :project
    
    
    # Basic validations
    validates :email, presence: true, uniqueness: true
    end