/*jshint esversion: 6 */

document.addEventListener('turbolinks:load', () => {
    var element = document.getElementById('app');
    new Vue({
        el: element,
        data() {
            return {
                url: '/hashtag',
                selection: '',
                message: '',
                alert: false,
                processing: false,
                previousRequest: null,
                hashtags: [],
            };
        },
        watch: {
            selection() {
                this.selection = this.selection.replace(/\s+/g, '');
            }
        },
        methods: {
            closeAlert() {
                this.alert = false;
            },
            removeHashtag() {
                this.$http.delete(this.url.)
            },
            enter() {
                if (!this.selection) return;

                this.processing = true;
                this.$http.get(this.hashtag + '?q=' + this.selection, {
                        before(request) {
                            if (this.previousRequest) {
                                this.previousRequest.abort();
                            }

                            this.previousRequest = request;
                        }
                    })
                    .then(
                        (response) => {
                            console.log(response);
                            if (!response.data.exist) {
                                this.hashtags.push(response.data);
                            }
                            this.processing = false;
                        },
                        (response) => {
                            const body = response.body;
                            if (body.message) {
                                this.message = body.message;
                            } else {
                                this.message = response.statusText;
                            }
                            this.alert = true;
                            this.processing = false;
                        }
                    );
            }

        },
        mounted() {
            console.log('Hello World', this );
        }
    });

});
