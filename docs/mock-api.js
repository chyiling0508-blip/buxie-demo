// ── 假後端（GitHub Pages 展示版用） ──
// 這個網站沒有後端：付款、登入、加入會員、聯絡表單都由這裡回傳假結果，
// 資料不會離開瀏覽器，也不會真的扣款或寄信。
// 之後接上真後端時，只要把下面每個函式改成呼叫 API（例如 fetch），回傳格式維持一樣即可。
(function () {
  'use strict';

  var LATENCY = 600; // 模擬網路延遲（毫秒）

  function reply(data) {
    return new Promise(function (resolve) {
      setTimeout(function () { resolve(data); }, LATENCY);
    });
  }

  function orderNo() {
    var d = new Date();
    return 'DEMO-' + d.getFullYear() + String(d.getMonth() + 1).padStart(2, '0') + String(d.getDate()).padStart(2, '0') +
      '-' + String(Math.floor(Math.random() * 1000)).padStart(3, '0');
  }

  window.MockAPI = {
    // 結帳：回傳訂單編號。真後端會在這裡建立訂單並導向金流
    createOrder: function (order) {
      return reply({ ok: true, orderNo: orderNo(), order: order });
    },
    // 聯絡表單：真後端會寄信或存進資料庫
    sendContact: function (message) {
      return reply({ ok: true });
    },
    // 加入會員：真後端會建立帳號
    joinMember: function (profile) {
      return reply({ ok: true, member: { name: profile.name || '展示會員', level: '會員' } });
    },
    // 登入（Google／手機簡訊／Email）：展示版輸入任何內容都會成功
    login: function (method) {
      return reply({ ok: true, member: { name: '展示會員', method: method } });
    },
    // 簡訊驗證碼：展示版不會真的發簡訊
    sendCode: function (phone) {
      return reply({ ok: true, hint: '展示版不會發送簡訊，驗證碼隨意輸入即可' });
    }
  };
})();
