class SessionsController < ApplicationController

  def new
  end

  def create
    @user = User.find_by_email(params[:email])
    if @user && @user.authenticate(params[:password])
      if @user.profileable_type == "CustomerProfile"
        session[:customer_profile_id] = @user.profileable_id
        redirect_to customer_find_restaurant_profiles_url
      elsif @user.profileable_type == "RestaurantProfile"
        session[:restaurant_profile_id] = @user.profileable.id
        redirect_to restaurant_dashboard_url
      end
    else
      flash[:notice] = "Invalid username or password."
      render "new"
    end
  end

  def destroy
    reset_session
    redirect_to new_session_url, :notice => "You've successfully logged out"
  end
end
