angular.module("starter", ["ionic", "starter.controllers"]).run(function (t) {
    t.ready(function () {
        window.cordova && window.cordova.plugins.Keyboard && cordova.plugins.Keyboard.hideKeyboardAccessoryBar(!0), window.StatusBar && StatusBar.styleDefault()
    })
}).config(function (t, e) {
    t.state("app", {url: "/app", "abstract": !0, templateUrl: "templates/menu.html", controller: "AppCtrl"}).state("app.search", {url: "/search", views: {menuContent: {templateUrl: "templates/search.html"}}}).state("app.browse", {url: "/browse", views: {menuContent: {templateUrl: "templates/browse.html"}}}).state("app.playlists", {url: "/playlists", views: {menuContent: {templateUrl: "templates/playlists.html", controller: "PlaylistsCtrl"}}}).state("app.single", {url: "/playlists/:playlistId", views: {menuContent: {templateUrl: "templates/playlist.html", controller: "PlaylistCtrl"}}}), e.otherwise("/app/playlists")
});
angular.module("starter.controllers", []).controller("AppCtrl", function (l, o, t) {
    l.loginData = {}, o.fromTemplateUrl("templates/login.html", {scope: l}).then(function (o) {
        l.modal = o
    }), l.closeLogin = function () {
        l.modal.hide()
    }, l.login = function () {
        l.modal.show()
    }, l.doLogin = function () {
        console.log("Doing login", l.loginData), t(function () {
            l.closeLogin()
        }, 1e3)
    }
}).controller("PlaylistsCtrl", function (l) {
    l.playlists = [
        {title: "Reggae", id: 1},
        {title: "Rock nacional", id: 2},
        {title: "Dubstep", id: 3},
        {title: "Indie", id: 4},
        {title: "Rap", id: 5},
        {title: "Cowbell", id: 6}
    ]
}).controller("PlaylistCtrl", function () {
});