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
        productMore: {},
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
    },
    methods: {
        submitForm() {
            console.log('送出表單');
        },
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
            const url = `${this.api.path}${this.api.uuid}/ec/product/${id}`;
            axios.get(url).then(response => {
                this.productMore = response.data.data;

                $('#productModal').modal('show');
                console.log('get productdetails complete');
            });
        },
    },
});
