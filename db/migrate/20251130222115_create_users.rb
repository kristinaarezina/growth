class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    create_table :users do |t|
      t.string :email
      t.string :slack_user_id
      t.string :password_digest

      t.timestamps
    end
  end
end
