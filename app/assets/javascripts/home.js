/*jshint esversion: 6 */

document.addEventListener('turbolinks:load', () => {
    var element = document.getElementById('app');
    Vue.http.headers.common['X-CSRF-TOKEN'] =  $('meta[name=csrf-token]').attr('content');
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
            enter() {
                if (!this.selection) return;

                this.alert = false;
                this.processing = true;

                this.$http.post(this.url, { q: this.selection }, {
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
                            } else {

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
                            this.alert = true;
                            this.processing = false;
                        }
                    );
            },
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
            showAlert(response) {
                if(response.status === 0) return;

                const body = response.body;
                if (body.message) {
                    this.message = body.message;
                } else {
                    this.message = response.statusText;
                }
            },
            refreshHashtags() {
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
                        }
                    );
            }

        },
        mounted() {
            this.refreshHashtags();
        }
    });

});
