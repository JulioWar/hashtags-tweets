class HomeController < ApplicationController

    def index
        # Devolvemos la vista por defecto
    end

    def all
        # Devolviendo todos los hashtag en la base de datos
        render :json => Hashtag.all
    end

    def add
        begin
            query = params[:q]
            hashtag = nil
            exists = false
            results = $twitter.get_all_tweets("##{query}")

            if Hashtag.exists?(hashtag: query)
                # Si existe en la base de datos solamente lo obtenemos para
                # actualizar el contador
                hashtag = Hashtag.find_by(hashtag: query)
                exists = true
            else
                # Si no existe, creamos uno nuevo
                hashtag = Hashtag.new
                hashtag.hashtag = query
            end

            # Guardamos
            hashtag.count = results.size
            hashtag.save

            # Devolvemos el modelo nuevo o el actualizado
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
            # Si existe en la base de datos lo eliminamos
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
