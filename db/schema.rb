# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2025_11_30_223252) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "designated_reviewers", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.bigint "project_id", null: false
    t.bigint "reviewer_id", null: false
    t.datetime "updated_at", null: false
    t.index ["project_id", "reviewer_id"], name: "index_designated_reviewers_on_project_id_and_reviewer_id", unique: true
    t.index ["project_id"], name: "index_designated_reviewers_on_project_id"
    t.index ["reviewer_id"], name: "index_designated_reviewers_on_reviewer_id"
  end

  create_table "progress_updates", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.date "date"
    t.text "notes"
    t.bigint "project_id", null: false
    t.datetime "updated_at", null: false
    t.boolean "worked_on"
    t.index ["project_id"], name: "index_progress_updates_on_project_id"
  end

  create_table "projects", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.text "description"
    t.integer "duration_days"
    t.text "impact"
    t.text "plan_execution"
    t.string "status"
    t.string "title"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.string "visibility"
    t.index ["user_id"], name: "index_projects_on_user_id"
  end

  create_table "reviews", force: :cascade do |t|
    t.text "body"
    t.datetime "created_at", null: false
    t.datetime "feedback_date"
    t.boolean "is_approved"
    t.bigint "project_id", null: false
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.index ["project_id"], name: "index_reviews_on_project_id"
    t.index ["user_id"], name: "index_reviews_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "email"
    t.string "password_digest"
    t.string "slack_user_id"
    t.datetime "updated_at", null: false
  end

  add_foreign_key "designated_reviewers", "projects"
  add_foreign_key "designated_reviewers", "users", column: "reviewer_id"
  add_foreign_key "progress_updates", "projects"
  add_foreign_key "projects", "users"
  add_foreign_key "reviews", "projects"
  add_foreign_key "reviews", "users"
end
