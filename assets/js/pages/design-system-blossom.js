(function () {
    if (!window.BlossomCore) {
        return;
    }

    window.BlossomCore.initPage({
        navLoadSelector: ".nav-load",
        heroTitleSelector: "#hero-title",
        sectionSelector: ".bloom-section",
        extraRevealSelector: "#hero-title, .animate-on-scroll",
        animateSelector: ".animate-on-scroll",
    });
})();
