/*jshint esversion: 6 */

document.addEventListener('turbolinks:load', () => {
    var element = document.getElementById('app');
    new Vue({
        el: element,
        data() {
            return {
                selection: '',
                open: false,
                current: -1,
                hashtags: [],
                suggestions: [
                    {
                        hashtag: 'bestcart',
                        count: 20
                    },
                    {
                        hashtag: 'hashtag',
                        count: 30
                    }
                ]
            };
        },
        computed: {
            matches() {
                return this.suggestions.filter((obj) => {
                    return obj.hashtag.indexOf(this.selection) >= 0;
                });
            },
            openSuggestion() {
                return this.selection !== "" &&
                       this.matches.length != 0 &&
                       this.open === true;
            }
        },
        methods: {
            //When enter pressed on the input
            enter() {
                this.suggestionClick(this.current);
            },

            //When up pressed while suggestions are open
            up() {
                if(this.current > 0)
                    this.current--;
            },

            //When up pressed while suggestions are open
            down() {
                if(this.current < this.matches.length - 1)
                    this.current++;
            },

            //For highlighting element
            isActive(index) {
                return index === this.current;
            },

            //When the user changes input
            change() {
                if (this.open == false) {
                    this.open = true;
                    this.current = 0;
                }
            },

            //When one of the suggestion is clicked
            suggestionClick(index) {
                this.selection = this.matches[index].hashtag;
                this.hashtags.push(Object.assign({},this.matches[index]));
                console.log(this.hashtags);
                this.open = false;
            },

            sayHello() {
                this.open = !this.open;
            }
        },
        mounted() {
            console.log('Hello World', this );
        }
    });

});
