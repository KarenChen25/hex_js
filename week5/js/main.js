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
        form: {
            name: '',
            email: '',
            tel: '',
            address: '',
            payment: '',
            message: '',
        }, // 自訂的資料名稱
    },
    methods: {
        submitForm() {
            console.log('送出表單');
        },
    },
});
