require 'twitter'

$twitter = Twitter::REST::Client.new do |config|
  config.consumer_key        = "G6jFnYa1ZlO6KcoPsRPrUlSQw"
  config.consumer_secret     = "ecWDBftsyHTfWXBfMqO3TIHIgbPBRSfX4DuwZDTN2yt5eQ5n5A"
  config.access_token        = "1385959446-1Ju1hZ1EBpPdAPrss74F0XmlBQo30bprhWGW3I1"
  config.access_token_secret = "mFWGVAsS5IfRyo5dhCKYMyKJC0GgQvvfLm1ycyZcCf2Xj"
end
