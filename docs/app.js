(function () {
  'use strict';

  var PAGES = ['home', 'products', 'campaign', 'plans', 'checkout', 'thanks', 'contact', 'faq', 'join', 'map'];

  // 網站架構：[id, 頁名, 頁面任務, 入口, 區塊, 下一步]
  var SITE_MAP = [
    ['home', '首頁', '讓第一次來的人三秒內知道這是什麼', '選單', ['主標：每個月，收到一束不會謝的花', '一句說明＋起始價格', '成品照', '接下來三個月的主題', '六條商品線入口', '三步驟：選尺寸與週期／每月換主題／自取或宅配'], 'plans'],
    ['products', '全部商品', '讓想買單件或客製的人看懂六條商品線', '選單／首頁', ['六條商品線總覽表', '各商品線：代表款、客製、價格、交期', '訂製流程四步驟', '保存說明', '導向聯絡我們或訂閱方案'], 'contact'],
    ['campaign', '節日企劃', '讓客人提早知道每個檔期的主打商品與截單日', '選單／首頁橫幅', ['切換節日：萬聖節／聖誕節／農曆年', '節日資訊與倒數天數', '主打商品', '關鍵日期：預購、早鳥、場佈、寄送、面交截單', '貼文時程', '注意事項'], 'products'],
    ['plans', '訂閱方案', '三個方案並排，讓他選一個', '選單／首頁', ['繳費週期：單次購買／月繳／季繳／半年／一次買斷 N 個月', '三欄並排：小束 5 朵／中束 7 朵／大束 9 朵', '依週期顯示總金額', '材質說明：消氣、褪色、非長期保存品'], 'checkout'],
    ['checkout', '結帳', '收款，只做這件事', '方案頁按鈕', ['配色偏好', '起始月份與取貨方式', '送禮對象與卡片留言', '付款方式與發票資訊', '訂單摘要＋確認付款'], 'thanks'],
    ['thanks', '感謝頁', '告訴他接下來會收到什麼、什麼時候', '付款完成', ['訂單編號', '時間軸：確認信／主題預覽／第一束出貨／之後每月'], 'home'],
    ['contact', '聯絡我們', '接住沒有要買、但想問一句的人', '選單／感謝頁／常見問題', ['回覆時間說明', 'IG 私訊、LINE、Email、電話', '簡短表單'], 'home'],
    ['faq', '常見問題', '擋掉重複的來信', '選單／首頁', ['可展開問答六則', '底部導向聯絡我們'], 'contact'],
    ['join', '加入會員', '加入後直接帶到月繳優惠方案', '選單／訂閱方案', ['會員價說明：每束少 $50', '姓名、手機、Email', '送出後跳到訂閱方案並選好月繳'], 'plans'],
    ['login', '登入', '讓會員用手機或 Email 登入，套用會員價', '選單／加入會員頁', ['Google 帳號登入', '切換手機或 Email 登入', '手機：號碼＋簡訊驗證碼', 'Email：帳號＋密碼', '導向加入會員'], 'plans']
  ];
  var FLOWS = [
    ['購買', ['home', 'plans', 'checkout', 'thanks']],
    ['詢問', ['home', 'faq', 'contact']],
    ['訂製', ['home', 'products', 'contact']],
    ['檔期', ['home', 'campaign', 'products', 'contact']],
    ['會員', ['join', 'plans', 'checkout']],
    ['登入', ['login', 'plans', 'checkout']]
  ];

  var PLANS = [
    // price／stems：訂閱每月；oncePrice／onceStems：單次購買。photo：成品照路徑；載入失敗時改顯示氣球圓點示意（dots＝花朵數）。aiPhoto：照片是 AI 生成，要標註
    { id: 's', name: '小束', stems: '5 朵', price: 600, onceStems: '3–5 朵', oncePrice: 650, desc: '放在玄關或書桌剛好的大小。', photo: 'assets/bouquet-5.jpg', aiPhoto: true, dots: 5, cluster: 'c3' },
    { id: 'm', name: '中束', stems: '7 朵', price: 800, onceStems: '6–8 朵', oncePrice: 950, desc: '客廳、店面櫃台都撐得住場面。', photo: 'assets/bouquet-7.jpg', dots: 7, cluster: 'c4' },
    { id: 'l', name: '大束', stems: '9 朵', price: 1200, onceStems: '9–12 朵', oncePrice: 1250, desc: '送禮或紀念日，拿在手上有份量。', photo: 'assets/bouquet-9.jpg', dots: 9, cluster: 'c5' }
  ];

  var BUYOUT = '一次買斷 N 個月';

  // 每組選項：值、標籤、（可選）色票
  var CHIPS = {
    cycle: ['單次購買', '月繳', '季繳', '半年', BUYOUT].map(function (v) { return { value: v }; }),
    months: [3, 6, 9, 12].map(function (m) { return { value: m, label: m + ' 個月' }; }),
    palette: [
      { value: '跟著主題' },
      { value: '粉嫩系', swatch: 'var(--balloon-blush)' },
      { value: '奶油暖黃', swatch: 'var(--balloon-butter)' },
      { value: '酒紅橄欖', swatch: 'var(--balloon-burgundy)' },
      { value: '蜜桃橘', swatch: 'var(--balloon-peach)' }
    ],
    delivery: ['雲林自取', '全台宅配', '指定日期送達'].map(function (v) { return { value: v }; }),
    payment: ['信用卡', 'ATM 轉帳', 'LINE Pay'].map(function (v) { return { value: v }; }),
    invoice: ['電子發票', '公司統編'].map(function (v) { return { value: v }; })
  };

  var DELIVERY_NOTES = {
    '雲林自取': '每月 10 日起可取貨，自取地點於訂單確認後通知。',
    '全台宅配': '每月 10 日前寄出，運費結帳後另行通知。',
    '指定日期送達': '每月同一天送達，適合固定紀念日。'
  };

  var FAQS = [
    ['氣球花可以放多久？', '約 2–4 週，會隨室溫、日照自然消氣，顏色也會慢慢褪淡。屬非長期保存品，每月換新剛好。'],
    ['每月主題怎麼決定？可以挑嗎？', '主題每月固定一個，前一個月 25 日前會先傳預覽。主題不能換，但配色可以依偏好調整。'],
    ['可以暫停或取消嗎？', '月繳可隨時取消，請在前一個月底前告知。季繳、半年、買斷為預付，可暫停一個月順延，不退款。'],
    ['宅配會不會壓壞？', '以專用紙箱固定寄送，若到貨時有破損，拍照私訊，會補一束給你。'],
    ['可以中途換尺寸嗎？', '可以，從下個月起生效，差額另外補收或折抵。'],
    ['可以送到不同地址嗎？', '可以，結帳時填收件人資料即可，每月固定同一地址。要改地址請在當月 1 日前告知。']
  ];

  // 節日行銷企劃（依 buxie-campaign skill 的五段格式）。表格內容是固定文字，允許 <b> 標記
  var CAMPAIGNS = [
    {
      id: 'halloween', tab: '萬聖節', title: '2026 萬聖節', date: '2026-10-31', dateLabel: '2026/10/31（六）',
      colors: ['#E07B2A', '#6B4C9A', '#2B241F'],
      info: '萬聖節剛好是週末，派對大多在 10/30（五）到 10/31（六）。寄送的商品最好在 <b>10/30 前送到</b>。',
      products: [
        ['<b>童趣造型擺件</b>（主力）', '南瓜、小幽靈、黑貓、小巫師女孩；也可以做成人偶加花束的組合', '小型動物款 $400／人偶擺件 $700／人偶＋花束組合 $1,000', '萬聖節就是看角色。可客製角色服裝、動物種類，延伸成萬聖節款'],
        ['<b>日常花球</b>', '萬聖節配色：橘色配紫色，或橘色配黑色的雙色花球', '桌面小款 $350／中款 $550', '價格低，適合買來自己佈置或送給同事。1–3 天就能做好，可以接到最後幾天的單'],
        ['<b>活動場佈（B2B）</b>', '店家、補習班、幼兒園的萬聖節背板', '小型背板 $3,000 起', '店家和補習班都要佈置萬聖節活動，一單金額高。要先問尺寸再報價，所以要早點截單']
      ],
      keys: [
        ['開放預購', '<b>10/5（一）</b>', 'IG 和蝦皮同步開跑'],
        ['早鳥截止（可選）', '10/12（一）', '早鳥優惠內容另行公布'],
        ['<b>場佈截單</b>', '<b>10/16（五）</b>', '大型案提前 1–2 週確認，保留場勘和進場的時間'],
        ['<b>寄送截單</b>', '<b>10/23（五）</b>', '留 3–5 天製作，10/28（三）寄出，10/30 前送到'],
        ['<b>面交截單</b>', '<b>10/26（一）</b>', '雲林面交時間是 10/29–10/31'],
        ['萬聖節', '10/31（六）', '']
      ],
      posts: [
        ['10/5（一）', 'IG＋蝦皮', '萬聖節預購開跑', '放主打款照片、起價，寫清楚截單日（寄送 10/23、面交 10/26）'],
        ['10/8（四）', 'IG', '角色款介紹', '南瓜、幽靈、黑貓、巫師女孩一次介紹，強調可以客製服裝和名牌'],
        ['10/12（一）', 'IG', '花球配色和店家場佈', '介紹橘紫、橘黑花球；招募店家場佈，提醒 <b>10/16 截單</b>'],
        ['10/15（四）', 'IG Reels', '製作過程', '拍摺氣球變成小幽靈的過程，突顯「全手工現做」'],
        ['10/19（一）', 'IG', '客人回饋＋倒數 5 天', '放已完成的訂單照片，提醒寄送 10/23 截單'],
        ['10/22（四）', 'IG 限動', '明天截單', '寄送最後一天；面交還能訂到 10/26'],
        ['10/31（六）', 'IG', '萬聖節快樂', '分享客人收到商品的照片，也可以轉發客人的限動'],
        ['11/3（二）', 'IG', '節後感謝', '謝謝大家，預告下一檔聖誕節']
      ],
      notes: [
        '<b>產能</b>：每天能做的數量請依產能填入，定好後就設為限量，額滿提早截單。',
        '<b>特殊色容易變色</b>：金屬色和特殊色久放會變色，萬聖節常用的橘色、紫色、黑色可能也會。報價或下單時先提醒客人。',
        '<b>萬聖節角色是新款</b>：南瓜、幽靈這類新造型，開預購前先各做一個樣品拍照，順便算清楚工時，再決定售價。'
      ]
    },
    {
      id: 'christmas', tab: '聖誕節', title: '2026 聖誕節', date: '2026-12-25', dateLabel: '2026/12/25（五）',
      colors: ['#C94A63', '#54724F', '#FFFFFF'],
      info: '平安夜 12/24（四）是交換禮物和聚會的高峰，寄送的商品最好在 <b>12/23 前送到</b>。訂閱制 12 月主題同樣是「冬日聖誕」，12/10 會先出一批訂閱花束。',
      products: [
        ['<b>不謝花束</b>（主力）', '紅 × 橄欖綠質感款，本來就是聖誕配色；可加白色主花、聖誕卡片', '小束 $650／中束 $950／大束 $1,250', '送禮場合最多的檔期，紅色系耐看、不易顯舊，卡片免費'],
        ['<b>日常花球</b>', '紅綠白聖誕配色的桌面花球', '桌面小款 $350／中款 $550', '交換禮物預算剛好，1–3 天可取，能接到最後幾天的單'],
        ['<b>活動場佈（B2B）</b>', '店家、補習班、企業尾牙前的聖誕背板', '小型背板 $3,000 起', '12 月店家活動多，一單金額高；需先確認尺寸再報價，要早點截單']
      ],
      keys: [
        ['開放預購', '<b>11/23（一）</b>', 'IG 和蝦皮同步開跑，萬聖節結束後先預告'],
        ['早鳥截止（可選）', '11/30（一）', '早鳥優惠內容另行公布'],
        ['<b>場佈截單</b>', '<b>12/4（五）</b>', '聖誕活動多在 12/19–12/20 週末，提前 2 週確認尺寸與進場'],
        ['<b>寄送截單</b>', '<b>12/16（三）</b>', '留 3–5 天製作，12/21（一）寄出，12/23 前送到'],
        ['<b>面交截單</b>', '<b>12/19（六）</b>', '雲林面交時間是 12/22–12/24'],
        ['聖誕節', '12/25（五）', '']
      ],
      posts: [
        ['11/23（一）', 'IG＋蝦皮', '聖誕預購開跑', '放紅綠質感花束照片、起價，寫清楚截單日（寄送 12/16、面交 12/19）'],
        ['11/26（四）', 'IG', '聖誕花束款式介紹', '小、中、大束差在哪裡，主花和緞帶可以怎麼配'],
        ['11/30（一）', 'IG', '交換禮物花球＋場佈招募', '紅綠白花球；早鳥最後一天；提醒店家場佈 <b>12/4 截單</b>'],
        ['12/3（四）', 'IG Reels', '製作過程', '拍一束聖誕花束從氣球到成品的過程'],
        ['12/10（四）', 'IG', '客人回饋＋寄送倒數', '放訂閱客人收到的 12 月花束照片，提醒寄送 12/16 截單'],
        ['12/15（二）', 'IG 限動', '明天截單', '寄送最後一天；面交還能訂到 12/19'],
        ['12/25（五）', 'IG', '聖誕快樂', '分享客人收到花束的照片，轉發客人的限動'],
        ['12/28（一）', 'IG', '節後感謝', '謝謝大家，預告農曆年開運系列']
      ],
      notes: [
        '<b>產能</b>：聖誕節和訂閱 12 月出貨撞期，每天能做的數量請依產能填入，訂閱單優先，單買設限量。',
        '<b>白色、金銀色易顯舊</b>：聖誕常用的白色和金屬色久放會變色，提醒客人不要太早收貨，建議 12/21 後到貨。',
        '<b>寄送風險</b>：12 月下旬物流量大，寄出後把單號傳給客人，遇到延誤可以改面交或提早寄。'
      ]
    },
    {
      id: 'lunar', tab: '農曆年', title: '2027 農曆年', date: '2027-02-06', dateLabel: '2027/2/6（六）春節，除夕 2/5（五）',
      colors: ['#B08D3E', '#A11F36', '#F2C38F'],
      info: '年前物流會塞車、陸續停收，寄送的商品最好在 <b>2/3 前送到</b>。開運系列依規格書在年前 2–3 週開始接單。',
      products: [
        ['<b>開運系列</b>（主力）', '財神（手捧金元寶，元寶可加「財」字）；可延伸招財貓、元寶串、發財樹', '財神擺件 $800 起，加大或加底座另計', '過年送禮與開店賀禮首選，喜氣、應景、有話題性'],
        ['<b>日常花球</b>', '紅金配色的年節桌花', '桌面小款 $350／中款 $550', '小預算送禮、店面櫃台年節佈置，1–3 天可取'],
        ['<b>活動場佈（B2B）</b>', '店家年節佈置、開工背板', '小型背板 $3,000 起', '店面過年要換佈置，年後開工也有需求；需先確認尺寸再報價']
      ],
      keys: [
        ['開放預購', '<b>1/18（一）</b>', '年前約 3 週開跑，IG 和蝦皮同步'],
        ['早鳥截止（可選）', '1/22（五）', '早鳥優惠內容另行公布'],
        ['<b>場佈截單</b>', '<b>1/22（五）</b>', '年節佈置多在年前一週進場，提前 1–2 週確認'],
        ['<b>寄送截單</b>', '<b>1/27（三）</b>', '留 3–5 天製作，2/1（一）寄出，2/3 前送到'],
        ['<b>面交截單</b>', '<b>1/30（六）</b>', '雲林面交時間是 2/2–2/4'],
        ['春節', '2/6（六）', '除夕 2/5（五）']
      ],
      posts: [
        ['1/18（一）', 'IG＋蝦皮', '開運預購開跑', '放財神照片、起價，寫清楚截單日（寄送 1/27、面交 1/30）'],
        ['1/20（三）', 'IG', '財神與年節款介紹', '元寶字樣可選「財」或「招財進寶」，介紹招財貓、元寶串'],
        ['1/22（五）', 'IG', '早鳥最後一天＋場佈截單', '紅金花球；提醒店家場佈 <b>今天截單</b>'],
        ['1/25（一）', 'IG Reels', '製作過程', '拍財神從氣球到捧元寶的過程'],
        ['1/26（二）', 'IG 限動', '明天截單', '寄送最後一天；面交還能訂到 1/30'],
        ['1/29（五）', 'IG', '客人回饋＋面交倒數', '放已完成的財神照片，提醒面交 1/30 截單'],
        ['2/6（六）', 'IG', '新年快樂', '分享客人家裡擺財神的照片'],
        ['2/15（一）', 'IG', '節後感謝', '謝謝大家，開店賀禮與開工佈置照常接單']
      ],
      notes: [
        '<b>產能</b>：預購期只有約 10 天，需求集中，每天能做的數量請依產能填入，額滿提早截單。',
        '<b>金屬金易變色</b>：財神元寶的金色久放會變色，建議年節期間展示、過節後收納，下單時先提醒客人。',
        '<b>物流停收</b>：年前各家物流停收日不同，寄送截單前再確認一次物流公告，必要時提早截單。'
      ]
    }
  ];

  // 以「今天」為準：還沒到的節日顯示倒數天數，預設打開最近一檔
  function daysUntil(iso) {
    var p = iso.split('-');
    var now = new Date();
    now.setHours(0, 0, 0, 0);
    return Math.round((new Date(+p[0], p[1] - 1, +p[2]) - now) / 86400000);
  }
  function upcomingCampaign() {
    for (var i = 0; i < CAMPAIGNS.length; i++) if (daysUntil(CAMPAIGNS[i].date) >= 0) return i;
    return CAMPAIGNS.length - 1;
  }

  var state = {
    page: 'home',
    campaign: upcomingCampaign(),
    member: false,
    plan: 'm',
    cycle: '月繳',
    months: 6,
    palette: '跟著主題',
    delivery: '全台宅配',
    payment: '信用卡',
    invoice: '電子發票',
    start: '2026年11月',
    gift: false,
    faqOpen: 0,
    contactSent: false,
    orderNo: ''
  };

  // 會員身分存在瀏覽器裡；無痕模式或封鎖儲存時就只在本次瀏覽有效
  try { state.member = localStorage.getItem('bx_member') === '1'; } catch (e) {}
  function saveMember() {
    try { localStorage.setItem('bx_member', state.member ? '1' : '0'); } catch (e) {}
  }

  function fmt(v) { return '$' + v.toLocaleString('en-US'); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function pricing() {
    var once = state.cycle === '單次購買';
    var discount = state.member ? 50 : 0;
    var off = { '季繳': 100, '半年': 200 }[state.cycle] || (state.cycle === BUYOUT ? 200 : 0);
    var n = { '單次購買': 1, '月繳': 1, '季繳': 3, '半年': 6 }[state.cycle] || state.months;
    function unit(p) { return (once ? p.oncePrice : p.price) - discount; }
    return {
      once: once, off: off, n: n, unit: unit,
      stems: function (p) { return once ? p.onceStems : p.stems; },
      sum: function (p) { return unit(p) * n - off; }
    };
  }

  // 依起始月份往後推 k 個月的月份名稱
  function monthName(k) {
    var m = parseInt(state.start.match(/(\d+)月/)[1], 10);
    return ((((m - 1 + k) % 12) + 12) % 12 + 1) + '月';
  }

  function vals() {
    var pr = pricing();
    var plan = PLANS.filter(function (p) { return p.id === state.plan; })[0];
    var pickup = state.delivery === '雲林自取';
    return {
      pr: pr,
      plan: plan,
      text: {
        joinNavLabel: state.member ? '會員' : '加入會員',
        startLabel: pr.once ? '要哪個月的主題' : '起始月份',
        deliveryNote: DELIVERY_NOTES[state.delivery],
        dueNow: fmt(pr.sum(plan)),
        orderNo: state.orderNo,
        firstWord: pr.once ? '你的花束' : '第一束',
        firstMonth: monthName(0)
      },
      show: {
        isMember: state.member,
        notMember: !state.member,
        isBuyout: state.cycle === BUYOUT,
        needsAddress: !pickup,
        needsDate: state.delivery === '指定日期送達',
        gift: state.gift,
        needsTaxId: state.invoice === '公司統編',
        needsCarrier: state.invoice === '電子發票',
        contactSent: state.contactSent,
        contactOpen: !state.contactSent
      },
      summary: [
        ['方案', plan.name + ' · ' + pr.stems(plan)],
        ['週期', state.cycle === BUYOUT ? '買斷 ' + pr.n + ' 個月' : state.cycle],
        [pr.once ? '月份' : '起始', state.start],
        ['配色', state.palette],
        ['取貨', state.delivery]
      ],
      timeline: [
        { when: '今天', what: '訂單確認信', note: '寄到你留的 Email，附訂單編號與付款明細。' },
        { when: monthName(-1) + ' 25 日前', what: monthName(0) + '主題配色預覽', note: '透過 Email 或 LINE 傳給你，想調整配色可直接回覆。' },
        {
          when: monthName(0) + ' 10 日',
          what: (pr.once ? '花束' : '第一束') + (pickup ? '可取貨' : '寄出'),
          note: pickup ? '取貨地點與時間會另外通知。' : '寄出當天附上物流單號，約 1–2 天到貨。'
        },
        pr.once
          ? { when: '之後', what: '不會再扣款', note: '喜歡的話，隨時可以回到訂閱方案改成每月訂閱。' }
          : { when: '之後每月', what: '同樣流程重複', note: pr.n > 1 ? '共 ' + pr.n + ' 個月，最後一個月前會提醒續訂。' : '每月 1 日扣款，取消請在前一個月底前告知。' }
      ]
    };
  }

  function planCardsHtml(v) {
    var pr = v.pr;
    return PLANS.map(function (p) {
      var sel = state.plan === p.id;
      var total = pr.once
        ? (state.member ? '會員價已折 $50，不續訂、不扣款' : '單買一束，不續訂、不扣款')
        : pr.n > 1 ? pr.n + ' 個月共 ' + fmt(pr.sum(p)) + '，比月繳少 $' + pr.off + '，一次付清'
        : '每月自動扣款，可隨時取消';
      var memberLine = state.member ? '會員折扣 −$' + 50 * pr.n + '，已算進上方金額' : '';
      return '<div class="plan' + (sel ? ' selected' : '') + '">' +
        '<div class="plan-photo">' +
          '<div class="cluster ' + p.cluster + '" aria-hidden="true">' + new Array(p.dots + 1).join('<i></i>') + '</div>' +
          (p.photo ? '<img src="' + p.photo + '" alt="' + p.name + (p.aiPhoto ? ' AI 示意圖' : '成品照') + '" onerror="this.remove()">' : '') +
          (p.aiPhoto ? '<span class="photo-tag">AI 示意圖</span>' : '') +
        '</div>' +
        '<div class="plan-head"><div class="h1" style="white-space:nowrap">' + p.name + '</div><div class="small muted">' + pr.stems(p) + '</div></div>' +
        '<div class="plan-price"><b>' + fmt(pr.unit(p)) + '</b><span class="small muted">' + (pr.once ? '／一束' : '／月') + '</span></div>' +
        '<div class="line" style="color:var(--ink-600)">' + total + '</div>' +
        '<div class="line member-line">' + memberLine + '</div>' +
        '<div class="desc">' + p.desc + '</div>' +
        '<button type="button" class="btn block' + (sel ? '' : ' secondary') + '" data-action="choosePlan" data-plan="' + p.id + '">選擇' + p.name + '</button>' +
        '</div>';
    }).join('');
  }

  function tableHtml(head, rows) {
    return '<table class="ctable"><thead><tr>' + head.map(function (h) { return '<th>' + h + '</th>'; }).join('') + '</tr></thead><tbody>' +
      rows.map(function (r) {
        return '<tr>' + r.map(function (c, i) { return '<td data-label="' + head[i] + '">' + (c ? '<span>' + c + '</span>' : '') + '</td>'; }).join('') + '</tr>';
      }).join('') + '</tbody></table>';
  }

  function countdown(c) {
    var d = daysUntil(c.date);
    return d > 0 ? '距離今天 ' + d + ' 天' : d === 0 ? '就是今天' : '檔期已結束';
  }

  function campaignHtml(c) {
    return '<article class="campaign stack gap-28">' +
      '<div class="campaign-head stack gap-10">' +
        '<div class="dots">' + c.colors.map(function (col) { return '<span class="dot" style="background:' + col + '"></span>'; }).join('') + '</div>' +
        '<div class="h1">' + c.title + '行銷企劃</div>' +
      '</div>' +
      '<div class="stack gap-12"><div class="h2">1. 節日資訊</div>' +
        '<div class="kv"><b>日期</b><span>' + c.dateLabel + '</span></div>' +
        '<div class="kv"><b>倒數</b><span class="campaign-count">' + countdown(c) + '</span></div>' +
        '<p class="lede">' + c.info + '</p></div>' +
      '<div class="stack gap-12"><div class="h2">2. 主打商品</div>' + tableHtml(['商品線', '推薦款式', '起價', '為什麼適合'], c.products) + '</div>' +
      '<div class="stack gap-12"><div class="h2">3. 關鍵日期</div>' + tableHtml(['項目', '日期', '說明'], c.keys) + '</div>' +
      '<div class="stack gap-12"><div class="h2">4. 貼文時程</div>' + tableHtml(['日期', '平台', '貼文主題', '重點'], c.posts) + '</div>' +
      '<div class="notice"><div class="notice-title">5. 注意事項</div><ul>' + c.notes.map(function (n) { return '<li>' + n + '</li>'; }).join('') + '</ul></div>' +
    '</article>';
  }

  function render() {
    var v = vals();

    PAGES.forEach(function (id) {
      document.querySelector('[data-page="' + id + '"]').hidden = state.page !== id;
    });
    document.querySelectorAll('[data-nav]').forEach(function (a) {
      if (a.getAttribute('data-nav') === state.page) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });

    document.querySelectorAll('[data-text]').forEach(function (el) {
      el.textContent = v.text[el.getAttribute('data-text')];
    });
    document.querySelectorAll('[data-show]').forEach(function (el) {
      el.hidden = !v.show[el.getAttribute('data-show')];
    });

    document.querySelectorAll('[data-chips]').forEach(function (el) {
      var key = el.getAttribute('data-chips');
      el.innerHTML = CHIPS[key].map(function (o, i) {
        var on = state[key] === o.value;
        return '<button type="button" class="chip" aria-pressed="' + on + '" data-chip="' + key + '" data-index="' + i + '">' +
          (o.swatch ? '<span class="swatch" style="background:' + o.swatch + '"></span>' : '') +
          esc(o.label || o.value) + '</button>';
      }).join('');
    });

    document.getElementById('plan-cards').innerHTML = planCardsHtml(v);

    document.getElementById('campaign-tabs').innerHTML = CAMPAIGNS.map(function (c, i) {
      return '<button type="button" class="chip" aria-pressed="' + (state.campaign === i) + '" data-action="campaign" data-index="' + i + '">' + c.tab + '</button>';
    }).join('');
    document.getElementById('campaign-body').innerHTML = campaignHtml(CAMPAIGNS[state.campaign]);
    var next = CAMPAIGNS[upcomingCampaign()];
    document.getElementById('home-campaign').innerHTML =
      '<b>' + next.title + '</b><span>' + countdown(next) + '，' + next.keys[0][1].replace(/<\/?b>/g, '') + '開放預購</span>' +
      '<a href="#campaign" data-action="campaign" data-index="' + CAMPAIGNS.indexOf(next) + '">看節日企劃 →</a>';

    document.getElementById('summary-rows').innerHTML = v.summary.map(function (r) {
      return '<div class="summary-row"><span>' + esc(r[0]) + '</span><span>' + esc(r[1]) + '</span></div>';
    }).join('');

    document.getElementById('timeline').innerHTML = v.timeline.map(function (t) {
      return '<div class="timeline-row"><div style="font-size:14px;font-weight:700">' + esc(t.when) + '</div>' +
        '<div class="stack" style="gap:4px"><div style="font-size:14px;font-weight:700">' + esc(t.what) + '</div>' +
        '<div class="small lede">' + esc(t.note) + '</div></div></div>';
    }).join('');

    document.getElementById('faq-list').innerHTML = FAQS.map(function (f, i) {
      var open = state.faqOpen === i;
      return '<div class="faq"><button type="button" aria-expanded="' + open + '" aria-controls="faq-a-' + i + '" data-action="toggleFaq" data-index="' + i + '">' +
        '<span>' + esc(f[0]) + '</span><span aria-hidden="true">' + (open ? '－' : '＋') + '</span></button>' +
        '<div class="faq-a" id="faq-a-' + i + '"' + (open ? '' : ' hidden') + '>' + esc(f[1]) + '</div></div>';
    }).join('');

    document.getElementById('start-month').value = state.start;
    document.getElementById('gift').checked = state.gift;

    var label = { home: '', products: '全部商品', campaign: '節日企劃', plans: '訂閱方案', checkout: '結帳', thanks: '訂閱完成', contact: '聯絡我們', faq: '常見問題', join: '加入會員', map: '網站架構' }[state.page];
    document.title = (label ? label + '｜' : '') + '不謝花房｜氣球花束訂閱';
  }

  function setState(patch) {
    for (var k in patch) state[k] = patch[k];
    render();
  }

  function go(page) {
    if (location.hash.slice(1) === page) { route(); return; }
    location.hash = page;
  }

  function route() {
    var h = location.hash.slice(1);
    // #line-xxx 是全部商品頁裡的單一商品線，切到該頁後捲到那一段
    var anchor = /^line-/.test(h) && document.getElementById(h);
    if (anchor) h = 'products';
    // 登入改成獨立頁，舊的 #login 連結轉過去
    if (h === 'login') { location.replace('login.html'); return; }
    var page = PAGES.indexOf(h) >= 0 ? h : 'home';
    // 感謝頁只能從結帳進來
    if (page === 'thanks' && !state.orderNo) page = 'home';
    state.page = page;
    render();
    if (anchor) anchor.scrollIntoView();
    else window.scrollTo(0, 0);
  }

  function becomeMember() {
    state.member = true;
    state.cycle = '月繳';
    saveMember();
    go('plans');
  }

  document.addEventListener('click', function (e) {
    var chip = e.target.closest('[data-chip]');
    if (chip) {
      var key = chip.getAttribute('data-chip');
      var patch = {};
      patch[key] = CHIPS[key][+chip.getAttribute('data-index')].value;
      setState(patch);
      return;
    }
    var btn = e.target.closest('[data-action]');
    if (!btn) return;
    switch (btn.getAttribute('data-action')) {
      case 'choosePlan':
        state.plan = btn.getAttribute('data-plan');
        go('checkout');
        break;
      case 'campaign':
        state.campaign = +btn.getAttribute('data-index');
        if (state.page === 'campaign') render();
        else go('campaign');
        break;
      case 'toggleFaq':
        var i = +btn.getAttribute('data-index');
        setState({ faqOpen: state.faqOpen === i ? -1 : i });
        break;
      case 'memberPlans':
        state.cycle = '月繳';
        go('plans');
        break;
      case 'logout':
        state.member = false;
        saveMember();
        render();
        break;
    }
  });

  document.getElementById('start-month').addEventListener('change', function (e) {
    setState({ start: e.target.value });
  });
  document.getElementById('gift').addEventListener('change', function (e) {
    setState({ gift: e.target.checked });
  });

  // 展示版：送出時呼叫 mock-api.js 的假後端，等待期間按鈕顯示「處理中…」
  function submitWith(form, request, done) {
    var btn = form.querySelector('[type="submit"]') || document.querySelector('[form="' + form.id + '"]');
    var label = btn.textContent;
    btn.disabled = true;
    btn.textContent = '處理中…';
    request(Object.fromEntries(new FormData(form))).then(function (res) {
      btn.disabled = false;
      btn.textContent = label;
      done(res);
    });
  }

  document.getElementById('checkout-form').addEventListener('submit', function (e) {
    e.preventDefault();
    submitWith(this, function (data) {
      data.plan = state.plan; data.cycle = state.cycle; data.palette = state.palette; data.delivery = state.delivery;
      return MockAPI.createOrder(data);
    }, function (res) {
      state.orderNo = res.orderNo;
      go('thanks');
    });
  });
  document.getElementById('contact-form').addEventListener('submit', function (e) {
    e.preventDefault();
    submitWith(this, MockAPI.sendContact, function () { setState({ contactSent: true }); });
  });
  document.getElementById('join-form').addEventListener('submit', function (e) {
    e.preventDefault();
    submitWith(this, MockAPI.joinMember, becomeMember);
  });

  // 網站架構頁內容固定，只需產生一次。感謝頁要付款完成才看得到，不做成連結
  function pageLink(id, cls) {
    var name = SITE_MAP.filter(function (m) { return m[0] === id; })[0][1];
    if (id === 'thanks') return '<span class="' + cls + ' is-static" title="付款完成後才會看到">' + name + '</span>';
    return '<a class="' + cls + '" href="' + (id === 'login' ? 'login.html' : '#' + id) + '">' + name + '</a>';
  }
  document.getElementById('map-flows').innerHTML = FLOWS.map(function (f) {
    return '<div class="flow"><span class="flow-label">' + f[0] + '</span>' +
      f[1].map(function (id) { return pageLink(id, 'flow-step'); }).join('<span class="muted" aria-hidden="true">→</span>') + '</div>';
  }).join('');
  document.getElementById('map-pages').innerHTML = SITE_MAP.map(function (m, i) {
    return '<div class="map-row">' +
      '<div class="stack gap-6">' +
        '<div class="eyebrow">' + String(i + 1).padStart(2, '0') + ' · 入口：' + m[3] + '</div>' +
        pageLink(m[0], 'map-name') +
        '<div class="map-goal">' + m[2] + '</div>' +
      '</div>' +
      '<div class="stack gap-6">' +
        m[4].map(function (t, j) { return '<div class="map-block"><span class="muted">' + (j + 1) + '</span><span>' + t + '</span></div>'; }).join('') +
        '<div class="small muted" style="padding-top:4px">下一步 · ' + pageLink(m[5], 'map-next') + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  // ── 列印版（index.html?print）：10 頁依序排成一份文件，每頁從新的一張紙開始 ──
  function buildPrint() {
    // 用預設狀態排版：非會員、月繳、中束，感謝頁放一筆範例訂單
    state.member = false;
    state.orderNo = 'BX-20261001';
    state.page = 'home';
    render();
    // 節日企劃在列印版把三個檔期依序排出，不用切換
    document.getElementById('campaign-tabs').hidden = true;
    document.getElementById('campaign-body').innerHTML = CAMPAIGNS.map(campaignHtml).join('');

    var header = document.querySelector('.site-header');
    var footer = document.querySelector('.site-footer');
    var doc = document.createElement('div');
    doc.className = 'print-doc';
    doc.innerHTML =
      '<div class="print-cover stack gap-8">' +
        '<div class="eyebrow bouquet">不謝花房 · 氣球花束訂閱網站</div>' +
        '<h1>十個頁面</h1>' +
        '<div class="lede">' + SITE_MAP.map(function (m) { return m[1]; }).join('／') + '</div>' +
      '</div>';

    SITE_MAP.forEach(function (m, i) {
      var id = m[0];
      var page = document.createElement('section');
      page.className = 'print-page';
      page.innerHTML = '<div class="print-label">' + String(i + 1).padStart(2, '0') + ' · ' + m[1] + ' · ' + m[2] + '</div>';
      var frame = document.createElement('div');
      frame.className = 'print-frame';

      if (id === 'login') {
        // 登入是獨立頁：用框架嵌入，高度由 login.html 回報
        var iframe = document.createElement('iframe');
        iframe.src = 'login.html?print';
        iframe.title = '登入頁';
        iframe.className = 'print-login';
        window.addEventListener('message', function (e) {
          if (e.source === iframe.contentWindow && e.data && typeof e.data.bxLoginHeight === 'number') {
            iframe.style.height = e.data.bxLoginHeight + 'px';
          }
        });
        frame.appendChild(iframe);
      } else {
        var head = header.cloneNode(true);
        head.querySelectorAll('[data-nav]').forEach(function (a) {
          if (a.getAttribute('data-nav') === id) a.setAttribute('aria-current', 'page');
          else a.removeAttribute('aria-current');
        });
        var main = document.createElement('div');
        main.className = 'wrap';
        var section = document.querySelector('[data-page="' + id + '"]');
        section.hidden = false;
        main.appendChild(section);
        frame.appendChild(head);
        frame.appendChild(main);
        frame.appendChild(footer.cloneNode(true));
      }
      page.appendChild(frame);
      doc.appendChild(page);
    });

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn print-btn';
    btn.textContent = '列印／存成 PDF';
    btn.addEventListener('click', function () { window.print(); });

    document.body.classList.add('print-mode');
    document.querySelector('.site').hidden = true;
    document.body.appendChild(doc);
    document.body.appendChild(btn);
    document.title = '十個頁面｜不謝花房｜氣球花束訂閱';
  }

  if (/[?&]print\b/.test(location.search)) {
    buildPrint();
  } else {
    window.addEventListener('hashchange', route);
    route();
  }
})();
