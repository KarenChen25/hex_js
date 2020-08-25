// 將 VeeValidate input 驗證工具載入 作為全域註冊
Vue.component('ValidationProvider', VeeValidate.ValidationProvider);

// 將 VeeValidate 完整表單 驗證工具載入 作為全域註冊
Vue.component('ValidationObserver', VeeValidate.ValidationObserver);

// 匯入語系檔案
import zh_TW from './zh_TW.js';

// 加入至 VeeValidate 的設定檔案
VeeValidate.localize('tw', zh_TW);

VeeValidate.configure({
    classes: {
        valid: 'is-valid',
        invalid: 'is-invalid',
    },
});

// 實體化 Vue 物件，並傳入特定屬性及方法
new Vue({
    // 將 Vue 綁定我們所自訂的元素上
    el: '#app',

    // Vue 有雙向綁定的特性，在此需要先定義基本的資料才能進行綁定
    data: {
        products: [],
        form: {
            name: '',
            email: '',
            tel: '',
            address: '',
            payment: '',
            message: '',
        }, // 自訂的資料名稱
        productMore: {
            num: 0,
        },
        isLoading: false,
        status: { loadingItem: '' },
        carts: [],
        cartTotal: 0,
        api: {
            token: '',
            path: 'https://course-ec-api.hexschool.io/api/',
            uuid: '622aca82-f046-487a-a10e-aa00aabcc682',
        },
    },
    created() {
        this.api.token = document.cookie.replace(/(?:(?:^|.*;\s*)karentoken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        //預設帶入 token
        axios.defaults.headers.common.Authorization = `Bearer ${this.api.token}`;

        if (this.api.token == '') {
            window.location = 'productPage.html';
        } else {
            this.getProducts(1);
        }
        this.getCart();
    },
    methods: {
        getProducts(page = 1) {
            console.log('getProducts');
            const url = `${this.api.path}${this.api.uuid}/ec/products?page=${page}`;
            this.isLoading = true;
            axios
                .get(url)
                .then(response => {
                    console.log('get products complete');
                    this.products = response.data.data;
                    this.isLoading = false;
                })
                .catch(error => {
                    this.isLoading = false;
                });
        },
        getMore(id) {
            this.status.loadingItem = id;
            const url = `${this.api.path}${this.api.uuid}/ec/product/${id}`;
            axios.get(url).then(response => {
                this.productMore = response.data.data;
                this.$set(this.productMore, 'num', 1);
                $('#productModal').modal('show');
                console.log('get productdetails complete');
            });
        },
        addToCart(id, quantity = 1) {
            console.log(id, quantity);
            const url = `${this.api.path}${this.api.uuid}/ec/shopping`;
            const cart = {
                product: id,
                quantity: quantity,
            };
            console.log(cart);
            axios
                .post(url, cart)
                .then(response => {
                    this.isLoading = true;
                    console.log(response);
                    $('#productModal').modal('hide');
                    this.getCart();
                })
                .catch(error => {
                    this.isLoading = false;
                    console.log(error.response);
                    $('#productModal').modal('hide');
                    this.getCart();
                });
            // this.delAllCart();
        },
        getCart() {
            const url = `${this.api.path}${this.api.uuid}/ec/shopping`;
            axios
                .get(url)
                .then(response => {
                    this.carts = response.data.data;
                    this.updateTotal();
                })
                .catch(error => {
                    console.log(error.response);
                });
        },
        updateTotal() {
            this.cartTotal = 0;
            this.carts.forEach(item => {
                this.cartTotal = item.product.price * item.quantity;
            });
        },
        updateQuantity(id, quantity = 1) {
            console.log(id, quantity);
            const url = `${this.api.path}${this.api.uuid}/ec/shopping`;
            const cart = {
                product: id,
                quantity: quantity,
            };
            console.log(cart);
            axios
                .patch(url, cart)
                .then(response => {
                    this.isLoading = true;
                    console.log(response);
                    this.getCart();
                })
                .catch(error => {
                    this.isLoading = false;
                    console.log(error.response);
                });
            // this.delAllCart();
        },
        delCartItem(id) {
            const url = `${this.api.path}${this.api.uuid}/ec/shopping/${id}`;
            axios.delete(url).then(response => {
                alert('刪除單一產品');
                this.getCart();
                // this.updateTotal();
            });
        },
        delAllCart() {
            const url = `${this.api.path}${this.api.uuid}/ec/shopping/all/product`;
            axios.delete(url).then(response => {
                console.log('全部刪除');
                alert('全部刪除');
                this.getCart();
                // this.updateTotal();
            });
        },
        createOrder() {
            this.isLoading = true;
            const url = `${this.api.path}${this.api.uuid}/ec/orders`;

            axios
                .post(url, this.form)
                .then(response => {
                    if (response.data.data.id) {
                        this.isLoading = false;
                        $('#orderModal').modal('show');
                        this.getCart();
                    }
                })
                .catch(error => {
                    this.isLoading = false;
                    console.log(error.response.data.errors);
                });
        },
    },
});
