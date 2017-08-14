class CreateHashtags < ActiveRecord::Migration[5.0]
    def up
      create_table :hashtags do |t|
          t.string :hashtag
          t.string :count
      end
    end
    def down
        drop_table :hashtags
    end
end
