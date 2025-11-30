class CreateDesignatedReviewers < ActiveRecord::Migration[8.1]
  def change
    create_table :designated_reviewers do |t|
      t.references :project, null: false, foreign_key: true
      t.references :reviewer, null: false, foreign_key: true

      t.timestamps
    end
  end
end
