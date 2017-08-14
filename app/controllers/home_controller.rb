
def collect_with_max_id(collection=[], max_id=nil, &block)
  response = yield(max_id)
  collection += response
  response.empty? ? collection.flatten : collect_with_max_id(collection, response.last.id - 1, &block)
end

def $twitter.get_all_tweets(query)
  collect_with_max_id do |max_id|
    options = {count: 200, include_rts: true}
    options[:max_id] = max_id unless max_id.nil?
    search(query, options).collect.to_a
  end
end

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

            hashtag.exist = exist

            render :json => hashtag
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
