# app/models/project.rb
class Project < ApplicationRecord
  belongs_to :user # project owner
  
  
  has_many :reviews, dependent: :destroy
  has_many :progress_updates, dependent: :destroy
  
  
  # Designated reviewers
  has_many :designated_reviewers, dependent: :destroy
  has_many :reviewers,
  through: :designated_reviewers,
  source: :reviewer
  
  
  # --- 2-Approval Gate Logic (Designated Reviewer–Based) ---
  # Project becomes executable only when:
  # 1. Two or more designated reviewers exist
  # 2. Those designated reviewers submit approved reviews
  # 3. Approvals must come from two UNIQUE designated reviewers
  
  
  # All approved reviews from designated reviewers
  def approved_designated_reviews
  reviews
  .where(is_approved: true)
  .where(user_id: reviewers.select(:id))
  end
  
  
  # Count unique designated reviewers who have approved
  def unique_approving_designated_reviewers_count
  approved_designated_reviews.select(:user_id).distinct.count
  end
  
  
  # Required business rule:
  # Must have approvals from 2 distinct designated reviewers
  def ready_for_execution?
  unique_approving_designated_reviewers_count >= 2
  end
  
  
  # Gate status helper for UI or API responses
  def gate_status
  if ready_for_execution?
  :approved
  elsif approved_designated_reviews.exists?
  :awaiting_additional_approvals
  else
  :no_approvals_yet
  end
  end
  end