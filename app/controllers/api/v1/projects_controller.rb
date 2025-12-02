module Api
    module V1
      class ProjectsController < ApplicationController
        def index
          render json: { status: "ok" }
        end
      end
    end
  end
  