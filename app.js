/* ===================================================
   SMARTHOME BOOKING SYSTEM  —  app.js  (File 3 of 3)
   AngularJS 1.8 : Module · Routes · Services · Controllers
   =================================================== */

/* ───────────────────────────────────────────
   1. MODULE DECLARATION
─────────────────────────────────────────── */
angular.module('SmartHomeApp', ['ngRoute'])

/* ───────────────────────────────────────────
   2. ROUTES
─────────────────────────────────────────── */
.config(['$routeProvider', function ($rp) {
  $rp
    .when('/login',   { templateUrl: 'login.html',   controller: 'AuthCtrl'    })
    .when('/home',    { templateUrl: 'home.html',     controller: 'HomeCtrl',    requiresAuth: true })
    .when('/booking', { templateUrl: 'booking.html',  controller: 'BookingCtrl', requiresAuth: true })
    .when('/history', { templateUrl: 'history.html',  controller: 'HistoryCtrl', requiresAuth: true })
    .when('/profile', { templateUrl: 'profile.html',  controller: 'ProfileCtrl', requiresAuth: true })
    .when('/reviews', { templateUrl: 'reviews.html',  controller: 'ReviewCtrl',  requiresAuth: true })
    .otherwise({ redirectTo: '/login' });
}])

/* ───────────────────────────────────────────
   3. ROUTE GUARD — redirect to login if not signed in
─────────────────────────────────────────── */
.run(['$rootScope', '$location', 'AuthService', function ($rs, $loc, Auth) {
  $rs.$on('$routeChangeStart', function (e, next) {
    if (next.$$route && next.$$route.requiresAuth && !Auth.isLoggedIn()) {
      $loc.path('/login');
    }
  });
  $rs.$on('$routeChangeSuccess', function () {
    $rs.currentPath = $loc.path();
  });
}])

/* ───────────────────────────────────────────
   4. AUTH SERVICE  (localStorage-backed)
─────────────────────────────────────────── */
.service('AuthService', [function () {
  var USERS_KEY = 'sh_users';
  var CUR_KEY   = 'sh_current_user';

  function getUsers() {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  }
  function saveUsers(u) {
    localStorage.setItem(USERS_KEY, JSON.stringify(u));
  }

  /* Seed a demo user on first load */
  if (!getUsers().length) {
    saveUsers([{ id: 1, name: 'Demo User', email: 'demo@home.com', password: '123456', phone: '9876543210', address: '12, Green Park, New Delhi' }]);
  }

  this.register = function (name, email, password, phone) {
    var users = getUsers();
    if (users.find(function (u) { return u.email === email; })) {
      return { ok: false, msg: 'Email already registered.' };
    }
    var id = Date.now();
    users.push({ id: id, name: name, email: email, password: password, phone: phone, address: '' });
    saveUsers(users);
    return { ok: true };
  };

  this.login = function (email, password) {
    var users = getUsers();
    var user = users.find(function (u) { return u.email === email && u.password === password; });
    if (user) {
      localStorage.setItem(CUR_KEY, JSON.stringify(user));
      return { ok: true, user: user };
    }
    return { ok: false, msg: 'Invalid email or password.' };
  };

  this.logout = function () {
    localStorage.removeItem(CUR_KEY);
  };

  this.isLoggedIn = function () {
    return !!localStorage.getItem(CUR_KEY);
  };

  this.getCurrentUser = function () {
    return JSON.parse(localStorage.getItem(CUR_KEY)) || null;
  };

  this.updateUser = function (updated) {
    var users = getUsers();
    var idx = users.findIndex(function (u) { return u.id === updated.id; });
    if (idx > -1) {
      users[idx] = updated;
      saveUsers(users);
      localStorage.setItem(CUR_KEY, JSON.stringify(updated));
      return true;
    }
    return false;
  };
}])

/* ───────────────────────────────────────────
   5. BOOKING SERVICE  (localStorage-backed)
─────────────────────────────────────────── */
.service('BookingService', ['AuthService', function (Auth) {
  var KEY = 'sh_bookings';

  function all() {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  }
  function saveAll(b) {
    localStorage.setItem(KEY, JSON.stringify(b));
  }

  /* Seed demo bookings on first load */
  if (!all().length) {
    var demo = [
      { id: 1001, userId: 1, category: 'AC Service',  categoryIcon: '❄️',  service: 'AC Deep Cleaning',  date: '2025-07-10', time: '10:00 AM', address: '12, Green Park, New Delhi', notes: 'Split AC in bedroom',  status: 'completed', price: 599,  rating: 5, review: 'Excellent service! Very professional.',  reviewDate: '2025-07-11' },
      { id: 1002, userId: 1, category: 'Plumbing',    categoryIcon: '🔧',  service: 'Pipe Leakage Fix',  date: '2025-07-14', time: '02:00 PM', address: '12, Green Park, New Delhi', notes: 'Kitchen pipe leaking', status: 'completed', price: 349,  rating: 4, review: 'Good work, arrived on time.', reviewDate: '2025-07-15' },
      { id: 1003, userId: 1, category: 'Electrical',  categoryIcon: '⚡',  service: 'Fan Installation',  date: '2025-07-18', time: '11:00 AM', address: '12, Green Park, New Delhi', notes: '',                   status: 'confirmed', price: 299,  rating: 0, review: '' },
      { id: 1004, userId: 1, category: 'Cleaning',    categoryIcon: '🧹',  service: 'Home Deep Clean',   date: '2025-07-20', time: '09:00 AM', address: '12, Green Park, New Delhi', notes: '3BHK apartment',      status: 'pending',   price: 1299, rating: 0, review: '' }
    ];
    saveAll(demo);
  }

  this.getBookings = function () {
    var user = Auth.getCurrentUser();
    if (!user) return [];
    return all().filter(function (b) { return b.userId === user.id; });
  };

  this.addBooking = function (booking) {
    var list = all();
    booking.id     = Date.now();
    booking.userId = Auth.getCurrentUser().id;
    booking.status = 'pending';
    booking.rating = 0;
    booking.review = '';
    list.push(booking);
    saveAll(list);
    return booking;
  };

  this.cancelBooking = function (id) {
    var list = all();
    var b = list.find(function (x) { return x.id === id; });
    if (b) { b.status = 'cancelled'; saveAll(list); return true; }
    return false;
  };

  this.addReview = function (id, rating, review) {
    var list = all();
    var b = list.find(function (x) { return x.id === id; });
    if (b) {
      b.rating = rating;
      b.review = review;
      b.reviewDate = new Date().toISOString().split('T')[0];
      saveAll(list);
      return true;
    }
    return false;
  };

  this.getAllReviews = function () {
    return all().filter(function (b) { return b.rating > 0; });
  };
}])

/* ───────────────────────────────────────────
   6. APP CONTROLLER  (navbar / global)
─────────────────────────────────────────── */
.controller('AppCtrl', ['$scope', '$rootScope', '$location', 'AuthService',
function ($sc, $rs, $loc, Auth) {
  $sc.isLoggedIn = function () { return Auth.isLoggedIn(); };
  $sc.currentUser = function () { return Auth.getCurrentUser(); };
  $sc.isActive = function (path) { return $loc.path() === path; };
  $sc.initials = function () {
    var u = Auth.getCurrentUser();
    return u ? u.name.charAt(0).toUpperCase() : '?';
  };
  $sc.logout = function () {
    Auth.logout();
    $loc.path('/login');
  };
  $rs.$on('$routeChangeSuccess', function () {
    $sc.currentPath = $loc.path();
  });
}])

/* ───────────────────────────────────────────
   7. AUTH CONTROLLER  (login + register)
─────────────────────────────────────────── */
.controller('AuthCtrl', ['$scope', '$location', 'AuthService',
function ($sc, $loc, Auth) {
  /* Redirect if already logged in */
  if (Auth.isLoggedIn()) { $loc.path('/home'); return; }

  $sc.tab  = 'login';
  $sc.sub  = false;
  $sc.err  = '';
  $sc.done = false;

  $sc.lf = { email: 'demo@home.com', password: '123456' };
  $sc.rf = { name: '', email: '', password: '', confirm: '', phone: '' };

  $sc.switchTab = function (t) { $sc.tab = t; $sc.err = ''; $sc.sub = false; $sc.done = false; };

  $sc.doLogin = function (f) {
    $sc.sub = true; $sc.err = '';
    if (!f.$valid) { $sc.err = 'Please fill all fields correctly.'; return; }
    var r = Auth.login($sc.lf.email, $sc.lf.password);
    if (r.ok) { $loc.path('/home'); }
    else { $sc.err = r.msg; }
  };

  $sc.doRegister = function (f) {
    $sc.sub = true; $sc.err = ''; $sc.done = false;
    if (!f.$valid) { $sc.err = 'Please fill all fields correctly.'; return; }
    if ($sc.rf.password !== $sc.rf.confirm) { $sc.err = 'Passwords do not match.'; return; }
    var r = Auth.register($sc.rf.name, $sc.rf.email, $sc.rf.password, $sc.rf.phone);
    if (r.ok) { $sc.done = true; $sc.sub = false; setTimeout(function () { $sc.$apply(function () { $sc.switchTab('login'); $sc.lf.email = $sc.rf.email; }); }, 1500); }
    else { $sc.err = r.msg; }
  };

  $sc.invalid = function (f, n) { return $sc.sub && f[n] && f[n].$invalid; };
}])

/* ───────────────────────────────────────────
   8. HOME CONTROLLER  (dashboard)
─────────────────────────────────────────── */
.controller('HomeCtrl', ['$scope', '$rootScope', '$location', 'AuthService', 'BookingService',
function ($sc, $rs, $loc, Auth, Booking) {
  $sc.user     = Auth.getCurrentUser();
  var bookings = Booking.getBookings();
  $sc.totalBookings    = bookings.length;
  $sc.pendingBookings  = bookings.filter(function (b) { return b.status === 'pending'; }).length;
  $sc.completedBookings= bookings.filter(function (b) { return b.status === 'completed'; }).length;
  $sc.recentBookings   = bookings.slice(-3).reverse();

  $sc.categories = [
    { id: 'Electrical',      icon: '⚡', color: '#FEF9C3', iconColor: '#A16207', sub: '6 services' },
    { id: 'Plumbing',        icon: '🔧', color: '#DBEAFE', iconColor: '#1D4ED8', sub: '6 services' },
    { id: 'Carpentry',       icon: '🔨', color: '#FEF3C7', iconColor: '#92400E', sub: '6 services' },
    { id: 'AC Service',      icon: '❄️', color: '#CFFAFE', iconColor: '#0E7490', sub: '6 services' },
    { id: 'Cleaning',        icon: '🧹', color: '#DCFCE7', iconColor: '#166534', sub: '6 services' },
    { id: 'Painting',        icon: '🎨', color: '#FFEDD5', iconColor: '#9A3412', sub: '6 services' },
    { id: 'Appliance Repair',icon: '🔌', color: '#EDE9FE', iconColor: '#5B21B6', sub: '6 services' },
    { id: 'Security / CCTV', icon: '📹', color: '#FFE4E6', iconColor: '#9F1239', sub: '6 services' }
  ];

  $sc.bookCategory = function (cat) {
    $rs.selectedCategory = cat;
    $loc.path('/booking');
  };
}])

/* ───────────────────────────────────────────
   9. BOOKING CONTROLLER  (multi-step form)
─────────────────────────────────────────── */
.controller('BookingCtrl', ['$scope', '$rootScope', '$location', 'AuthService', 'BookingService',
function ($sc, $rs, $loc, Auth, Booking) {
  $sc.user   = Auth.getCurrentUser();
  $sc.step   = 1;
  $sc.done   = false;

  $sc.categories = [
    { id: 'Electrical',       icon: '⚡', color: '#FEF9C3', services: ['Fan Installation','Wiring & Rewiring','Switch / Socket Repair','MCB / Fuse Box','Light Fitting','AC Installation'] },
    { id: 'Plumbing',         icon: '🔧', color: '#DBEAFE', services: ['Pipe Leakage Fix','Tap Repair','Toilet Fix','Bathroom Fitting','Water Pump Repair','Drain Cleaning'] },
    { id: 'Carpentry',        icon: '🔨', color: '#FEF3C7', services: ['Door Repair','Window Fix','Furniture Repair','Shelf Installation','Cabinet Fix','Wooden Flooring'] },
    { id: 'AC Service',       icon: '❄️', color: '#CFFAFE', services: ['AC Deep Cleaning','AC Gas Refill','AC Repair','AC Installation','AC Uninstall','Annual Maintenance'] },
    { id: 'Cleaning',         icon: '🧹', color: '#DCFCE7', services: ['Home Deep Clean','Kitchen Cleaning','Bathroom Cleaning','Sofa / Carpet Clean','Window Cleaning','Post Construction Clean'] },
    { id: 'Painting',         icon: '🎨', color: '#FFEDD5', services: ['Interior Painting','Exterior Painting','Waterproofing','Texture Painting','Wood Polish','Wall Putty'] },
    { id: 'Appliance Repair', icon: '🔌', color: '#EDE9FE', services: ['Washing Machine','Refrigerator','Microwave Oven','TV Repair','Geyser Repair','Chimney Repair'] },
    { id: 'Security / CCTV',  icon: '📹', color: '#FFE4E6', services: ['CCTV Installation','CCTV Repair','Smart Lock','Intercom Setup','Alarm System','Video Doorbell'] }
  ];

  /* Pre-select from home click */
  $sc.sel = {
    category: $rs.selectedCategory || null,
    service:  null,
    date:     '',
    time:     '10:00',
    address:  ($sc.user && $sc.user.address) || '',
    notes:    ''
  };

  var prices = { 'Fan Installation':299,'Wiring & Rewiring':799,'Switch / Socket Repair':199,'MCB / Fuse Box':399,'Light Fitting':249,'AC Installation':1499,'Pipe Leakage Fix':349,'Tap Repair':199,'Toilet Fix':449,'Bathroom Fitting':699,'Water Pump Repair':599,'Drain Cleaning':399,'Door Repair':499,'Window Fix':399,'Furniture Repair':699,'Shelf Installation':349,'Cabinet Fix':549,'Wooden Flooring':1299,'AC Deep Cleaning':599,'AC Gas Refill':899,'AC Repair':749,'AC Uninstall':399,'Annual Maintenance':1199,'Home Deep Clean':1299,'Kitchen Cleaning':599,'Bathroom Cleaning':399,'Sofa / Carpet Clean':499,'Window Cleaning':349,'Post Construction Clean':1499,'Interior Painting':999,'Exterior Painting':1499,'Waterproofing':799,'Texture Painting':1199,'Wood Polish':499,'Wall Putty':699,'Washing Machine':499,'Refrigerator':599,'Microwave Oven':349,'TV Repair':449,'Geyser Repair':399,'Chimney Repair':549,'CCTV Installation':1299,'CCTV Repair':549,'Smart Lock':799,'Intercom Setup':899,'Alarm System':1099,'Video Doorbell':699 };

  $sc.times = ['08:00 AM','09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM'];

  $sc.selectCategory = function (cat) { $sc.sel.category = cat; $sc.sel.service = null; };
  $sc.selectService  = function (svc) { $sc.sel.service = svc; };

  $sc.getPrice = function () { return $sc.sel.service ? (prices[$sc.sel.service] || 399) : 0; };
  $sc.getCategoryIcon = function () {
    if (!$sc.sel.category) return '';
    var c = $sc.categories.find(function (x) { return x.id === $sc.sel.category; });
    return c ? c.icon : '';
  };

  $sc.goStep2 = function () { if ($sc.sel.category && $sc.sel.service) $sc.step = 2; };
  $sc.goStep1 = function () { $sc.step = 1; };

  $sc.submitBooking = function (f) {
    $sc.sub = true;
    if (!f.$valid || !$sc.sel.date || !$sc.sel.time) return;
    Booking.addBooking({
      category:     $sc.sel.category,
      categoryIcon: $sc.getCategoryIcon(),
      service:      $sc.sel.service,
      date:         $sc.sel.date,
      time:         $sc.sel.time,
      address:      $sc.sel.address,
      notes:        $sc.sel.notes,
      price:        $sc.getPrice()
    });
    $sc.step = 3;
    $sc.done = true;
  };

  $sc.bookAgain = function () { $sc.step = 1; $sc.done = false; $sc.sel = { category: null, service: null, date: '', time: '10:00 AM', address: ($sc.user && $sc.user.address) || '', notes: '' }; };
}])

/* ───────────────────────────────────────────
   10. HISTORY CONTROLLER
─────────────────────────────────────────── */
.controller('HistoryCtrl', ['$scope', 'BookingService',
function ($sc, Booking) {
  $sc.filter  = 'all';
  $sc.allBookings = Booking.getBookings().reverse();

  $sc.filtered = function () {
    if ($sc.filter === 'all') return $sc.allBookings;
    return $sc.allBookings.filter(function (b) { return b.status === $sc.filter; });
  };

  $sc.setFilter = function (f) { $sc.filter = f; };

  $sc.cancel = function (b) {
    if (confirm('Cancel this booking?')) {
      Booking.cancelBooking(b.id);
      b.status = 'cancelled';
    }
  };

  $sc.statusFilters = [
    { key: 'all', label: 'All' },
    { key: 'pending',   label: 'Pending'   },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'completed', label: 'Completed' },
    { key: 'cancelled', label: 'Cancelled' }
  ];
}])

/* ───────────────────────────────────────────
   11. PROFILE CONTROLLER
─────────────────────────────────────────── */
.controller('ProfileCtrl', ['$scope', 'AuthService', 'BookingService',
function ($sc, Auth, Booking) {
  $sc.user    = angular.copy(Auth.getCurrentUser());
  $sc.editing = false;
  $sc.saved   = false;

  var bookings    = Booking.getBookings();
  $sc.totalB      = bookings.length;
  $sc.completedB  = bookings.filter(function (b) { return b.status === 'completed'; }).length;
  var rated       = bookings.filter(function (b) { return b.rating > 0; });
  $sc.avgRating   = rated.length ? (rated.reduce(function (s, b) { return s + b.rating; }, 0) / rated.length).toFixed(1) : 'N/A';

  $sc.startEdit = function () { $sc.editing = true; $sc.saved = false; };
  $sc.cancelEdit = function () { $sc.user = angular.copy(Auth.getCurrentUser()); $sc.editing = false; };
  $sc.saveProfile = function (f) {
    if (!f.$valid) return;
    Auth.updateUser($sc.user);
    $sc.editing = false;
    $sc.saved = true;
  };
  $sc.initials = function () { return $sc.user ? $sc.user.name.charAt(0).toUpperCase() : '?'; };
}])

/* ───────────────────────────────────────────
   12. REVIEW CONTROLLER
─────────────────────────────────────────── */
.controller('ReviewCtrl', ['$scope', 'BookingService',
function ($sc, Booking) {
  $sc.starsArr = [1, 2, 3, 4, 5];

  function reload() {
    var bookings = Booking.getBookings();
    $sc.toRate  = bookings.filter(function (b) { return b.status === 'completed' && b.rating === 0; });
    $sc.reviews = Booking.getAllReviews().reverse();
  }
  reload();

  $sc.ratings = {};
  $sc.texts   = {};
  $sc.hover   = {};

  $sc.setRating = function (bookingId, star) {
    $sc.ratings[bookingId] = star;
  };
  $sc.setHover = function (bookingId, star) {
    $sc.hover[bookingId] = star;
  };
  $sc.clearHover = function (bookingId) {
    $sc.hover[bookingId] = 0;
  };
  $sc.starClass = function (bookingId, star) {
    var active = $sc.hover[bookingId] || $sc.ratings[bookingId] || 0;
    return star <= active ? 'filled' : 'empty';
  };

  $sc.submitReview = function (b) {
    if (!$sc.ratings[b.id] || $sc.ratings[b.id] === 0) { alert('Please select a star rating.'); return; }
    Booking.addReview(b.id, $sc.ratings[b.id], $sc.texts[b.id] || '');
    reload();
  };
}]);
