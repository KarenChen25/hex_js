Vue.component('modal', {
    template: `<div class="modal-dialog  modal-xl">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title" id="productModalLabel">{{isNew?"新增產品":"編輯產品"}}</h5>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body">
        <div class="row">
          <div class="col-sm-4">
            <div class="form-group">
              <label for="imageUrl">圖片網址</label>
              <input id="imageUrl" type="text" placeholder="請輸入圖片連結" class="form-control"
                v-model="editProduct.imageUrl[0]" />
            </div>
            <img :src="editProduct.imageUrl[0]" class="img-fluid" />
          </div>
          <div class="col-sm-8">
            <div class="form-group">
              <label for="productTitle">產品名稱</label>
              <input id="productTitle" type="text" placeholder="請輸入產品名稱" class="form-control"
                v-model="editProduct.title" />
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="productCategory">分類</label>
                <input id="productCategory" type="text" placeholder="請輸入分類" class="form-control"
                  v-model="editProduct.category" />
              </div>
              <div class="form-group col-md-6">
                <label for="productUnit">單位</label>
                <input id="productUnit" type="text" placeholder="請輸入單位" class="form-control"
                  v-model="editProduct.unit" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group col-md-6">
                <label for="productOriginPrice">原價</label>
                <input id="productOriginPrice" type="number" placeholder="請輸入原價" class="form-control"
                  v-model="editProduct.origin_price" />
              </div>
              <div class="form-group col-md-6">
                <label for="productPrice">售價</label>
                <input id="productPrice" type="number" placeholder="請輸入售價" class="form-control"
                  v-model="editProduct.price" />
              </div>
            </div>
            <hr>
            <div class="form-group">
              <label for="productDescription">產品描述</label>
              <input id="productDescription" type="text" placeholder="請輸入產品描述" class="form-control"
                v-model="editProduct.description" />
            </div>
            <div class="form-group">
              <label for="productContent">產品說明</label>
              <input id="productContent" type="text" placeholder="請輸入產品說明" class="form-control"
                v-model="editProduct.content" />
            </div>
            <div class="form-check">
              <input id="is_enabled" type="checkbox" class="form-check-input" v-model="editProduct.enabled" />
              <label for="is_enabled" class="form-check-label">是否啟用</label>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click='updateProduct(false)'>取消</button>
        <button type="button" class="btn btn-primary" @click="updateProduct(true)">確認</button>
      </div>
    </div>
  </div>`,
    props: ['editProduct', 'api', 'isNew'],
    methods: {
        updateProduct(bol) {
            if (bol) {
                // 欄位確認
                switch ('') {
                    case this.editProduct.title:
                        alert('請輸入標題');
                        return;
                    case this.editProduct.category:
                        alert('請輸入屬性');
                        return;
                    case this.editProduct.content:
                        alert('請輸入內容');
                        return;
                    case this.editProduct.imageUrl[0]:
                        alert('請輸入圖片網址');
                        return;
                }

                let url = '';
                if (this.isNew) {
                    url = `${this.api.path}${this.api.uuid}/admin/ec/product`;
                    axios.post(url, this.editProduct).then(res => {
                        this.$emit('update');
                    });
                } else {
                    // 連線
                    url = `${this.api.path}${this.api.uuid}/admin/ec/product/${this.editProduct.id}`;
                    axios.patch(url, this.editProduct).then(res => {
                        this.$emit('update');
                    });
                }
            } else {
                this.$emit('update');
            }
        },
    },
});
