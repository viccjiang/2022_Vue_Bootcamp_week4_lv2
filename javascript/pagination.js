//  預設匯出
export default {
    // 把分頁資訊傳進來
    props : ['pages'],// 用 pages 來接收
    // 元件樣板
    template : `<nav aria-label="Page navigation example">
    <ul class="pagination">

      <li class="page-item" :class="{disabled:!pages.has_pre}">
        <a class="page-link" href="#" aria-label="Previous">
          <span aria-hidden="true">&laquo;</span>
        </a>
      </li>

      <li class="page-item" 
        :class="{active:page===pages.current_page}"
        v-for="page in pages.total_pages" :key="page+'page'">
        <a class="page-link" href="#" 
        @click="$emit('get-products',page)">{{page}}</a>
      </li>

      <li class="page-item" :class="{disabled:!pages.has_next}">
        <a class="page-link" href="#" aria-label="Next">
          <span aria-hidden="true">&raquo;</span>
        </a>
      </li>

    </ul>
  </nav>`
}

// 元件重點
// 分頁功能 props
// v-for
// :class disable
// :class active
// 頁面切換 emit
// 內部發送事件到外面 這裡是不建立 methods 的方式 直接寫在樣板 自訂名稱 帶入頁面 @click="$emit('get-product',page)"

// 前一頁與下一頁的切換 ? 該如何做 ?