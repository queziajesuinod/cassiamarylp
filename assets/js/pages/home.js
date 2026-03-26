(function () {
    if (!window.BlossomCore) {
        return;
    }

    window.BlossomCore.initPage({
        heroTitleSelector: "#hero-title",
        sectionSelector: ".bloom-section",
    });

    window.BlossomCore.initPageAtmosphere({
        shellSelector: ".page-shell",
    });
})();
