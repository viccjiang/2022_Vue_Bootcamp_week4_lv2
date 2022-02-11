import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

//匯入都寫在前面
import pagination from './pagination.js';

const site = 'https://vue3-course-api.hexschool.io/v2';
const apiPath = 'jiangs2022vue3';

// 需要重複呼叫
let productModal = null;
let delProductModal = null;

const app = createApp({
  // 區域註冊 pagination 
  components :{
    pagination
  },
  data() {
    return {
      products: [], // 預期會取得產品資料，這裡要先定義
      tempProduct: { // modal 資料對應過來
        imagesUrl: [], // 預期多圖的部分會放在這，陣列
      },
      isNew: false, // 判斷新增或編輯
      pagination : {},
    }
  },
  methods: {
    // 確認登入是否正確，用 POST請求
    checkLogin() {
      // 1.先取出 Token
      const token = document.cookie.replace(/(?:(?:^|.*;\s*)jiangsToken\s*=\s*([^;]*).*$)|^.*$/, '$1');
      // 2.每次發送請求時都把 token 加到 headers
      axios.defaults.headers.common['Authorization'] = token;

      const url = `${site}/api/user/check`;
      axios.post(url)
        .then((res) => {
          console.log(res);
          this.getData(); // 觸發取得產品列表這個方法
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = 'login.html';
        })
    },
    // 取得遠端資料，用 GET 取得產品列表
    getData(page = 1) { // 參數預設值，切換頁面時可傳入參數
      // 這支API是物件
      // page 的帶法是 /?page=${page}
      const url = `${site}/api/${apiPath}/admin/products/?page=${page}`;
      axios.get(url).then((res) => {
        // 把取得的資料賦予到定義的 products 變數上
        this.products = res.data.products;
        
        // 題外話：以下是將物件轉為陣列的方法 (把值取出)
        // console.log(Object.values(this.products));
        
        // 取出分頁資訊
        this.pagination = res.data.pagination;
      }).catch((err) => {
        alert(err.data.message);
      })
    },
    
    openModal(status, product) {
      console.log(status,product);
      // 如果是新的，tempProduct 要重置
      if (status === 'isNew') {
        this.tempProduct = {
          imagesUrl: [],
        };
        productModal.show();
        this.isNew = true;
      // 如果是編輯 ，物件是傳參考，所以要把產品資料 "淺拷貝" 過來
      } else if (status === 'edit') {
        this.tempProduct = { ...product };
        productModal.show();
        this.isNew = false;
      // 如果是刪除 ，物件是傳參考，所以要把產品資料 "淺拷貝" 過來
      } else if (status === 'delete') {
        this.tempProduct = { ...product };
        delProductModal.show()
      }
    },

    
  },
  mounted() {
    // 在 mounted 生命週期就直接觸發登入行為
    this.checkLogin();
    // 初始化 Modal 在 mounted 生命週期建立 ( 取得 dom 元素要在 mounted )
    // 建立實體化後賦予到 productModal變數
    productModal = new bootstrap.Modal(document.getElementById('productModal'), {
      keyboard: false 
    });

    // // 測試是否成功抓到 modal的 dom元素
    // productModal.show();

    // // 3 秒後關閉 modal 
    // setTimeout(()=>{
    //   productModal.hide();
    // },3000);
    
    // 刪除的 modal
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
      keyboard: false
    });

  },
});

// 全域註冊
app.component('productModal',{
  props:['tempProduct','isNew'],
  template:'#templateForProductModal',
  methods:{
    // 新增、編輯只有方法不同，modal打開都長一樣，一個有帶資料一個沒有帶，其他程式碼都差不多，所以可以共用
    updateProduct() {
      let url = `${site}/api/${apiPath}/admin/product`; 
      let method = 'post';

      // 不是新的資料，就把 method 變數賦值為 put 編輯修改 
      if (!this.isNew) {
        url = `${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
        method = 'put'
        console.log('updateProduct', this.isNew); // 這裡可以抓到值
      }
      // 可以切換方法 method 變數
      axios[method](url, { data: this.tempProduct })
        .then((response) => {
          alert(response.data.message);
          productModal.hide(); // 按下確認後會關閉 modal
          // this.getData(); // 接著會取得產品資料(更新畫面)
          this.$emit('get-products');
        }).catch((err) => {
          alert(err.data.message);
        })
    },
    createImages() {
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    },
  }
})

app.component('delModal',{
  props:['tempProduct','isNew'],
  template:'#templateForDelModal',
  methods:{
    // 新增、編輯只有方法不同，modal打開都長一樣，一個有帶資料一個沒有帶，其他程式碼都差不多，所以可以共用
    delProduct() {
      const url = `${site}/api/${apiPath}/admin/product/${this.tempProduct.id}`;
      // 用刪除的 api 方法 delete
      axios.delete(url).then((response) => {
        alert(response.data.message);
        delProductModal.hide();
        // this.getData();
        this.$emit('get-products')
      }).catch((err) => {
        alert(err.data.message);
      })
    },
  }
})

app.mount('#app');
