class CustomerProfilesController < ApplicationController

  before_filter :authorize_customer, :except => [:new, :create]

  def index
  end

  def create
    @customer = CustomerProfile.new(params[:customer_profile])
    @user = User.new(params[:user])
	  if @customer.save
		  session[:customer_id] = @customer.id
		  redirect_to customer_find_restaurant_profiles_url
	  else
		  render :new
	  end
  end

  def new
    @customer = CustomerProfile.new
    @customer.build_user
  end

  def edit
    @customer = CustomerProfile.find(params[:id])
  end

  def show
    @customer = CustomerProfile.find(params[:id])
  end

  def update
    @customer = CustomerProfile.find(params[:id])
	  if @customer.update_attributes(email: params[:customer_profile][:email]) # this is unnecessary, update_attributes saves the record  - && @customer.save
	    redirect_to customer_profiles_url
	  else
	    render :edit
	  end
  end

  def find
  end

  def search
    query = params[:query].split.map {|term| "%#{term}%" }
    # move this to a model scope that takes an argument
    sql = "restaurant_name LIKE ? OR city LIKE ? OR state LIKE?"
    @restaurants = RestaurantProfile.where([sql, query, query, query])
    render "customer_profiles/find"
  end
end
