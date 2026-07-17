/* =============================================
   SMARTHOME — AngularJS 1.8.3 Application
   Data: localStorage only. No backend.
   ============================================= */

(function () {
  'use strict';

  /* ==================== DATA ==================== */
  var CATEGORIES = [
    {
      name: 'Electrical', icon: '⚡',
      services: [
        { name: 'Ceiling Fan Installation', price: 299 },
        { name: 'Electrical Wiring', price: 599 },
        { name: 'Switch/Socket Repair', price: 199 },
        { name: 'MCB/Fuse Replacement', price: 249 },
        { name: 'Light Fixture Installation', price: 349 },
        { name: 'AC Installation', price: 799 }
      ]
    },
    {
      name: 'Plumbing', icon: '🔧',
      services: [
        { name: 'Pipe Leak Repair', price: 399 },
        { name: 'Tap/Faucet Replacement', price: 299 },
        { name: 'Toilet Repair', price: 449 },
        { name: 'Bathroom Fitting', price: 699 },
        { name: 'Water Pump Repair', price: 549 },
        { name: 'Drain Cleaning', price: 349 }
      ]
    },
    {
      name: 'Carpentry', icon: '🔨',
      services: [
        { name: 'Door Repair/Install', price: 499 },
        { name: 'Window Repair', price: 399 },
        { name: 'Furniture Assembly', price: 349 },
        { name: 'Shelf Installation', price: 299 },
        { name: 'Cabinet Repair', price: 449 },
        { name: 'Flooring', price: 799 }
      ]
    },
    {
      name: 'AC Service', icon: '❄️',
      services: [
        { name: 'AC Cleaning', price: 399 },
        { name: 'Gas Refilling', price: 699 },
        { name: 'AC Repair', price: 599 },
        { name: 'AC Installation', price: 799 },
        { name: 'AC Uninstallation', price: 349 },
        { name: 'Annual Maintenance', price: 999 }
      ]
    },
    {
      name: 'Cleaning', icon: '🧹',
      services: [
        { name: 'Deep Home Cleaning', price: 999 },
        { name: 'Kitchen Cleaning', price: 599 },
        { name: 'Bathroom Cleaning', price: 399 },
        { name: 'Sofa Cleaning', price: 449 },
        { name: 'Post-Construction Cleaning', price: 1499 },
        { name: 'Office Cleaning', price: 799 }
      ]
    },
    {
      name: 'Painting', icon: '🎨',
      services: [
        { name: 'Interior Painting', price: 2999 },
        { name: 'Exterior Painting', price: 4999 },
        { name: 'Waterproofing', price: 1999 },
        { name: 'Texture Painting', price: 3499 },
        { name: 'Wood Polishing', price: 1499 },
        { name: 'Wall Putty', price: 1299 }
      ]
    },
    {
      name: 'Appliance Repair', icon: '🔌',
      services: [
        { name: 'Washing Machine Repair', price: 499 },
        { name: 'Refrigerator Repair', price: 549 },
        { name: 'Microwave Repair', price: 349 },
        { name: 'TV Repair', price: 399 },
        { name: 'Water Purifier Service', price: 299 },
        { name: 'Geyser Repair', price: 449 }
      ]
    },
    {
      name: 'Security/CCTV', icon: '📹',
      services: [
        { name: 'CCTV Installation', price: 1499 },
        { name: 'CCTV Repair', price: 699 },
        { name: 'Smart Lock Installation', price: 899 },
        { name: 'Video Doorbell', price: 749 },
        { name: 'Intercom Setup', price: 599 },
        { name: 'Alarm System', price: 1299 }
      ]
    }
  ];

  /* ==================== SEED DATA ==================== */
  function seedData() {
    var users = JSON.parse(localStorage.getItem('sh_users') || '[]');
    var bookings = JSON.parse(localStorage.getItem('sh_bookings') || '[]');

    if (users.length === 0) {
      users.push({
        name: 'Demo User',
        email: 'demo@home.com',
        password: '123456',
        phone: '9876543210',
        address: '123 Main Street, Mumbai'
      });
      localStorage.setItem('sh_users', JSON.stringify(users));
    }

    if (bookings.length === 0) {
      var now = new Date();
      var d1 = new Date(now); d1.setDate(d1.getDate() - 15);
      var d2 = new Date(now); d2.setDate(d2.getDate() - 7);
      var d3 = new Date(now); d3.setDate(d3.getDate() + 5);

      bookings = [
        {
          id: 'bk_001',
          userEmail: 'demo@home.com',
          categoryName: 'AC Service',
          categoryIcon: '❄️',
          serviceName: 'AC Cleaning',
          price: 399,
          date: d1.toISOString().split('T')[0],
          time: 'Morning',
          address: '123 Main Street, Mumbai',
          notes: 'Please bring equipment for split AC.',
          status: 'Completed',
          createdAt: d1.toISOString(),
          review: { rating: 4, text: 'Great service, technician was professional and on time.' }
        },
        {
          id: 'bk_002',
          userEmail: 'demo@home.com',
          categoryName: 'Plumbing',
          categoryIcon: '🔧',
          serviceName: 'Pipe Leak Repair',
          price: 399,
          date: d2.toISOString().split('T')[0],
          time: 'Afternoon',
          address: '123 Main Street, Mumbai',
          notes: '',
          status: 'Confirmed',
          createdAt: d2.toISOString(),
          review: null
        },
        {
          id: 'bk_003',
          userEmail: 'demo@home.com',
          categoryName: 'Painting',
          categoryIcon: '🎨',
          serviceName: 'Interior Painting',
          price: 2999,
          date: d3.toISOString().split('T')[0],
          time: 'Morning',
          address: '123 Main Street, Mumbai',
          notes: '2 BHK, 3 rooms.',
          status: 'Pending',
          createdAt: d3.toISOString(),
          review: null
        }
      ];
      localStorage.setItem('sh_bookings', JSON.stringify(bookings));
    }
  }

  /* ==================== MODULE ==================== */
  var app = angular.module('SmartHomeApp', ['ngRoute']);

  /* ==================== ROUTES ==================== */
  app.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/login',   { templateUrl: 'login.html',   controller: 'AuthCtrl' })
      .when('/home',    { templateUrl: 'home.html',    controller: 'HomeCtrl' })
      .when('/booking', { templateUrl: 'booking.html', controller: 'BookingCtrl' })
      .when('/history', { templateUrl: 'history.html', controller: 'HistoryCtrl' })
      .when('/profile', { templateUrl: 'profile.html', controller: 'ProfileCtrl' })
      .when('/reviews', { templateUrl: 'reviews.html', controller: 'ReviewCtrl' })
      .otherwise({ redirectTo: '/login' });
  }]);

  /* ==================== ROUTE GUARD ==================== */
  app.run(['$rootScope', '$location', 'AuthService', function ($rootScope, $location, AuthService) {
    // Seed on first load
    seedData();

    var publicRoutes = ['/login'];

    $rootScope.$on('$routeChangeStart', function (event, next, current) {
      var path = next.$$route ? next.$$route.originalPath : '/login';
      var isPublic = publicRoutes.indexOf(path) !== -1;
      var isLoggedIn = !!AuthService.getCurrentUser();

      if (!isPublic && !isLoggedIn) {
        event.preventDefault();
        $location.path('/login');
      }
      if (path === '/login' && isLoggedIn) {
        event.preventDefault();
        $location.path('/home');
      }
    });
  }]);

  /* ==================== AUTH SERVICE ==================== */
  app.service('AuthService', ['$rootScope', function ($rootScope) {
    var KEY_USERS   = 'sh_users';
    var KEY_SESSION = 'sh_session';

    function getUsers() {
      return JSON.parse(localStorage.getItem(KEY_USERS) || '[]');
    }
    function saveUsers(users) {
      localStorage.setItem(KEY_USERS, JSON.stringify(users));
    }

    this.register = function (userData) {
      var users = getUsers();
      var exists = users.some(function (u) { return u.email === userData.email; });
      if (exists) return { success: false, error: 'Email already registered.' };
      users.push(userData);
      saveUsers(users);
      return { success: true };
    };

    this.login = function (email, password) {
      var users = getUsers();
      var user = users.find(function (u) { return u.email === email && u.password === password; });
      if (!user) return { success: false, error: 'Invalid email or password.' };
      localStorage.setItem(KEY_SESSION, JSON.stringify(user));
      $rootScope.currentUser = user;
      return { success: true, user: user };
    };

    this.getCurrentUser = function () {
      var raw = localStorage.getItem(KEY_SESSION);
      return raw ? JSON.parse(raw) : null;
    };

    this.updateUser = function (data) {
      var users = getUsers();
      var idx = users.findIndex(function (u) { return u.email === data.email; });
      if (idx !== -1) {
        users[idx] = angular.extend(users[idx], data);
        saveUsers(users);
        localStorage.setItem(KEY_SESSION, JSON.stringify(users[idx]));
        $rootScope.currentUser = users[idx];
      }
    };

    this.logout = function () {
      localStorage.removeItem(KEY_SESSION);
      $rootScope.currentUser = null;
    };
  }]);

  /* ==================== BOOKING SERVICE ==================== */
  app.service('BookingService', [function () {
    var KEY = 'sh_bookings';

    function all() {
      return JSON.parse(localStorage.getItem(KEY) || '[]');
    }
    function save(bookings) {
      localStorage.setItem(KEY, JSON.stringify(bookings));
    }

    this.addBooking = function (booking) {
      var bookings = all();
      booking.id = 'bk_' + Date.now();
      booking.createdAt = new Date().toISOString();
      booking.review = null;
      bookings.push(booking);
      save(bookings);
      return booking;
    };

    this.getUserBookings = function (email) {
      return all().filter(function (b) { return b.userEmail === email; })
                  .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });
    };

    this.cancelBooking = function (id) {
      var bookings = all();
      var b = bookings.find(function (b) { return b.id === id; });
      if (b) { b.status = 'Cancelled'; save(bookings); }
    };

    this.addReview = function (bookingId, rating, text) {
      var bookings = all();
      var b = bookings.find(function (b) { return b.id === bookingId; });
      if (b) {
        b.review = { rating: rating, text: text, date: new Date().toISOString() };
        save(bookings);
      }
    };

    this.getUserReviews = function (email) {
      return all().filter(function (b) {
        return b.userEmail === email && b.status === 'Completed' && b.review;
      });
    };

    this.getStats = function (email) {
      var userBookings = all().filter(function (b) { return b.userEmail === email; });
      var completed = userBookings.filter(function (b) { return b.status === 'Completed'; });
      var pending   = userBookings.filter(function (b) { return b.status === 'Pending'; });
      var reviews   = completed.filter(function (b) { return b.review; });
      var avgRating = 0;
      if (reviews.length > 0) {
        avgRating = reviews.reduce(function (sum, b) { return sum + b.review.rating; }, 0) / reviews.length;
      }
      return {
        total: userBookings.length,
        pending: pending.length,
        completed: completed.length,
        avgRating: avgRating
      };
    };
  }]);

  /* ==================== APP CONTROLLER ==================== */
  app.controller('AppCtrl', ['$scope', '$rootScope', '$location', 'AuthService',
    function ($scope, $rootScope, $location, AuthService) {
      $rootScope.currentUser = AuthService.getCurrentUser();

      $scope.isLoggedIn = function () {
        return !!$rootScope.currentUser;
      };

      $scope.isActive = function (path) {
        return $location.path() === path;
      };

      $scope.logout = function () {
        AuthService.logout();
        $location.path('/login');
      };

      // Keep currentUser in scope in sync
      $scope.$watch(function () { return $rootScope.currentUser; }, function (val) {
        $scope.currentUser = val;
      });
    }
  ]);

  /* ==================== AUTH CONTROLLER ==================== */
  app.controller('AuthCtrl', ['$scope', '$location', 'AuthService',
    function ($scope, $location, AuthService) {
      $scope.tab = 'login';
      $scope.loginData    = {};
      $scope.registerData = {};
      $scope.loginErrors  = {};
      $scope.regErrors    = {};

      $scope.login = function () {
        $scope.loginErrors = {};
        var d = $scope.loginData;
        var valid = true;
        if (!d.email)    { $scope.loginErrors.email    = 'Email is required.';    valid = false; }
        if (!d.password) { $scope.loginErrors.password = 'Password is required.'; valid = false; }
        if (!valid) return;

        var result = AuthService.login(d.email, d.password);
        if (result.success) {
          $location.path('/home');
        } else {
          $scope.loginErrors.general = result.error;
        }
      };

      $scope.register = function () {
        $scope.regErrors = {};
        var d = $scope.registerData;
        var valid = true;
        if (!d.name)     { $scope.regErrors.name     = 'Name is required.';           valid = false; }
        if (!d.email)    { $scope.regErrors.email    = 'Email is required.';           valid = false; }
        if (!d.password) { $scope.regErrors.password = 'Password is required.';       valid = false; }
        if (d.password && d.password.length < 6) {
          $scope.regErrors.password = 'Password must be at least 6 characters.'; valid = false;
        }
        if (!valid) return;

        var result = AuthService.register({
          name: d.name, email: d.email, password: d.password, phone: '', address: ''
        });
        if (result.success) {
          AuthService.login(d.email, d.password);
          $location.path('/home');
        } else {
          $scope.regErrors.general = result.error;
        }
      };
    }
  ]);

  /* ==================== HOME CONTROLLER ==================== */
  app.controller('HomeCtrl', ['$scope', '$rootScope', '$location', 'AuthService', 'BookingService',
    function ($scope, $rootScope, $location, AuthService, BookingService) {
      var user = AuthService.getCurrentUser();
      var rawStats = BookingService.getStats(user.email);
      $scope.stats = angular.extend({ userName: user.name }, rawStats);
      $scope.categories = CATEGORIES;

      var all = BookingService.getUserBookings(user.email);
      $scope.recentBookings = all.slice(0, 3);

      $scope.goToBooking = function (cat) {
        $rootScope.selectedCategory = cat;
        $location.path('/booking');
      };
    }
  ]);

  /* ==================== BOOKING CONTROLLER ==================== */
  app.controller('BookingCtrl', ['$scope', '$rootScope', '$location', 'AuthService', 'BookingService',
    function ($scope, $rootScope, $location, AuthService, BookingService) {
      $scope.step       = 1;
      $scope.categories = CATEGORIES;
      $scope.selectedCategory = $rootScope.selectedCategory || null;
      $scope.selectedService  = null;
      $scope.booking    = { date: '', time: '', address: '', notes: '' };
      $scope.bookingErrors = {};

      // Pre-populate address from user profile
      var user = AuthService.getCurrentUser();
      if (user && user.address) { $scope.booking.address = user.address; }

      // Today's date min for date picker
      var today = new Date();
      $scope.todayDate = today.toISOString().split('T')[0];

      // If came from home with pre-selected category, jump to step 2
      if ($scope.selectedCategory) { $scope.step = 2; }

      $scope.selectCategory = function (cat) {
        $scope.selectedCategory = cat;
        $scope.selectedService  = null;
      };

      $scope.nextStep = function () {
        if ($scope.step === 1 && !$scope.selectedCategory) return;
        if ($scope.step === 2 && !$scope.selectedService)  return;
        $scope.step++;
      };

      $scope.prevStep = function () {
        if ($scope.step > 1) {
          $scope.step--;
          if ($scope.step === 1) $scope.selectedService = null;
        }
      };

      $scope.submitBooking = function () {
        $scope.bookingErrors = {};
        var valid = true;
        if (!$scope.booking.date)    { $scope.bookingErrors.date    = 'Please select a date.';      valid = false; }
        if (!$scope.booking.time)    { $scope.bookingErrors.time    = 'Please select a time slot.'; valid = false; }
        if (!$scope.booking.address) { $scope.bookingErrors.address = 'Address is required.';       valid = false; }
        if (!valid) return;

        BookingService.addBooking({
          userEmail:    user.email,
          categoryName: $scope.selectedCategory.name,
          categoryIcon: $scope.selectedCategory.icon,
          serviceName:  $scope.selectedService.name,
          price:        $scope.selectedService.price,
          date:         $scope.booking.date,
          time:         $scope.booking.time,
          address:      $scope.booking.address,
          notes:        $scope.booking.notes,
          status:       'Pending'
        });

        $rootScope.selectedCategory = null;
        $location.path('/history');
      };
    }
  ]);

  /* ==================== HISTORY CONTROLLER ==================== */
  app.controller('HistoryCtrl', ['$scope', '$rootScope', '$location', 'AuthService', 'BookingService',
    function ($scope, $rootScope, $location, AuthService, BookingService) {
      var user = AuthService.getCurrentUser();
      $scope.filters = ['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'];
      $scope.filterStatus = $rootScope.historyFilter || 'All';
      $scope.bookings = BookingService.getUserBookings(user.email);

      $scope.filtered = function () {
        if ($scope.filterStatus === 'All') return $scope.bookings;
        return $scope.bookings.filter(function (b) { return b.status === $scope.filterStatus; });
      };

      $scope.cancel = function (id) {
        BookingService.cancelBooking(id);
        $scope.bookings = BookingService.getUserBookings(user.email);
      };

      $scope.goToReview = function (id) {
        $rootScope.reviewBookingId = id;
        $location.path('/reviews');
      };
    }
  ]);

  /* ==================== PROFILE CONTROLLER ==================== */
  app.controller('ProfileCtrl', ['$scope', 'AuthService', 'BookingService',
    function ($scope, AuthService, BookingService) {
      var user = AuthService.getCurrentUser();
      $scope.profileData = angular.copy(user);
      $scope.saved = false;

      var stats = BookingService.getStats(user.email);
      $scope.profileStats = stats;

      $scope.save = function () {
        AuthService.updateUser($scope.profileData);
        $scope.saved = true;
        setTimeout(function () {
          $scope.$apply(function () { $scope.saved = false; });
        }, 2500);
      };
    }
  ]);

  /* ==================== REVIEW CONTROLLER ==================== */
  app.controller('ReviewCtrl', ['$scope', '$rootScope', 'AuthService', 'BookingService',
    function ($scope, $rootScope, AuthService, BookingService) {
      var user = AuthService.getCurrentUser();

      $scope.ratingLabels  = ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent'];
      $scope.rating        = 0;
      $scope.hoverRating   = 0;
      $scope.reviewText    = '';
      $scope.reviewError   = '';
      $scope.reviewSubmitted = false;

      // Load completed bookings without a review
      function loadCompleted() {
        var all = BookingService.getUserBookings(user.email);
        $scope.completedBookings = all.filter(function (b) {
          return b.status === 'Completed' && !b.review;
        });
      }
      loadCompleted();

      // Pre-select booking from history redirect
      if ($rootScope.reviewBookingId) {
        $scope.selectedBooking = $scope.completedBookings.find(function (b) {
          return b.id === $rootScope.reviewBookingId;
        }) || null;
        $rootScope.reviewBookingId = null;
      }

      $scope.pastReviews = BookingService.getUserReviews(user.email);

      $scope.hover = function (n)  { $scope.hoverRating = n; };
      $scope.setRating = function (n) { $scope.rating = n; };

      $scope.submitReview = function () {
        $scope.reviewError = '';
        if (!$scope.rating) { $scope.reviewError = 'Please select a star rating.'; return; }
        if (!$scope.selectedBooking) { $scope.reviewError = 'Please select a booking.'; return; }

        BookingService.addReview($scope.selectedBooking.id, $scope.rating, $scope.reviewText);
        $scope.reviewSubmitted = true;
        $scope.rating      = 0;
        $scope.reviewText  = '';

        loadCompleted();
        $scope.selectedBooking = null;
        $scope.pastReviews = BookingService.getUserReviews(user.email);

        setTimeout(function () {
          $scope.$apply(function () { $scope.reviewSubmitted = false; });
        }, 2500);
      };
    }
  ]);

})();
