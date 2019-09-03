var w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
var h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
var w1 = window.screen.width * window.devicePixelRatio;
var h1 = window.screen.height * window.devicePixelRatio;
var logohd = "";
var ov = "https://www.mp4upload.com/bd1.html";
var player = videojs("vid", {}, function() {
    player.src("https://www9.mp4upload.com:282/d/rsx7lpa5z3b4quuorcwbcnk2jnvsrdhx3ic6rjhe6lstrrl4kv4ti2m7/video.mp4");
    player.poster("https://www9.mp4upload.com/i/01156/kgzjxy28p7g8.jpg")
});
if (1280 > 1279 || 720 > 719) {
    var logohd = "https://www.mp4upload.com/player/J6/hdblue.png"
}
if ((w1 && w) > 600 && (h1 && h) > 250) {
    ov = "https://www.mp4upload.com/bd3.html"
}
player.nuevo({
    timetooltip: false,
    zoomMenu: false,
    rateMenu: true,
    logo: logohd,
    logoposition: "RT",
    video_id: "kgzjxy28p7g8",
    resume: true,
    shareUrl: "https://www.mp4upload.com/kgzjxy28p7g8",
    shareTitle: "",
    shareEmbed: '<IFRAME SRC="https://www.mp4upload.com/embed-kgzjxy28p7g8.html" FRAMEBORDER=0 MARGINWIDTH=0 MARGINHEIGHT=0 SCROLLING=NO WIDTH=1280 HEIGHT=720 allowfullscreen></IFRAME>',
    overlay: ov
});
var Button = videojs.getComponent("Button");
var MyButton = videojs.extend(Button, {
    constructor: function() {
        Button.apply(this, arguments);
        this.addClass("icon-download");
        this.controlText("Download")
    },
    handleClick: function() {
        window.open("https://www.mp4upload.com/kgzjxy28p7g8", "_blank")
    }
});
videojs.registerComponent("MyButton", MyButton);
player.getChild("controlBar").addChild("myButton", {}, 12);
player.hotkeys({
    volumeStep: 0.1,
    seekStep: 5,
    alwaysCaptureHotkeys: true
});
var cachebuster = Math.round(new Date().getTime() / 1000);
var options = {
    id: "vid",
    adTagUrl: "",
    adsCancelTimeout: 5000
};
player.ima(options);
if ((navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i)) && player.hasAttribute("controls")) {
    player.removeAttribute("controls")
}
var startEvent = "click";
if (navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/Android/i)) {
    startEvent = "touchend"
}
player.one(startEvent, function() {
    player.ima.initializeAdDisplayContainer()
});