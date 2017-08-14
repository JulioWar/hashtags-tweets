/*jshint esversion: 6 */

// Eperando a cargar turbolinks
document.addEventListener('turbolinks:load', () => {
    // Especificiando csrf token para todos los requests
    var element = document.getElementById('app');
    Vue.http.headers.common['X-CSRF-TOKEN'] =  $('meta[name=csrf-token]').attr('content');

    // creando la aplicacion con Vue
    new Vue({
        el: element,

        data() {
            return {
                url: '/hashtag',
                selection: '',
                message: '',
                alert: false,
                processing: false,
                loading: false,
                error: false,
                previousRequest: null,
                hashtags: [],
            };
        },

        watch: {
            /*
                funcion que escucha cualquier cambio en en la variable selection
                y quita los espacios
             */
            selection() {
                this.selection = this.selection.replace(/\s+/g, '');
            }
        },
        methods: {
            // Funcion para cerror el Alert
            closeAlert() {
                this.alert = false;
            },

            // Funcion para agregar un nuevo hashtag a la base de datos
            enter() {
                if (!this.selection) return;

                this.alert = false;
                this.processing = true;

                this.$http.post(this.url, { q: this.selection }, {
                        // Cancelando request si existe un anterior
                        before(request) {
                            if (this.previousRequest) {
                                this.previousRequest.abort();
                            }

                            this.previousRequest = request;
                        }
                    })
                    .then(
                        (response) => {

                            if (!response.data.exist) {
                                // lo agregamos a la lista si no existe
                                this.hashtags.push(response.data);
                            } else {
                                // acutalizamos el registro si ya existe
                                for (let i = 0; i < this.hashtags.length; i++) {
                                    if (this.hashtags[i].id == response.data.id) {
                                        this.hashtags[i] = response.data;
                                        break;
                                    }
                                }

                            }

                            this.processing = false;
                        },
                        (response) => {
                            this.showAlert(response);
                            this.processing = false;
                        }
                    );
            },

            // Funcion para eliminar un hashtag de la base de datos
            removeHashtag(hashtag) {

                if (hashtag.disabled) return;

                hashtag.disabled = true;
                this.$http.delete(this.url + '/' + hashtag.id)
                    .then(
                        () => {
                            this.hashtags = this.hashtags.filter((item) => {
                                return item.id !== hashtag.id;
                            });
                        },
                        (response) => {
                            this.showAlert(response);
                            hashtag.disabled = false;
                        }
                    );
            },

            // Funcion para definr el mensaje de error y mostrar el alert
            showAlert(response) {
                if(response.status === 0) return;

                const body = response.body;
                if (body.message) {
                    this.message = body.message;
                } else {
                    this.message = response.statusText;
                }

                this.alert = true;
            },

            // Sincronizar todos los hashtags existentes en la base de datos
            refreshHashtags() {
                this.error = false;
                this.loading = true;

                this.$http.get(this.url)
                    .then(
                        (response) => {
                            this.hashtags = response.data;
                            this.loading = false;
                        },
                        (response) => {
                            this.showAlert(response);
                            this.loading = false;
                            this.error = true;
                        }
                    );
            }

        },
        mounted() {
            // Sincronizando la informacion cuando inicia la aplicacion
            this.refreshHashtags();
        }
    });

});
