
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
        
    end

    def add
        begin
            logger.debug "##{params[:q]}"
            results = $twitter.get_all_tweets("##{params[:q]}")
            logger.debug results.size.to_s
            render :json => { count: results.size, hashtag: params[:q] }
        rescue Exception => e
            render :json => { message: e.message }, status: 500
        end
    end

    def remove
        begin

            render :json => {}
        rescue Exception => e
            render :json => { message: e.message }, status: 500
        end
    end
end
