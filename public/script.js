Vue.prototype.$http = axios;

const PRICE = 9.99;
const LOAD_NUM = 10;

new Vue({
    el: '#app',
    data: {
        results: [],
        products: [],
        cart: [],
        newSearch: '',
        lastSearchTerm: '',
        loading: false,
    },
    mounted(){
        this.newSearch = 'Anime';
        this.onSubmit();

        let elem = document.getElementById('product-list-bottom');
        let watcher = scrollMonitor.create(elem, 100);
        watcher.enterViewport(() => {
            this.appendItems();
        });
    },
    methods: {
        appendItems(){
            console.log('append items');
            if(this.results.length > 0){
                if(this.products.length < this.results.length){
                    let append = this.results.slice(this.products.length, this.products.length + LOAD_NUM);
                    this.products = this.products.concat(append);
                }else{

                }
            }
        },
        onSubmit(){
            this.products = [];
            this.lastSearchTerm = '';
            this.loading = true;
            this.$http
                .get('/search/'.concat(this.newSearch))
                .then(response => {
                    console.log(response);
                    let data = response.data;
                    data = data.map(item => Object.assign({}, {url: item.link, price: PRICE}, item));
                    this.lastSearchTerm = this.newSearch;
                    this.loading = false;
                    this.results = data;
                    this.products = this.results.slice(0,  LOAD_NUM);
                });
        },
        getItemById(id){
            return this.products.find(product => product.id === id);
        }
        ,
        addItem(productid){
            let cartIndex = this.cart.findIndex(cartItem => cartItem.id === productid);
            if (cartIndex != -1) {
                this.cart[cartIndex].count++;
            } else {
                let cartItem = Object.assign({}, this.getItemById(productid), {count: 1, price: PRICE});
                this.cart.push(cartItem)

            }
        }
        ,
        removeItem(productid){
            let i = this.cart.findIndex(cartItem => cartItem.id === productid);
            if (i != -1) {
                if (this.cart[i].count <= 1) {
                    this.cart.splice(i, 1);
                } else {
                    this.cart[i].count--;
                }
            }
        }
    },
    computed: {
        total(){
            return this.cart.reduce((pre, cur) => pre + (cur.count * cur.price), 0);
        },
        noMoreItems(){
            return this.products.length === this.results.length & this.results.length > 0;
        }
    },
    filters: {
        currency(value){
            return "$".concat(value.toFixed(2));
        }
    }
});


