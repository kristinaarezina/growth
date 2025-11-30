class DesignatedReviewer < ApplicationRecord
  belongs_to :project
  belongs_to :reviewer
end
