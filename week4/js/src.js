new Vue({
    el: '#app',
    data: {
        products: [],
        editProduct: {
            imageUrl: [],
        },
        isNew: false,
        loadingBtn: '',

        // 連線用
        api: {
            token: '',
            path: 'https://course-ec-api.hexschool.io/api/',
            uuid: '622aca82-f046-487a-a10e-aa00aabcc682',
        },
        // 分頁資訊
        pagination: {},
    },
    created() {
        this.api.token = document.cookie.replace(/(?:(?:^|.*;\s*)karentoken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
        //預設帶入 token
        axios.defaults.headers.common.Authorization = `Bearer ${this.api.token}`;

        if (this.api.token == '') {
            window.location = 'login.html';
        } else {
            this.getProducts(1);
        }
    },
    methods: {
        getProducts(page = 1) {
            console.log('getProducts');
            const url = `${this.api.path}${this.api.uuid}/admin/ec/products?page=${page}`;
            axios.get(url).then(response => {
                console.log('get products complete');
                this.products = response.data.data; // 取得產品列表
                this.pagination = response.data.meta.pagination; // 取得分頁資訊

                this.editProduct = { imageUrl: [] };
                $('#editPanel').modal('hide');
                $('#delePanel').modal('hide');
            });
        },
        openPanel(mode, index, item) {
            switch (mode) {
                case 'delete':
                    this.editProduct = Object.assign({}, this.products[index]);
                    $('#delePanel').modal('show');
                    break;
                case 'edit':
                    this.loadingBtn = item.id;
                    const url = `${this.api.path}${this.api.uuid}/admin/ec/product/${item.id}`;
                    axios.get(url).then(response => {
                        this.editProduct = response.data.data;
                        this.isNew = false;
                        $('#editPanel').modal('show');
                        this.loadingBtn = '';
                    });
                    break;
                case 'new':
                    this.editProduct = {
                        imageUrl: [],
                    };
                    this.isNew = true;
                    $('#editPanel').modal('show');
                    break;
            }
        },
        deleteOrNot(bol) {
            if (bol) {
                const url = `${this.api.path}${this.api.uuid}/admin/ec/product/${this.editProduct.id}`;
                axios.delete(url).then(res => {
                    this.getProducts();
                });
            } else {
                this.getProducts();
            }
        },
    },
});
