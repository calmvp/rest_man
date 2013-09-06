RestMan::Application.routes.draw do
  get '/customer/find/restaurant_profiles', to: "restaurant_profiles#find"
  get '/restaurant_profiles/find', to: "restaurant_profiles#search" 
  # The priority is based upon order of creation:
  # first created -> highest priority.

  resources :restaurant_profiles do
    resources :menu, only: [:index, :new, :create] do
      resources :categories, only: [:index, :new, :create] do
        resources :menu_items, only: [:index, :new, :create], :controller => "menu_items"
      end
    end
  end

  resources :menus, only: [:show, :edit, :update, :destroy]
  resources :menu_items, only: [:show, :edit, :update, :destroy]
  resources :categories, only: [:show, :edit, :update, :destroy]


  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'restaurant_profiles#find'


  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id))(.:format)'
end
