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
    "org.apache.cordova.device": "0.2.11"
}
// BOTTOM OF METADATA
});