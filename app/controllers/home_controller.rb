class HomeController < ApplicationController

    def index
    end

    def all
        render :json => Hashtag.all
    end

    def add
        begin
            query = params[:q]
            hashtag = nil
            exists = false
            results = $twitter.get_all_tweets("##{query}")

            if Hashtag.exists?(hashtag: query)
                hashtag = Hashtag.find_by(hashtag: query)
                exists = true
            else
                hashtag = Hashtag.new
                hashtag.hashtag = query
            end

            hashtag.count = results.size
            hashtag.save

            render :json => {
                id: hashtag.id,
                hashtag: hashtag.hashtag,
                count: hashtag.count,
                exist: exists
            }
        rescue Exception => e
            render :json => { message: e.message }, status: 500
        end
    end

    def remove
        begin
            if Hashtag.exists?(id: params[:id])
                hashtag = Hashtag.find_by(id: params[:id])
                hashtag.destroy
            end
            render :json => {}
        rescue Exception => e
            render :json => { message: e.message }, status: 500
        end
    end
end
