cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/com.badrit.BackgroundJS/www/BackgroundJS.js",
        "id": "com.badrit.BackgroundJS.BackgroundJS",
        "clobbers": [
            "navigator.BackgroundJS"
        ]
    },
    {
        "file": "plugins/com.ionic.keyboard/www/keyboard.js",
        "id": "com.ionic.keyboard.keyboard",
        "clobbers": [
            "cordova.plugins.Keyboard"
        ]
    },
    {
        "file": "plugins/com.ququplay.websocket.WebSocket/www/phonegap-websocket.js",
        "id": "com.ququplay.websocket.WebSocket.websocket",
        "clobbers": [
            "WebSocket"
        ]
    },
    {
        "file": "plugins/de.appplant.cordova.plugin.local-notification/www/local-notification.js",
        "id": "de.appplant.cordova.plugin.local-notification.LocalNotification",
        "clobbers": [
            "plugin.notification.local"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.inappbrowser/www/inappbrowser.js",
        "id": "org.apache.cordova.inappbrowser.inappbrowser",
        "clobbers": [
            "window.open"
        ]
    },
    {
        "file": "plugins/org.apache.cordova.device/www/device.js",
        "id": "org.apache.cordova.device.device",
        "clobbers": [
            "device"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "com.badrit.BackgroundJS": "0.1.0",
    "com.ionic.keyboard": "1.0.3",
    "com.ququplay.websocket.WebSocket": "0.1.0",
    "org.apache.cordova.console": "0.2.10",
    "de.appplant.cordova.plugin.local-notification": "0.7.4",
    "org.apache.cordova.inappbrowser": "0.5.1",
    "org.apache.cordova.device": "0.2.11"
}
// BOTTOM OF METADATA
});