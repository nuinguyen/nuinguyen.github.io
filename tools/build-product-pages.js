// Generates alarm.html, reminders.html, youtube.html and calendar.html from the data below.
// Run from the repo root:  node tools/build-product-pages.js
// Then rebuild the CSS:     npx tailwindcss@3.4.16 -i home.src.css -o home.css --minify
const fs = require('fs');
const path = require('path');

const SITE = 'https://nuinguyen.github.io/';
const EMAIL = 'nuinguyen01bv@gmail.com';

// Tailwind classes are written out in full so the Tailwind scanner can find them.
const ACCENTS = {
  red: {
    text: 'text-red-500', soft: 'bg-red-500/10 text-red-500', btn: 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/25', sel: 'ring-red-500',
    grad: 'from-red-500 to-orange-500', ring: 'ring-red-500/30', border: 'border-red-500/40', glow: 'from-red-500/10'
  },
  blue: {
    text: 'text-blue-600 dark:text-blue-400', soft: 'bg-blue-500/10 text-blue-600 dark:text-blue-400', btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25', sel: 'ring-blue-600',
    grad: 'from-blue-600 to-indigo-500', ring: 'ring-blue-500/30', border: 'border-blue-500/40', glow: 'from-blue-500/10'
  },
  rose: {
    text: 'text-rose-500', soft: 'bg-rose-500/10 text-rose-500', btn: 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/25', sel: 'ring-rose-500',
    grad: 'from-rose-500 to-orange-500', ring: 'ring-rose-500/30', border: 'border-rose-500/40', glow: 'from-rose-500/10'
  },
  pink: {
    text: 'text-pink-500', soft: 'bg-pink-500/10 text-pink-500', btn: 'bg-pink-500 hover:bg-pink-600 text-white shadow-pink-500/25', sel: 'ring-pink-500',
    grad: 'from-pink-500 to-rose-500', ring: 'ring-pink-500/30', border: 'border-pink-500/40', glow: 'from-pink-500/10'
  }
};

const COMMON = {
  tagline: { en: 'Chrome Extensions', vi: 'Tiện ích Chrome' },
  navFeatures: { en: 'Features', vi: 'Tính năng' },
  navScreens: { en: 'Screenshots', vi: 'Hình ảnh' },
  navPricing: { en: 'Pricing', vi: 'Bảng giá' },
  navFaq: { en: 'FAQ', vi: 'Hỏi đáp' },
  navAll: { en: 'All extensions', vi: 'Tất cả tiện ích' },
  home: { en: 'Home', vi: 'Trang chủ' },
  addChrome: { en: 'Add to Chrome', vi: 'Thêm vào Chrome' },
  seePricing: { en: 'See pricing', vi: 'Xem bảng giá' },
  featuresTitle: { en: 'Everything you need', vi: 'Mọi thứ bạn cần' },
  howTitle: { en: 'How it works', vi: 'Cách hoạt động' },
  screensTitle: { en: 'Screenshots', vi: 'Hình ảnh thực tế' },
  screensSub: { en: 'Click any image to view it full size.', vi: 'Bấm vào ảnh để xem kích thước đầy đủ.' },
  pricingTitle: { en: 'Simple pricing', vi: 'Bảng giá đơn giản' },
  pricingSubLifetime: { en: 'Start free. Pay once for Premium — choose how many browsers you need.', vi: 'Bắt đầu miễn phí. Trả một lần cho Premium — chọn số trình duyệt bạn cần.' },
  pricingSubSubscription: { en: 'Start free. Upgrade monthly or yearly — cancel anytime.', vi: 'Bắt đầu miễn phí. Nâng cấp theo tháng hoặc năm — hủy bất cứ lúc nào.' },
  free: { en: 'Free', vi: 'Miễn phí' },
  premium: { en: 'Premium', vi: 'Premium' },
  from: { en: 'from', vi: 'từ' },
  once: { en: 'once', vi: 'một lần' },
  oneTime: { en: 'One-time payment · Lifetime updates · No recurring fees', vi: 'Thanh toán một lần · Cập nhật trọn đời · Không phí định kỳ' },
  perMonth: { en: '/ month', vi: '/ tháng' },
  perYear: { en: '/ year', vi: '/ năm' },
  monthly: { en: 'Monthly', vi: 'Theo tháng' },
  yearly: { en: 'Yearly', vi: 'Theo năm' },
  cancelAnytime: { en: 'Cancel anytime. The license key arrives by email.', vi: 'Hủy bất cứ lúc nào. Mã bản quyền được gửi qua email.' },
  subscribeMonthly: { en: 'Subscribe monthly', vi: 'Đăng ký theo tháng' },
  subscribeYearly: { en: 'Subscribe yearly', vi: 'Đăng ký theo năm' },
  tiersTitle: { en: 'Choose your license pack', vi: 'Chọn gói bản quyền' },
  tiersSub: { en: 'One license activates Premium on one browser.', vi: 'Mỗi bản quyền kích hoạt Premium trên một trình duyệt.' },
  license: { en: 'license', vi: 'bản quyền' },
  licenses: { en: 'licenses', vi: 'bản quyền' },
  perLicense: { en: 'per license', vi: 'mỗi bản quyền' },
  bestValue: { en: 'Best value', vi: 'Đáng giá nhất' },
  buy: { en: 'Buy', vi: 'Mua' },
  popular: { en: 'Popular', vi: 'Phổ biến' },
  getStarted: { en: 'Get started', vi: 'Bắt đầu ngay' },
  upgrade: { en: 'Upgrade to Premium', vi: 'Nâng cấp Premium' },
  faqTitle: { en: 'Frequently asked questions', vi: 'Câu hỏi thường gặp' },
  moreTitle: { en: 'More from NAN Smart', vi: 'Các tiện ích khác của NAN Smart' },
  learnMore: { en: 'Learn more', vi: 'Tìm hiểu thêm' },
  helpTag: { en: 'Support', vi: 'Hỗ trợ' },
  helpTitle: { en: 'Questions or feedback?', vi: 'Bạn có câu hỏi hoặc góp ý?' },
  helpDesc: { en: 'Found a bug or have an idea for a new feature? Send us an email — we read every message.', vi: 'Gặp lỗi hoặc có ý tưởng tính năng mới? Hãy gửi email cho chúng tôi — mọi thư đều được đọc.' },
  contact: { en: 'Contact us', vi: 'Liên hệ' },
  privacy: { en: 'Privacy', vi: 'Bảo mật' },
  terms: { en: 'Terms', vi: 'Điều khoản' },
  footerContact: { en: 'Contact', vi: 'Liên hệ' }
};

// Prices mirror the plans shown inside each extension (features.js / popup.js / lib/store.js there).
const LS = 'https://anuis.lemonsqueezy.com/checkout/buy/';
const lifetimeTiers = ids => [[1, 12], [2, 19], [3, 25], [5, 35]].map(([n, price], i) => ({ n, price, url: LS + ids[i], best: n === 3 }));

const PRODUCTS = [
  {
    id: 'alarm',
    file: 'alarm.html',
    name: 'Alarm Clock & Reminders',
    accent: 'red',
    icon: 'images/icon-alarm.png',
    store: 'https://chromewebstore.google.com/detail/alarm-clock-reminder-chro/apbmibchnilnanhnaphgoojbjinkkabi',
    pricing: {
      type: 'lifetime',
      tiers: lifetimeTiers(['832ff7fd-00d7-45c9-a46d-68d097b9fe9b', '2bd2ad7d-d9b0-46ba-9143-d4204c851243', '21c926e6-c78e-4035-91d9-a99c84f0cb82', '73b20b8a-c0b1-4876-abb4-30f9c3ac1760'])
    },
    seoTitle: 'Alarm Clock & Reminders for Chrome — Repeating Alarms, Snooze & Themes',
    seoDesc: 'A lightweight alarm clock for Chrome: repeating alarms, fullscreen ringing with snooze, custom sounds, voice messages, 24h/12h and light & dark themes.',
    short: { en: 'Repeating alarms, fullscreen ringing and snooze — right in your toolbar.', vi: 'Báo thức lặp lại, chuông toàn màn hình và báo lại — ngay trên thanh công cụ.' },
    badge: { en: 'Chrome alarm clock & reminders', vi: 'Đồng hồ báo thức & nhắc nhở cho Chrome' },
    title1: { en: 'Never miss', vi: 'Không bỏ lỡ' },
    title2: { en: 'what matters.', vi: 'điều quan trọng.' },
    desc: {
      en: 'A lightweight alarm clock and reminder extension for Chrome. Set alarms in seconds, choose the sounds you like, snooze with one click and keep everything stored locally.',
      vi: 'Tiện ích đồng hồ báo thức và nhắc nhở nhẹ cho Chrome. Đặt báo thức trong vài giây, chọn âm thanh yêu thích, báo lại chỉ một chạm và mọi dữ liệu được lưu cục bộ.'
    },
    images: [
      ['images/alarm-hero.webp', 'Alarm Clock & Reminders popup with alarms and the fullscreen ringing screen', 'Popup báo thức và màn hình chuông toàn màn hình'],
      ['images/alarm-themes.webp', 'Alarm Clock in light and dark mode', 'Đồng hồ báo thức ở giao diện sáng và tối'],
      ['images/alarm-colors.webp', 'Custom accent colors and 24h / 12h time format', 'Màu nhấn tùy chỉnh và định dạng giờ 24h / 12h'],
      ['images/alarm-setup.webp', 'Alarm setup: icons, sounds, snooze, repeat and voice message', 'Cài đặt báo thức: biểu tượng, âm thanh, báo lại, lặp lại và tin nhắn giọng nói']
    ],
    features: [
      ['fa-bell', { en: 'Reliable background alarms', vi: 'Báo thức chạy nền ổn định' }, { en: 'Uses Chrome’s alarms API and an offscreen page, so alarms ring on time even when Chrome is minimized or you are in another tab.', vi: 'Dùng Chrome alarms API và trang offscreen nên báo thức vẫn reo đúng giờ khi Chrome thu nhỏ hoặc bạn đang ở tab khác.' }],
      ['fa-expand', { en: 'Fullscreen ringing view', vi: 'Màn hình chuông toàn màn hình' }, { en: 'A large ringing view with big Snooze and Stop buttons — optionally in its own window.', vi: 'Màn hình chuông lớn với nút Báo lại và Tắt to rõ — có thể mở trong cửa sổ riêng.' }],
      ['fa-rotate', { en: 'Repeat & snooze', vi: 'Lặp lại & báo lại' }, { en: 'Repeat by weekday and choose a snooze of 5, 10, 15 or 30 minutes.', vi: 'Lặp lại theo thứ trong tuần và chọn báo lại sau 5, 10, 15 hoặc 30 phút.' }],
      ['fa-music', { en: 'Sounds & icons', vi: 'Âm thanh & biểu tượng' }, { en: 'Built-in sounds, labels and emoji icons for every alarm. Premium adds custom MP3 and animated icons.', vi: 'Âm thanh có sẵn, nhãn và biểu tượng emoji cho từng báo thức. Premium thêm MP3 riêng và biểu tượng động.' }],
      ['fa-microphone', { en: 'Spoken alarms', vi: 'Báo thức đọc thành tiếng' }, { en: 'Your message is read out loud when the alarm rings, in 20+ languages (Premium).', vi: 'Nội dung của bạn được đọc to khi báo thức reo, hơn 20 ngôn ngữ (Premium).' }],
      ['fa-palette', { en: 'Themes & time format', vi: 'Giao diện & định dạng giờ' }, { en: 'Light and dark mode, accent colors and a 24h or 12h AM/PM clock.', vi: 'Giao diện sáng và tối, màu nhấn và đồng hồ 24h hoặc 12h AM/PM.' }]
    ],
    steps: [
      [{ en: 'Click and add', vi: 'Bấm và thêm' }, { en: 'Click the extension icon, tap +, scroll the hours and minutes, add a label and pick an icon.', vi: 'Bấm biểu tượng tiện ích, chọn +, cuộn giờ và phút, đặt nhãn và chọn biểu tượng.' }],
      [{ en: 'Pick sound, snooze & repeat', vi: 'Chọn âm thanh, báo lại & lặp lại' }, { en: 'Choose a sound, how long snooze lasts and which weekdays the alarm repeats.', vi: 'Chọn âm thanh, thời gian báo lại và những ngày trong tuần cần lặp lại.' }],
      [{ en: 'Let Chrome do the rest', vi: 'Để Chrome lo phần còn lại' }, { en: 'When it’s time, a large ringing view shows Snooze and Stop — even if Chrome was in the background.', vi: 'Đến giờ, màn hình chuông lớn hiện nút Báo lại và Tắt — kể cả khi Chrome đang chạy nền.' }]
    ],
    freeList: [
      { en: 'Up to 3 alarms', vi: 'Tối đa 3 báo thức' },
      { en: 'Built-in sounds, snooze, repeat by weekday', vi: 'Âm thanh có sẵn, báo lại, lặp theo thứ' },
      { en: 'Dark / light theme + 3 accent colors', vi: 'Giao diện sáng / tối + 3 màu nhấn' },
      { en: 'Standard emoji icons', vi: 'Biểu tượng emoji tiêu chuẩn' }
    ],
    premiumList: [
      { en: 'Unlimited alarms', vi: 'Không giới hạn báo thức' },
      { en: 'Spoken alarms in 20+ languages', vi: 'Báo thức đọc thành tiếng, hơn 20 ngôn ngữ' },
      { en: 'Your own MP3s for alarms and timers', vi: 'MP3 riêng cho báo thức và hẹn giờ' },
      { en: '16 animated icons', vi: '16 biểu tượng động' },
      { en: 'Any accent color', vi: 'Màu nhấn bất kỳ' }
    ],
    faq: [
      [{ en: 'Will the alarm ring if Chrome is minimized?', vi: 'Báo thức có reo khi Chrome đang thu nhỏ không?' }, { en: 'Yes. Alarms use Chrome’s alarms API and an offscreen page, so they ring while Chrome is running in the background or minimized.', vi: 'Có. Báo thức dùng Chrome alarms API và trang offscreen nên vẫn reo khi Chrome chạy nền hoặc đang thu nhỏ.' }],
      [{ en: 'How many alarms can I create for free?', vi: 'Bản miễn phí tạo được bao nhiêu báo thức?' }, { en: 'Up to 3 alarms. Premium removes the limit.', vi: 'Tối đa 3 báo thức. Premium bỏ giới hạn này.' }],
      [{ en: 'How much is Premium?', vi: 'Premium giá bao nhiêu?' }, { en: 'A one-time payment from $12 for one browser — no subscription. Packs of 2, 3 and 5 licenses cost $19, $25 and $35.', vi: 'Thanh toán một lần từ $12 cho một trình duyệt — không thuê bao. Gói 2, 3 và 5 bản quyền có giá $19, $25 và $35.' }],
      [{ en: 'Where are my alarms stored?', vi: 'Báo thức của tôi được lưu ở đâu?' }, { en: 'Locally in your browser. There is no account and no tracking.', vi: 'Lưu cục bộ trong trình duyệt của bạn. Không cần tài khoản và không theo dõi.' }]
    ]
  },
  {
    id: 'reminders',
    file: 'reminders.html',
    name: 'Reminders & To-Do List',
    accent: 'blue',
    icon: 'images/icon-reminders.png',
    store: 'https://chromewebstore.google.com/detail/reminders-chrome-extensio/ebjdfgcknblkogfgcpfplfgeanpbpdid',
    pricing: {
      type: 'lifetime',
      tiers: lifetimeTiers(['fcebd98b-ff41-431b-a1ec-48aa2521f540', '8ee43132-3289-4829-b673-f88fe7564002', 'aeb868f7-312c-4fa8-9450-7b0d89137d7d', 'ccc86c0d-6134-467e-b1da-48bc650d9aea'])
    },
    seoTitle: 'Reminders & To-Do List for Chrome — iOS-Style Task Manager',
    seoDesc: 'An elegant, iOS-inspired task manager for Chrome: smart lists, custom lists, dates and repeats, fullscreen alerts and a calendar view. Free and Premium.',
    short: { en: 'An iOS-style task manager with smart lists and on-time alerts.', vi: 'Quản lý công việc phong cách iOS với danh sách thông minh và nhắc đúng giờ.' },
    badge: { en: 'iOS-style task manager for Chrome', vi: 'Quản lý công việc phong cách iOS cho Chrome' },
    title1: { en: 'Simple. Beautiful.', vi: 'Đơn giản. Đẹp.' },
    title2: { en: 'On time.', vi: 'Đúng giờ.' },
    desc: {
      en: 'Stay on track with an elegant, iOS-inspired task manager that fits right into your browsing workflow. Capture tasks in seconds and get reminded exactly when it matters.',
      vi: 'Luôn đúng tiến độ với trình quản lý công việc phong cách iOS, hòa vào thói quen duyệt web của bạn. Ghi công việc trong vài giây và được nhắc đúng lúc.'
    },
    images: [
      ['images/reminders-hero.webp', 'Reminders popup with Today, Scheduled, All and Flagged smart lists', 'Popup Reminders với các danh sách Hôm nay, Đã lên lịch, Tất cả và Gắn cờ'],
      ['images/reminders-themes.webp', 'Reminders in light and dark mode', 'Reminders ở giao diện sáng và tối'],
      ['images/reminders-3.webp', 'New reminder form with list, date, time, priority and flag', 'Màn hình tạo nhắc nhở với danh sách, ngày, giờ, ưu tiên và cờ'],
      ['images/reminders-alert.webp', 'Fullscreen reminder alert with Complete and Dismiss', 'Thông báo nhắc nhở toàn màn hình với nút Hoàn thành và Bỏ qua'],
      ['images/reminders-calendar.webp', 'Calendar view of scheduled reminders', 'Chế độ xem lịch các nhắc nhở đã lên lịch']
    ],
    features: [
      ['fa-layer-group', { en: 'Smart lists', vi: 'Danh sách thông minh' }, { en: 'Today, Scheduled, All and Flagged views show what needs your attention at a glance.', vi: 'Các mục Hôm nay, Đã lên lịch, Tất cả và Gắn cờ cho bạn thấy ngay việc cần làm.' }],
      ['fa-folder-open', { en: 'Custom lists', vi: 'Danh sách riêng' }, { en: 'Separate work, health and personal goals with lists that have their own colors and icons.', vi: 'Tách công việc, sức khỏe và mục tiêu cá nhân bằng danh sách có màu và biểu tượng riêng.' }],
      ['fa-calendar-days', { en: 'Advanced scheduling', vi: 'Lên lịch nâng cao' }, { en: 'Set precise dates and times, repeat rules and early reminders. See everything in the calendar view.', vi: 'Đặt ngày giờ chính xác, quy tắc lặp và nhắc sớm. Xem tất cả trên chế độ lịch.' }],
      ['fa-bell', { en: 'Rich notifications', vi: 'Thông báo nổi bật' }, { en: 'Background alerts plus a fullscreen reminder you can complete or dismiss in one tap.', vi: 'Thông báo chạy nền cùng màn hình nhắc toàn màn hình, hoàn thành hoặc bỏ qua chỉ một chạm.' }],
      ['fa-flag', { en: 'Priorities & flags', vi: 'Ưu tiên & gắn cờ' }, { en: 'Mark important tasks with priorities (!, !!, !!!) and flags so nothing slips.', vi: 'Đánh dấu việc quan trọng bằng mức ưu tiên (!, !!, !!!) và cờ để không bỏ sót.' }],
      ['fa-user-lock', { en: 'Private & fast', vi: 'Riêng tư & nhanh' }, { en: 'All data is stored locally in your browser — no account, no tracking. Light and dark mode included.', vi: 'Mọi dữ liệu lưu cục bộ trong trình duyệt — không tài khoản, không theo dõi. Có giao diện sáng và tối.' }]
    ],
    steps: [
      [{ en: 'Open from the toolbar', vi: 'Mở từ thanh công cụ' }, { en: 'Click the Reminders icon to see Today, Scheduled, All and Flagged at a glance.', vi: 'Bấm biểu tượng Reminders để xem ngay Hôm nay, Đã lên lịch, Tất cả và Gắn cờ.' }],
      [{ en: 'Add a reminder', vi: 'Thêm nhắc nhở' }, { en: 'Tap +, enter a title and notes, pick a list, date, time, priority and flag.', vi: 'Bấm +, nhập tiêu đề và ghi chú, chọn danh sách, ngày, giờ, mức ưu tiên và cờ.' }],
      [{ en: 'Get reminded on time', vi: 'Được nhắc đúng giờ' }, { en: 'When it’s due, a fullscreen alert appears — complete or dismiss it in one tap.', vi: 'Đến hạn, thông báo toàn màn hình hiện lên — hoàn thành hoặc bỏ qua chỉ một chạm.' }]
    ],
    freeList: [
      { en: 'Up to 3 reminders', vi: 'Tối đa 3 nhắc nhở' },
      { en: 'Up to 3 lists', vi: 'Tối đa 3 danh sách' },
      { en: 'Up to 5 quick notes', vi: 'Tối đa 5 ghi chú nhanh' },
      { en: '3 accent colors', vi: '3 màu nhấn' }
    ],
    premiumList: [
      { en: 'Unlimited reminders', vi: 'Không giới hạn nhắc nhở' },
      { en: 'Unlimited lists', vi: 'Không giới hạn danh sách' },
      { en: 'Unlimited notes — pin and color them', vi: 'Không giới hạn ghi chú — ghim và tô màu' },
      { en: 'Your own MP3 reminder sounds', vi: 'Âm thanh nhắc nhở MP3 riêng' },
      { en: 'Any accent color', vi: 'Màu nhấn bất kỳ' }
    ],
    faq: [
      [{ en: 'What do I get for free?', vi: 'Bản miễn phí có những gì?' }, { en: 'Up to 3 reminders, 3 lists and 5 quick notes. Premium removes every limit.', vi: 'Tối đa 3 nhắc nhở, 3 danh sách và 5 ghi chú nhanh. Premium bỏ mọi giới hạn.' }],
      [{ en: 'Do I need an account?', vi: 'Tôi có cần tài khoản không?' }, { en: 'No. Your reminders are stored locally in your browser.', vi: 'Không. Nhắc nhở được lưu cục bộ trong trình duyệt của bạn.' }],
      [{ en: 'Can I use my own notification sound?', vi: 'Tôi có thể dùng âm thanh thông báo riêng không?' }, { en: 'Yes, with Premium you can upload MP3 files as reminder sounds.', vi: 'Có, với Premium bạn có thể tải lên file MP3 làm âm thanh nhắc nhở.' }],
      [{ en: 'How much is Premium?', vi: 'Premium giá bao nhiêu?' }, { en: 'A one-time payment from $12 for one browser — no subscription. Packs of 2, 3 and 5 licenses cost $19, $25 and $35.', vi: 'Thanh toán một lần từ $12 cho một trình duyệt — không thuê bao. Gói 2, 3 và 5 bản quyền có giá $19, $25 và $35.' }]
    ]
  },
  {
    id: 'youtube',
    file: 'youtube.html',
    name: 'Playlist Manager for YouTube',
    accent: 'rose',
    icon: 'images/icon-youtube.png',
    store: 'https://chromewebstore.google.com/detail/playlist-manager-for-yout/lfhblickhegnbcelnahnjbgcgkjaigge',
    pricing: {
      type: 'subscription',
      month: { price: '$2.99', url: LS + 'e83f0a9f-219a-4f24-8fb5-4463b5c4a420' },
      year: { price: '$19.99', perMonth: '$1.67', save: 44, url: LS + '388202ef-0528-41a1-bfd1-ba7ee3ffdd11' }
    },
    seoTitle: 'Playlist Manager for YouTube — Save Videos, Playlists & Channel Groups',
    seoDesc: 'Save any YouTube video in one click, organize playlists into folders, play in order or shuffle, set a sleep timer and sort subscriptions into channel groups.',
    short: { en: 'Save videos in one click, play playlists in order and group your channels.', vi: 'Lưu video một chạm, phát playlist theo thứ tự và nhóm kênh đăng ký.' },
    badge: { en: 'Playlist manager for YouTube', vi: 'Trình quản lý playlist cho YouTube' },
    title1: { en: 'Your YouTube,', vi: 'YouTube của bạn,' },
    title2: { en: 'organized.', vi: 'gọn gàng.' },
    desc: {
      en: 'Save any video in one click, organize playlists into folders, play them in order with YouTube’s own player and sort your subscriptions into channel groups.',
      vi: 'Lưu mọi video chỉ một cú nhấp, sắp playlist vào thư mục, phát theo thứ tự bằng chính trình phát của YouTube và gom kênh đăng ký thành nhóm.'
    },
    images: [
      ['images/youtube-save.webp', 'Save any YouTube video to a playlist in one click', 'Lưu video YouTube vào playlist chỉ một cú nhấp'],
      ['images/youtube-playlists.webp', 'Playlist library with folders, icons and search', 'Thư viện playlist với thư mục, biểu tượng và tìm kiếm'],
      ['images/youtube-playback.webp', 'Play a playlist in order, shuffle or repeat', 'Phát playlist theo thứ tự, ngẫu nhiên hoặc lặp lại'],
      ['images/youtube-channels.webp', 'Sort subscriptions into channel groups', 'Sắp xếp kênh đăng ký thành nhóm'],
      ['images/youtube-tools.webp', 'Group channels right on YouTube', 'Nhóm kênh ngay trên YouTube']
    ],
    features: [
      ['fa-plus', { en: 'One-click save', vi: 'Lưu một chạm' }, { en: 'Add any video to a playlist from search results or the player, without leaving YouTube.', vi: 'Thêm mọi video vào playlist từ kết quả tìm kiếm hoặc trình phát, không cần rời YouTube.' }],
      ['fa-folder', { en: 'Unlimited playlists', vi: 'Playlist không giới hạn' }, { en: 'Unlimited playlists and videos for free, organized into folders with icons, colors, search and drag-and-drop.', vi: 'Playlist và video không giới hạn ngay cả bản miễn phí, sắp vào thư mục với biểu tượng, màu, tìm kiếm và kéo thả.' }],
      ['fa-play', { en: 'Play in order', vi: 'Phát theo thứ tự' }, { en: 'Play, shuffle or repeat using YouTube’s own player, with a mini player, Up next and queue.', vi: 'Phát, trộn hoặc lặp bằng chính trình phát YouTube, kèm trình phát mini, Tiếp theo và hàng chờ.' }],
      ['fa-users', { en: 'Channel groups', vi: 'Nhóm kênh' }, { en: 'Sync your subscriptions and sort channels into groups like Music, Learning or Tech.', vi: 'Đồng bộ kênh đăng ký và gom thành nhóm như Âm nhạc, Học tập hay Công nghệ.' }],
      ['fa-filter', { en: 'Focused feed', vi: 'Bảng tin tập trung' }, { en: 'See new videos per group and hide watched videos or Shorts.', vi: 'Xem video mới theo nhóm, ẩn video đã xem hoặc Shorts.' }],
      ['fa-moon', { en: 'Sleep timer', vi: 'Hẹn giờ tắt' }, { en: 'Pause playback automatically after a set time — perfect for music or podcasts at night.', vi: 'Tự dừng phát sau thời gian đặt trước — rất hợp nghe nhạc hay podcast buổi tối.' }]
    ],
    steps: [
      [{ en: 'Save while you browse', vi: 'Lưu khi đang xem' }, { en: 'Click + on any video and pick a playlist — or create a new one on the spot.', vi: 'Bấm + trên video bất kỳ và chọn playlist — hoặc tạo playlist mới ngay tại chỗ.' }],
      [{ en: 'Organize your library', vi: 'Sắp xếp thư viện' }, { en: 'Group playlists into folders and sort subscriptions into channel groups.', vi: 'Gom playlist vào thư mục và sắp xếp kênh đăng ký thành nhóm.' }],
      [{ en: 'Press Play All', vi: 'Bấm Phát tất cả' }, { en: 'Play in order, shuffle or repeat, and set a sleep timer if you need one.', vi: 'Phát theo thứ tự, ngẫu nhiên hoặc lặp lại, và đặt hẹn giờ tắt nếu cần.' }]
    ],
    freeList: [
      { en: 'Unlimited playlists & videos', vi: 'Không giới hạn playlist & video' },
      { en: 'Play in order, shuffle, repeat & sleep timer', vi: 'Phát theo thứ tự, trộn, lặp & hẹn giờ tắt' },
      { en: 'Up to 5 channel groups', vi: 'Tối đa 5 nhóm kênh' },
      { en: 'One-click save on YouTube', vi: 'Lưu một chạm trên YouTube' }
    ],
    premiumList: [
      { en: 'Unlimited channel groups', vi: 'Không giới hạn nhóm kênh' },
      { en: 'Folders inside folders', vi: 'Thư mục lồng trong thư mục' },
      { en: 'Automatic daily backups', vi: 'Tự động sao lưu hằng ngày' },
      { en: 'One-click sorting by name, date and length', vi: 'Sắp xếp một chạm theo tên, ngày và độ dài' }
    ],
    faq: [
      [{ en: 'How do I save a video to my playlist?', vi: 'Làm sao để lưu video vào playlist?' }, { en: 'After installing, click the + button next to any video on YouTube and choose a playlist.', vi: 'Sau khi cài đặt, bấm nút + cạnh video bất kỳ trên YouTube và chọn playlist.' }],
      [{ en: 'Does the sleep timer work for music?', vi: 'Hẹn giờ tắt có dùng được khi nghe nhạc không?' }, { en: 'Yes. The sleep timer pauses any playing YouTube video or music track when the time runs out.', vi: 'Có. Hẹn giờ tắt sẽ dừng mọi video hoặc bài nhạc YouTube đang phát khi hết giờ.' }],
      [{ en: 'Can I customize my playlist icons?', vi: 'Tôi có thể đổi biểu tượng playlist không?' }, { en: 'Yes. Choose from a range of colors and icons to make each playlist easy to find.', vi: 'Có. Chọn từ nhiều màu và biểu tượng để mỗi playlist dễ tìm hơn.' }],
      [{ en: 'What are the free limits?', vi: 'Bản miễn phí có giới hạn gì?' }, { en: 'Playlists and videos are unlimited. The free plan allows up to 5 channel groups; Premium ($2.99/month or $19.99/year) removes the limit and adds subfolders, daily backups and sorting.', vi: 'Playlist và video không giới hạn. Bản miễn phí cho tối đa 5 nhóm kênh; Premium ($2.99/tháng hoặc $19.99/năm) bỏ giới hạn và thêm thư mục con, sao lưu hằng ngày và sắp xếp.' }]
    ]
  },
  {
    id: 'calendar',
    file: 'calendar.html',
    name: 'Multi Calendar — Lunar & Hijri',
    accent: 'pink',
    icon: 'images/icon-calendar.png',
    store: 'https://chromewebstore.google.com/detail/multi-calendar-%E2%80%94-lunar-hi/jelgahjncijhnkohohfdfhnadeohcdgk',
    pricing: {
      type: 'lifetime',
      tiers: lifetimeTiers(['99915296-4708-4840-8d67-b7ae2dcd28af', '15996a20-6aec-47c6-92b1-9985bd83c3c4', '552141ae-40d0-4c7c-81f0-11ab78e60d2b', '85950d9c-e65c-431c-9e03-972f7ff2ec27'])
    },
    seoTitle: 'Multi Calendar for Chrome — Lunar, Hijri & Jalali Calendar',
    seoDesc: 'Gregorian, Lunar (Vietnamese, Chinese, Korean, Japanese), Hijri and Jalali calendars side by side in Chrome, with events, reminders and an anniversary counter.',
    short: { en: 'Gregorian, Lunar, Hijri and Jalali calendars side by side.', vi: 'Dương lịch, Âm lịch, Hijri và Jalali song song.' },
    badge: { en: 'Lunar, Hijri & Jalali calendar for Chrome', vi: 'Lịch Âm, Hijri & Jalali cho Chrome' },
    title1: { en: 'View every calendar,', vi: 'Xem mọi loại lịch,' },
    title2: { en: 'side by side.', vi: 'cùng một lúc.' },
    desc: {
      en: 'See the solar and lunar date at a glance, track birthdays and holidays with smart reminders, and count every day together with the anniversary counter.',
      vi: 'Xem ngày dương và âm lịch trong nháy mắt, theo dõi sinh nhật, ngày lễ với nhắc nhở thông minh và đếm từng ngày bên nhau với bộ đếm ngày yêu.'
    },
    images: [
      ['images/calendar-hero.webp', 'Multi Calendar home with Gregorian, Lunar, Hijri and Jalali dates', 'Trang chính Multi Calendar với ngày Dương, Âm, Hijri và Jalali'],
      ['images/calendar-month.webp', 'Month view with lunar dates under each day', 'Lịch tháng có ngày âm dưới mỗi ngày'],
      ['images/calendar-events.webp', 'Events list with yearly and one-time events', 'Danh sách sự kiện hằng năm và một lần'],
      ['images/calendar-love.webp', 'Anniversary counter with days together', 'Bộ đếm ngày yêu với số ngày bên nhau'],
      ['images/calendar-settings.webp', 'Settings: language, secondary calendar, theme and accent color', 'Cài đặt: ngôn ngữ, lịch phụ, giao diện và màu nhấn']
    ],
    features: [
      ['fa-moon', { en: 'Four calendar systems', vi: 'Bốn hệ lịch' }, { en: 'Gregorian, Lunar (Vietnamese, Chinese, Korean, Japanese), Hijri and Jalali in one view.', vi: 'Dương lịch, Âm lịch (Việt Nam, Trung Quốc, Hàn Quốc, Nhật Bản), Hijri và Jalali trong một màn hình.' }],
      ['fa-sun', { en: 'Daily details', vi: 'Thông tin trong ngày' }, { en: 'Day pillar, solar term and auspicious day info right on the home screen.', vi: 'Can chi, tiết khí và ngày hoàng đạo ngay trên màn hình chính.' }],
      ['fa-calendar-days', { en: 'Month view', vi: 'Lịch tháng' }, { en: 'A clean month grid with the lunar date under every day and a Today button.', vi: 'Lưới lịch tháng gọn gàng, có ngày âm dưới mỗi ngày và nút Hôm nay.' }],
      ['fa-bell', { en: 'Events & reminders', vi: 'Sự kiện & nhắc nhở' }, { en: 'Birthdays, holidays and anniversaries — yearly or one-time — with smart notifications.', vi: 'Sinh nhật, ngày lễ, kỷ niệm — hằng năm hoặc một lần — kèm thông báo thông minh.' }],
      ['fa-heart', { en: 'Anniversary counter', vi: 'Đếm ngày yêu' }, { en: 'Count the days together with milestone badges, photos and names.', vi: 'Đếm số ngày bên nhau với huy hiệu cột mốc, ảnh và tên.' }],
      ['fa-globe', { en: '10+ languages & themes', vi: 'Hơn 10 ngôn ngữ & giao diện' }, { en: 'Use it in your language, in light or dark mode, with accent colors.', vi: 'Dùng bằng ngôn ngữ của bạn, giao diện sáng hoặc tối, kèm màu nhấn.' }]
    ],
    steps: [
      [{ en: 'Open from the toolbar', vi: 'Mở từ thanh công cụ' }, { en: 'See today’s date in every calendar, plus day pillar and solar term.', vi: 'Xem ngày hôm nay trên mọi hệ lịch, kèm can chi và tiết khí.' }],
      [{ en: 'Add your dates', vi: 'Thêm ngày quan trọng' }, { en: 'Add birthdays, holidays and anniversaries as yearly or one-time events.', vi: 'Thêm sinh nhật, ngày lễ, kỷ niệm dưới dạng sự kiện hằng năm hoặc một lần.' }],
      [{ en: 'Make it yours', vi: 'Tùy chỉnh theo ý bạn' }, { en: 'Pick your language, secondary calendar and theme in Settings.', vi: 'Chọn ngôn ngữ, lịch phụ và giao diện trong Cài đặt.' }]
    ],
    freeList: [
      { en: 'Gregorian, Lunar, Hijri & Jalali calendars', vi: 'Lịch Dương, Âm, Hijri & Jalali' },
      { en: 'Up to 3 events', vi: 'Tối đa 3 sự kiện' },
      { en: 'Anniversary counter', vi: 'Đếm ngày yêu' },
      { en: '10+ languages, light & dark mode', vi: 'Hơn 10 ngôn ngữ, giao diện sáng & tối' }
    ],
    premiumList: [
      { en: 'Unlimited events', vi: 'Không giới hạn sự kiện' },
      { en: 'Lunar-date events & advance reminders', vi: 'Sự kiện theo ngày âm & nhắc trước' },
      { en: 'Automatic local holidays & countdown on icon', vi: 'Tự động thêm ngày lễ & đếm ngược trên biểu tượng' },
      { en: 'Custom anniversary milestones, background & notifications', vi: 'Cột mốc ngày yêu, ảnh nền & thông báo tùy chỉnh' },
      { en: 'Export to .ics and custom colors', vi: 'Xuất file .ics và màu tùy chỉnh' }
    ],
    faq: [
      [{ en: 'Which lunar calendars are supported?', vi: 'Hỗ trợ những loại âm lịch nào?' }, { en: 'Vietnamese, Chinese, Korean and Japanese lunar calendars, plus Hijri (Islamic) and Jalali (Persian).', vi: 'Âm lịch Việt Nam, Trung Quốc, Hàn Quốc và Nhật Bản, cùng lịch Hijri (Hồi giáo) và Jalali (Ba Tư).' }],
      [{ en: 'Can I get reminders for lunar dates?', vi: 'Có nhắc được theo ngày âm lịch không?' }, { en: 'Yes, with Premium: add events on lunar dates and get advance reminders before they arrive. The free plan includes up to 3 events.', vi: 'Có, với Premium: thêm sự kiện theo ngày âm và nhận nhắc trước khi đến ngày. Bản miễn phí cho tối đa 3 sự kiện.' }],
      [{ en: 'Can I export my events?', vi: 'Tôi có xuất được sự kiện không?' }, { en: 'Yes, Premium lets you export events to an .ics file to back them up or import elsewhere.', vi: 'Có, Premium cho phép xuất sự kiện ra file .ics để sao lưu hoặc nhập vào ứng dụng khác.' }],
      [{ en: 'Which languages are available?', vi: 'Có những ngôn ngữ nào?' }, { en: 'More than 10 languages, including English and Vietnamese.', vi: 'Hơn 10 ngôn ngữ, bao gồm tiếng Anh và tiếng Việt.' }]
    ]
  }
];

// ---------------------------------------------------------------------------

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function buildPage(p) {
  const a = ACCENTS[p.accent];
  // Returns ` data-i18n="kN">English` — use as <tag class="..."${tx(obj)}</tag>
  // Marks translatable text; lang.js looks the English text up in i18n/<lang>.json at runtime.
  const tx = o => { STRINGS[o.en] = o.vi; return ` data-i18n>${esc(o.en)}`; };
  const C = COMMON;
  const slug = p.file.replace('.html', ''); // GitHub Pages serves /alarm for alarm.html
  const url = SITE + slug;
  const others = PRODUCTS.filter(o => o.id !== p.id);
  const ogImage = p.images[0][0].replace('.webp', '.jpg'); // Facebook/Zalo previews use the JPG copy
  const thumb = src => src.replace('images/', 'images/thumbs/');

  const ld = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: p.name,
        applicationCategory: 'BrowserApplication',
        operatingSystem: 'Chrome',
        url,
        downloadUrl: p.store,
        image: SITE + ogImage,
        description: p.seoDesc,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@type': 'Organization', name: 'NAN Smart Team', url: SITE }
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'NAN Smart', item: SITE },
          { '@type': 'ListItem', position: 2, name: p.name, item: url }
        ]
      },
      {
        '@type': 'FAQPage',
        mainEntity: p.faq.map(([q, ans]) => ({ '@type': 'Question', name: q.en, acceptedAnswer: { '@type': 'Answer', text: ans.en } }))
      }
    ]
  };

  const pr = p.pricing;
  const lifetime = pr.type === 'lifetime';
  const muted = 'text-slate-500 dark:text-slate-400';

  // Premium card: price line and call to action differ between one-time licenses and subscriptions.
  const priceBlock = lifetime
    ? `<div class="relative mt-3 mb-1 flex items-baseline gap-2"><span class="${muted} font-medium"${tx(C.from)}</span><span class="text-5xl font-extrabold">$${pr.tiers[0].price}</span><span class="${muted} font-medium"${tx(C.once)}</span></div>
            <p class="relative text-xs ${muted} mb-6"${tx(C.oneTime)}</p>`
    : `<div class="relative mt-3 mb-1 flex items-baseline gap-1"><span class="text-5xl font-extrabold">${pr.month.price}</span><span class="${muted} font-medium"${tx(C.perMonth)}</span></div>
            <p class="relative text-xs ${muted} mb-6"${tx({ en: `or ${pr.year.price} / year (${pr.year.perMonth}/month) — save ${pr.year.save}%`, vi: `hoặc ${pr.year.price} / năm (${pr.year.perMonth}/tháng) — tiết kiệm ${pr.year.save}%` })}</p>`;

  const premiumCta = lifetime
    ? `<a href="#plans" class="relative w-full text-center py-3.5 rounded-xl font-bold ${a.btn} shadow-lg transition-all"${tx(C.upgrade)}</a>`
    : `<div class="relative grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a href="${pr.month.url}" target="_blank" rel="noopener noreferrer" class="text-center py-3.5 rounded-xl font-bold ${a.btn} shadow-lg transition-all"${tx(C.subscribeMonthly)}</a>
              <a href="${pr.year.url}" target="_blank" rel="noopener noreferrer" class="text-center py-3.5 rounded-xl font-bold border-2 ${a.border} ${a.text} hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"${tx(C.subscribeYearly)}</a>
            </div>
            <p class="relative text-xs ${muted} text-center mt-3"${tx(C.cancelAnytime)}</p>`;

  // One-time products also get a row of license packs, matching the plan picker inside the extension.
  const tiersBlock = lifetime ? `
        <div id="plans" class="mt-12 scroll-mt-24">
          <div class="text-center mb-6">
            <h3 class="text-xl font-extrabold"${tx(C.tiersTitle)}</h3>
            <p class="text-sm ${muted} mt-1"${tx(C.tiersSub)}</p>
          </div>
          <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
${pr.tiers.map(t => `            <div class="relative bg-white dark:bg-slate-900 rounded-2xl p-5 text-center flex flex-col ${t.best ? `border-2 ${a.border} shadow-lg` : 'border border-slate-200 dark:border-slate-800'}">
              ${t.best ? `<span class="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${a.btn}"${tx(C.bestValue)}</span>` : ''}
              <div class="text-4xl font-extrabold">${t.n}</div>
              <div class="text-xs ${muted} mb-3"${tx(t.n === 1 ? C.license : C.licenses)}</div>
              <div class="text-2xl font-extrabold">$${t.price} <span class="text-xs font-medium ${muted}"${tx(C.once)}</span></div>
              <div class="text-xs ${muted} mt-1 mb-4">$${(t.price / t.n).toFixed(2).replace(/\.00$/, '')} <span${tx(C.perLicense)}</span></div>
              <a href="${t.url}" target="_blank" rel="noopener noreferrer" class="mt-auto py-2.5 rounded-xl text-sm font-bold ${t.best ? `${a.btn} shadow-md` : 'border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800'} transition-all"${tx(C.buy)}</a>
            </div>`).join('\n')}
          </div>
        </div>` : '';

  const check = cls => `<i class="fa-solid fa-circle-check ${cls} mt-1"></i>`;

  return `<!DOCTYPE html>
<!-- Generated by tools/build-product-pages.js — edit the data there, not this file. -->
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(p.seoTitle)}</title>
  <link rel="icon" href="favicon.ico" sizes="any">
  <link rel="icon" type="image/png" sizes="48x48" href="images/favicon-48.png">
  <link rel="icon" type="image/png" sizes="192x192" href="images/icon-192.png">
  <link rel="apple-touch-icon" href="images/apple-touch-icon.png">
  <link rel="manifest" href="site.webmanifest">
  <meta name="description" content="${esc(p.seoDesc)}">
  <meta name="robots" content="index, follow, max-image-preview:large">
  <meta name="theme-color" content="#2563eb">
  <link rel="canonical" href="${url}">

  <meta property="og:type" content="website">
  <meta property="og:site_name" content="NAN Smart">
  <meta property="og:url" content="${url}">
  <meta property="og:title" content="${esc(p.seoTitle)}">
  <meta property="og:description" content="${esc(p.seoDesc)}">
  <meta property="og:image" content="${SITE}${ogImage}">
  <meta property="og:image:width" content="1280">
  <meta property="og:image:height" content="800">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(p.seoTitle)}">
  <meta name="twitter:description" content="${esc(p.seoDesc)}">
  <meta name="twitter:image" content="${SITE}${ogImage}">

  <script type="application/ld+json">
${JSON.stringify(ld, null, 2)}
  </script>

  <script>
    (function () {
      var t = null;
      try { t = localStorage.getItem('theme'); } catch (e) { }
      if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      if (t === 'dark') document.documentElement.classList.add('dark');
    })();
  </script>
  <link rel="stylesheet" href="home.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="preload" as="style" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"></noscript>
  <link rel="preload" as="image" href="${p.images[0][0]}" fetchpriority="high">
</head>

<body class="bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 min-h-screen bg-mesh transition-colors duration-300 selection:bg-rose-500 selection:text-white">

  <!-- HEADER -->
  <header class="sticky top-0 z-40 w-full glass border-b border-slate-200/80 dark:border-slate-800/60">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-3">
      <a href="./" class="flex items-center gap-3 group shrink-0">
        <div class="w-10 h-10 p-1 rounded-xl bg-slate-900 dark:bg-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform shrink-0">
          <img src="images/logo-mark.png" width="480" height="105" alt="NAN Smart logo" class="w-full h-auto invert dark:invert-0">
        </div>
        <div class="hidden sm:block">
          <span class="text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">NAN Smart</span>
          <span class="block text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase -mt-1"${tx(C.tagline)}</span>
        </div>
      </a>

      <nav class="hidden lg:flex whitespace-nowrap items-center gap-7 font-medium text-sm text-slate-600 dark:text-slate-300">
        <a href="#features" class="hover:text-slate-900 dark:hover:text-white transition-colors"${tx(C.navFeatures)}</a>
        <a href="#screenshots" class="hover:text-slate-900 dark:hover:text-white transition-colors"${tx(C.navScreens)}</a>
        <a href="#pricing" class="hover:text-slate-900 dark:hover:text-white transition-colors"${tx(C.navPricing)}</a>
        <a href="#faq" class="hover:text-slate-900 dark:hover:text-white transition-colors"${tx(C.navFaq)}</a>
        <a href="./#extensions" class="hover:text-slate-900 dark:hover:text-white transition-colors"${tx(C.navAll)}</a>
      </nav>

      <div class="flex items-center gap-2 sm:gap-3">
        <label class="relative flex items-center">
          <i class="fa-solid fa-globe text-xs text-slate-500 dark:text-slate-400 absolute left-2.5 pointer-events-none"></i>
          <select class="lang-select appearance-none pl-7 pr-2 py-2 max-w-[8.5rem] rounded-lg bg-slate-200/80 dark:bg-slate-900/60 dark:[color-scheme:dark] border border-slate-300 dark:border-slate-700 text-xs font-semibold cursor-pointer hover:border-slate-400 transition-colors" aria-label="Language"></select>
        </label>
        <button onclick="toggleTheme()" aria-label="Toggle dark mode"
          class="p-2.5 rounded-lg bg-slate-200/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
          <span class="dark:hidden"><i class="fa-solid fa-moon"></i></span>
          <span class="hidden dark:inline"><i class="fa-solid fa-sun text-amber-400"></i></span>
        </button>
        <button id="menuBtn" onclick="toggleMenu()" aria-label="Menu" aria-expanded="false" aria-controls="mobileMenu"
          class="lg:hidden p-2.5 rounded-lg bg-slate-200/80 dark:bg-slate-900/60 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
          <i class="fa-solid fa-bars"></i>
        </button>
        <a href="${p.store}" target="_blank" rel="noopener noreferrer" class="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-xs font-bold ${a.btn} rounded-lg shadow-md transition-all hover:scale-105">
          <i class="fa-brands fa-chrome"></i><span${tx(C.addChrome)}</span>
        </a>
      </div>
    </div>
    <nav id="mobileMenu" class="hidden lg:hidden flex-col max-w-7xl mx-auto px-4 sm:px-6 pb-3 font-medium text-sm text-slate-600 dark:text-slate-300 border-t border-slate-200/80 dark:border-slate-800/60">
        <a href="#features" class="py-2.5 hover:text-slate-900 dark:hover:text-white"${tx(C.navFeatures)}</a>
        <a href="#screenshots" class="py-2.5 hover:text-slate-900 dark:hover:text-white"${tx(C.navScreens)}</a>
        <a href="#pricing" class="py-2.5 hover:text-slate-900 dark:hover:text-white"${tx(C.navPricing)}</a>
        <a href="#faq" class="py-2.5 hover:text-slate-900 dark:hover:text-white"${tx(C.navFaq)}</a>
        <a href="./#extensions" class="py-2.5 hover:text-slate-900 dark:hover:text-white"${tx(C.navAll)}</a>
      </nav>
  </header>

  <main>
    <!-- HERO -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 md:pb-24">
      <nav aria-label="Breadcrumb" class="text-xs text-slate-500 dark:text-slate-400 mb-8 md:mb-12">
        <a href="./" class="hover:text-slate-900 dark:hover:text-white"${tx(C.home)}</a>
        <i class="fa-solid fa-chevron-right text-[9px] mx-2"></i>
        <span class="text-slate-700 dark:text-slate-300">${esc(p.name)}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div class="min-w-0">
          <div class="flex items-center gap-3 mb-6">
            <div class="w-12 h-12 p-2 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm flex items-center justify-center shrink-0">
              <img src="${p.icon}" alt="" class="w-full h-full object-contain">
            </div>
            <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${a.soft} text-xs font-semibold"${tx(p.badge)}</span>
          </div>
          <h1 class="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-6">
            <span${tx(p.title1)}</span>
            <span class="block ${a.text} pb-1"${tx(p.title2)}</span>
          </h1>
          <p class="text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-xl"${tx(p.desc)}</p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a href="${p.store}" target="_blank" rel="noopener noreferrer" class="px-7 py-3.5 rounded-xl ${a.btn} font-semibold shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2">
              <i class="fa-brands fa-chrome"></i><span${tx(C.addChrome)}</span>
            </a>
            <a href="#pricing" class="px-7 py-3.5 rounded-xl glass hover:bg-slate-200/80 dark:hover:bg-slate-800/80 font-semibold border border-slate-300 dark:border-slate-700 transition-all flex items-center justify-center gap-2">
              <i class="fa-solid fa-tag ${a.text}"></i><span${tx(C.seePricing)}</span>
            </a>
          </div>
        </div>

        <div class="min-w-0">
          <button onclick="openLightbox()" aria-label="View full size"
            class="block w-full rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-2xl shadow-slate-900/10 ring-1 ring-slate-200 dark:ring-slate-800 hover:ring-2 hover:ring-slate-400 transition-all">
            <img id="heroImg" src="${p.images[0][0]}" width="1280" height="800" alt="${esc(p.images[0][1])}" fetchpriority="high" class="w-full aspect-[16/10] object-cover">
          </button>
          <div id="heroThumbs" class="grid ${p.images.length === 4 ? 'grid-cols-4' : 'grid-cols-5'} gap-2 sm:gap-3 mt-4"></div>
        </div>
      </div>
    </section>

    <!-- FEATURES -->
    <section id="features" class="py-16 md:py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80 scroll-mt-20">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 class="text-3xl font-extrabold tracking-tight text-center mb-12"${tx(C.featuresTitle)}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
${p.features.map(([icon, t, d]) => `          <div class="glass p-7 rounded-2xl border border-slate-200 dark:border-slate-800 card-hover">
            <div class="w-12 h-12 rounded-xl ${a.soft} flex items-center justify-center text-xl mb-5"><i class="fa-solid ${icon}"></i></div>
            <h3 class="text-lg font-bold mb-2"${tx(t)}</h3>
            <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed"${tx(d)}</p>
          </div>`).join('\n')}
        </div>
      </div>
    </section>

    <!-- HOW IT WORKS -->
    <section class="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-3xl font-extrabold tracking-tight text-center mb-12"${tx(C.howTitle)}</h2>
      <ol class="grid grid-cols-1 md:grid-cols-3 gap-6">
${p.steps.map(([t, d], i) => `        <li class="relative glass p-7 rounded-2xl border border-slate-200 dark:border-slate-800">
          <span class="w-10 h-10 rounded-full ${a.soft} font-extrabold flex items-center justify-center mb-5 shadow-md">${i + 1}</span>
          <h3 class="text-lg font-bold mb-2"${tx(t)}</h3>
          <p class="text-slate-600 dark:text-slate-400 text-sm leading-relaxed"${tx(d)}</p>
        </li>`).join('\n')}
      </ol>
    </section>

    <!-- SCREENSHOTS -->
    <section id="screenshots" class="py-16 md:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-extrabold tracking-tight"${tx(C.screensTitle)}</h2>
        <p class="text-slate-600 dark:text-slate-400 mt-3"${tx(C.screensSub)}</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 ${p.images.length === 4 ? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-6">
${p.images.map(([src, en, viText], i) => `        <figure>
          <button onclick="openLightbox(${i})" class="group block w-full rounded-2xl overflow-hidden ring-1 ring-slate-200 dark:ring-slate-800 shadow-sm hover:shadow-xl transition-all">
            <img src="${thumb(src)}" width="640" height="400" alt="${esc(en)}" loading="lazy" class="w-full aspect-[16/10] object-cover group-hover:scale-105 transition-transform duration-500">
          </button>
          <figcaption class="text-sm text-slate-600 dark:text-slate-400 mt-3 px-1"${tx({ en, vi: viText })}</figcaption>
        </figure>`).join('\n')}
      </div>
    </section>

    <!-- PRICING -->
    <section id="pricing" class="py-16 md:py-20 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200 dark:border-slate-800/80 scroll-mt-20">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-12">
          <h2 class="text-3xl font-extrabold tracking-tight"${tx(C.pricingTitle)}</h2>
          <p class="text-slate-600 dark:text-slate-400 mt-3"${tx(lifetime ? C.pricingSubLifetime : C.pricingSubSubscription)}</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col">
            <h3 class="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"${tx(C.free)}</h3>
            <div class="mt-3 mb-6"><span class="text-5xl font-extrabold">$0</span></div>
            <ul class="space-y-3 text-sm flex-1 mb-8">
${p.freeList.map(f => `              <li class="flex items-start gap-3">${check('text-slate-400')}<span${tx(f)}</span></li>`).join('\n')}
            </ul>
            <a href="${p.store}" target="_blank" rel="noopener noreferrer" class="w-full text-center py-3.5 rounded-xl font-semibold border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"${tx(C.getStarted)}</a>
          </div>
          <div class="relative bg-white dark:bg-slate-900 p-8 rounded-3xl border-2 ${a.border} shadow-xl flex flex-col overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br ${a.glow} to-transparent pointer-events-none"></div>
            <span class="absolute top-5 right-5 text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${a.soft}"${tx(C.popular)}</span>
            <h3 class="relative text-sm font-bold uppercase tracking-wider ${a.text}"${tx(C.premium)}</h3>
            ${priceBlock}
            <ul class="relative space-y-3 text-sm flex-1 mb-8">
${p.premiumList.map(f => `              <li class="flex items-start gap-3">${check(a.text)}<span${tx(f)}</span></li>`).join('\n')}
            </ul>
            ${premiumCta}
          </div>
        </div>${tiersBlock}
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="py-16 md:py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-20">
      <h2 class="text-3xl font-extrabold tracking-tight text-center mb-10"${tx(C.faqTitle)}</h2>
      <div class="space-y-3">
${p.faq.map(([q, ans]) => `        <details class="group glass rounded-2xl border border-slate-200 dark:border-slate-800 px-6 py-4">
          <summary class="flex items-center justify-between gap-4 cursor-pointer font-semibold">
            <span${tx(q)}</span>
            <i class="faq-chevron fa-solid fa-chevron-down text-xs text-slate-400 transition-transform"></i>
          </summary>
          <p class="text-sm text-slate-600 dark:text-slate-400 leading-relaxed mt-3"${tx(ans)}</p>
        </details>`).join('\n')}
      </div>
    </section>

    <!-- MORE EXTENSIONS -->
    <section class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h2 class="text-2xl font-extrabold tracking-tight mb-6"${tx(C.moreTitle)}</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
${others.map(o => `        <a href="${o.file.replace('.html', '')}" class="glass p-5 rounded-2xl border border-slate-200 dark:border-slate-800 card-hover flex items-start gap-4">
          <div class="w-11 h-11 p-2 rounded-xl bg-white dark:bg-slate-800 ring-1 ring-slate-200 dark:ring-slate-700 shadow-sm flex items-center justify-center shrink-0">
            <img src="${o.icon}" alt="" class="w-full h-full object-contain">
          </div>
          <div>
            <h3 class="font-bold">${esc(o.name)}</h3>
            <p class="text-sm text-slate-600 dark:text-slate-400 mt-1"${tx(o.short)}</p>
          </div>
        </a>`).join('\n')}
      </div>
    </section>

    <!-- SUPPORT -->
    <section class="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="glass rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 flex flex-col md:flex-row items-center justify-between gap-8">
        <div class="max-w-2xl">
          <span class="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400"${tx(C.helpTag)}</span>
          <h2 class="text-2xl md:text-3xl font-extrabold mt-2 mb-4"${tx(C.helpTitle)}</h2>
          <p class="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed"${tx(C.helpDesc)}</p>
        </div>
        <a href="mailto:${EMAIL}" class="w-full md:w-auto px-6 py-3.5 rounded-xl ${a.btn} font-semibold text-sm shadow-sm text-center transition-all">
          <i class="fa-solid fa-envelope mr-2"></i><span${tx(C.contact)}</span>
        </a>
      </div>
    </section>
  </main>

  <!-- FOOTER -->
  <footer class="border-t border-slate-200 dark:border-slate-800/80 mt-12 py-10 bg-slate-100 dark:bg-slate-950/80 text-slate-500 dark:text-slate-400 text-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
      <a href="./" class="flex flex-wrap items-center justify-center gap-3">
        <div class="w-8 h-8 p-1 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center shrink-0"><img src="images/logo-mark.png" width="480" height="105" alt="NAN Smart logo" class="w-full h-auto invert dark:invert-0"></div>
        <span class="font-bold text-slate-800 dark:text-slate-200">NAN Smart</span>
        <span class="text-xs">&copy; 2026 NAN Smart Team.</span>
      </a>
      <div class="flex items-center gap-6 text-xs sm:text-sm">
        <a href="privacy" class="hover:text-slate-900 dark:hover:text-white transition-colors"${tx(C.privacy)}</a>
        <a href="terms" class="hover:text-slate-900 dark:hover:text-white transition-colors"${tx(C.terms)}</a>
        <a href="mailto:${EMAIL}" class="hover:text-slate-900 dark:hover:text-white transition-colors"${tx(C.footerContact)}</a>
      </div>
    </div>
  </footer>

  <!-- LIGHTBOX -->
  <div id="lightbox" onclick="if (event.target === this) closeLightbox()" role="dialog" aria-modal="true" aria-label="Screenshot viewer"
    class="fixed inset-0 z-[60] hidden items-center justify-center p-4 sm:p-10 bg-slate-950/90 backdrop-blur-sm">
    <button onclick="closeLightbox()" aria-label="Close"
      class="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
      <i class="fa-solid fa-xmark text-lg"></i>
    </button>
    <button onclick="stepLightbox(-1)" aria-label="Previous"
      class="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <figure class="max-w-6xl w-full">
      <img id="lightboxImg" src="" alt="" class="w-full max-h-[80vh] object-contain rounded-xl shadow-2xl">
      <figcaption id="lightboxCaption" class="text-center text-slate-300 text-sm mt-3"></figcaption>
    </figure>
    <button onclick="stepLightbox(1)" aria-label="Next"
      class="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center">
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </div>

  <script>
    window.PAGE = ${JSON.stringify({ title: p.name, ring: a.sel, images: p.images.map(i => i[0]) })};
  </script>
  <script src="lang.js"></script>
  <script src="product.js"></script>
</body>

</html>
`;
}

// English -> Vietnamese pairs collected while building; tools/build-i18n.js turns them into i18n/*.json
const STRINGS = {};
const root = path.join(__dirname, '..');
for (const p of PRODUCTS) {
  fs.writeFileSync(path.join(root, p.file), buildPage(p));
  console.log('wrote', p.file);
}
fs.writeFileSync(path.join(__dirname, 'strings-products.json'), JSON.stringify(STRINGS, null, 2));
console.log('wrote tools/strings-products.json', Object.keys(STRINGS).length, 'strings');
