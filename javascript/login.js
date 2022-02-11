// 載入vue esm，可以先用單引號
import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.0.9/vue.esm-browser.js';

const site = 'https://vue3-course-api.hexschool.io/v2';

// vue 起手式，放入三大結構
const app = createApp({
  data() {
    // function return 
    return {
      user: {
        username: '',
        password: '',
      },
    };
  },
  methods: {
    login() {
      // 先確保登入資訊是否有取得
      // console.log(this.user);

      // 以下的 axios 方法與路徑務必先確認
      const url = `${site}/admin/signin`;
      // 遠端請求登入 POST ，api，帶上資料 .then .catch 捕捉正確錯誤訊息
      axios.post(url, this.user)
        .then((res) => {
          console.log(res);
          // const  token = res.data.token;
          // const  expired = res.data.expired;
          // 取得正確回應之後，取出 token, expired ，用解構形式定義變數，將以上兩行以解構型式撰寫
          const { token, expired } = res.data;
          // 改用反引號，寫入 cookie ，儲存 token，到期日設置 expires 儲存 expired 要用 unix timestamp 轉換
          document.cookie = `jiangsToken=${token};expires=${new Date(expired)}; path=/`;
          // 登入成功之後用 window.location 轉址到 products.html 產品頁面
          window.location = 'index.html';
        })
        .catch((error) => {
          alert(error.data.message);
        });
    },
  },
})

app.mount('#app');
