class DesignatedReviewer < ApplicationRecord
  belongs_to :project
  # Reviewer is a user, so need to specify the class name
  belongs_to :reviewer, class_name: 'User'

  # Validation to ensure a user isn't assiggned twice to the same project
  validates :reviewer_id, uniqueness: {scope: :project_id}
end
