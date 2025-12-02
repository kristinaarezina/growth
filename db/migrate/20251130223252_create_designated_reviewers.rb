class CreateDesignatedReviewers < ActiveRecord::Migration[7.0]
  def change
    create_table :designated_reviewers do |t|
      t.references :project, null: false, foreign_key: true, unique : true
      t.references :reviewer, null: false, foreign_key: { to_table: :users } , unique: true

      t.timestamps
    end
    # Ensure a reviewer can only be designated once per project
    add_index :designated_reviewers, [:project_id, :reviewer_id], unique: true
  end
end