Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root "home#index"

  get  "/hashtag", to: "home#all", as: "all"

  post "/hashtag", to: "home#add", as: "add"

  delete "/hashtag/:id", to: "home#remove", as: "remove"

end
