class CreateProgressUpdates < ActiveRecord::Migration[8.1]
  def change
    create_table :progress_updates do |t|
      t.date :date
      t.boolean :worked_on
      t.text :notes
      t.references :project, null: false, foreign_key: true

      t.timestamps
    end
  end
end
