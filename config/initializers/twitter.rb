require 'twitter'

$twitter = Twitter::REST::Client.new do |config|
  config.consumer_key        = "G6jFnYa1ZlO6KcoPsRPrUlSQw"
  config.consumer_secret     = "ecWDBftsyHTfWXBfMqO3TIHIgbPBRSfX4DuwZDTN2yt5eQ5n5A"
  config.access_token        = "1385959446-1Ju1hZ1EBpPdAPrss74F0XmlBQo30bprhWGW3I1"
  config.access_token_secret = "mFWGVAsS5IfRyo5dhCKYMyKJC0GgQvvfLm1ycyZcCf2Xj"
end

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
