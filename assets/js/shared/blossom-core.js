(function () {
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function createUniqueNodeList(selectors) {
        const seen = new Set();
        const nodes = [];

        selectors
            .filter(Boolean)
            .forEach((selector) => {
                document.querySelectorAll(selector).forEach((node) => {
                    if (!seen.has(node)) {
                        seen.add(node);
                        nodes.push(node);
                    }
                });
            });

        return nodes;
    }

    function activateReveal(node) {
        node.classList.add("active");

        if (node.matches(".animate-on-scroll")) {
            node.classList.add("animate");
        }

        if (node.classList.contains("text-reveal-content")) {
            const parent = node.closest("#hero-title, .reveal, .reveal-up, .reveal-zoom, h1, h2, h3");

            if (parent) {
                parent.classList.add("reveal-active");
            }
        }

        if (node.querySelector(".text-reveal-content")) {
            node.classList.add("reveal-active");
        }
    }

    function initReveal(options) {
        const revealSelectors = [
            ".reveal",
            ".reveal-up",
            ".reveal-zoom",
            options.extraRevealSelector,
            options.animateSelector,
        ];

        const targets = createUniqueNodeList(revealSelectors);

        if (!targets.length) {
            return;
        }

        if (reduceMotionQuery.matches) {
            targets.forEach(activateReveal);
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) {
                        return;
                    }

                    activateReveal(entry.target);
                    observer.unobserve(entry.target);
                });
            },
            {
                root: null,
                rootMargin: "0px 0px -10% 0px",
                threshold: 0.16,
            }
        );

        targets.forEach((target) => observer.observe(target));
    }

    function initSectionObserver(selector) {
        const sections = document.querySelectorAll(selector);

        if (!sections.length) {
            return;
        }

        if (reduceMotionQuery.matches) {
            sections.forEach((section) => section.classList.add("section-in-view"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    entry.target.classList.toggle("section-in-view", entry.isIntersecting);
                });
            },
            {
                root: null,
                threshold: 0.2,
                rootMargin: "-10% 0px -10% 0px",
            }
        );

        sections.forEach((section) => observer.observe(section));
    }

    function initNavLoad(selector) {
        if (!selector) {
            return;
        }

        const nav = document.querySelector(selector);

        if (!nav) {
            return;
        }

        requestAnimationFrame(() => {
            window.setTimeout(() => {
                nav.classList.add("loaded");
            }, 60);
        });
    }

    function initHeroReveal(selector) {
        if (!selector) {
            return;
        }

        const hero = document.querySelector(selector);

        if (!hero) {
            return;
        }

        if (reduceMotionQuery.matches) {
            hero.classList.add("active", "reveal-active");
            return;
        }

        window.setTimeout(() => {
            hero.classList.add("active", "reveal-active");
        }, 140);
    }

    function initMagnetic(selector) {
        document.querySelectorAll(selector).forEach((node) => {
            if (node.dataset.magneticReady === "true") {
                return;
            }

            node.dataset.magneticReady = "true";

            if (reduceMotionQuery.matches) {
                return;
            }

            node.addEventListener("pointermove", (event) => {
                const rect = node.getBoundingClientRect();
                const x = ((event.clientX - rect.left) / rect.width - 0.5) * 10;
                const y = ((event.clientY - rect.top) / rect.height - 0.5) * 8;

                node.style.transform = "translate3d(" + x.toFixed(2) + "px, " + y.toFixed(2) + "px, 0)";
            });

            node.addEventListener("pointerleave", () => {
                node.style.transform = "";
            });
        });
    }

    function initTilt(selector) {
        document.querySelectorAll(selector).forEach((node) => {
            if (node.dataset.tiltReady === "true") {
                return;
            }

            node.dataset.tiltReady = "true";

            if (reduceMotionQuery.matches) {
                return;
            }

            node.addEventListener("pointermove", (event) => {
                const rect = node.getBoundingClientRect();
                const px = (event.clientX - rect.left) / rect.width;
                const py = (event.clientY - rect.top) / rect.height;
                const rotateY = (px - 0.5) * 8;
                const rotateX = (0.5 - py) * 8;

                node.style.transform =
                    "perspective(1000px) rotateX(" +
                    rotateX.toFixed(2) +
                    "deg) rotateY(" +
                    rotateY.toFixed(2) +
                    "deg) translate3d(0, -2px, 0)";
            });

            node.addEventListener("pointerleave", () => {
                node.style.transform = "";
            });
        });
    }

    function getHeaderOffset(selector) {
        const header = document.querySelector(selector);

        return header ? header.getBoundingClientRect().height + 12 : 12;
    }

    function initSmoothAnchors(headerSelector) {
        document.addEventListener("click", (event) => {
            const anchor = event.target.closest("a[href^='#']");

            if (!anchor) {
                return;
            }

            const href = anchor.getAttribute("href");

            if (!href || href === "#") {
                return;
            }

            const target = document.querySelector(href);

            if (!target) {
                return;
            }

            event.preventDefault();

            const offsetTop = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset(headerSelector);

            window.scrollTo({
                top: Math.max(offsetTop, 0),
                behavior: reduceMotionQuery.matches ? "auto" : "smooth",
            });

            if (window.history && window.history.pushState) {
                window.history.pushState(null, "", href);
            }
        });
    }

    function initPageAtmosphere(options) {
        const shell = document.querySelector(options.shellSelector || ".page-shell");

        if (!shell) {
            return;
        }

        const updateScroll = () => {
            const scrollY = window.scrollY || window.pageYOffset || 0;
            const shift = clamp(scrollY * 0.28, 0, 180);
            const drift = Math.sin(scrollY * 0.008) * 18;

            shell.style.setProperty("--flow-shift", shift.toFixed(2) + "px");
            shell.style.setProperty("--flow-drift", drift.toFixed(2) + "px");
        };

        updateScroll();
        window.addEventListener("scroll", updateScroll, { passive: true });

        if (reduceMotionQuery.matches) {
            shell.style.setProperty("--pointer-x", "0px");
            shell.style.setProperty("--pointer-y", "0px");
            return;
        }

        const handlePointerMove = (event) => {
            const x = ((event.clientX / window.innerWidth) - 0.5) * 44;
            const y = ((event.clientY / window.innerHeight) - 0.5) * 36;

            shell.style.setProperty("--pointer-x", x.toFixed(2) + "px");
            shell.style.setProperty("--pointer-y", y.toFixed(2) + "px");
        };

        const resetPointer = () => {
            shell.style.setProperty("--pointer-x", "0px");
            shell.style.setProperty("--pointer-y", "0px");
        };

        window.addEventListener("pointermove", handlePointerMove, { passive: true });
        window.addEventListener("pointerleave", resetPointer);
    }

    function updateFlashlight(event, element) {
        if (!event || !element) {
            return;
        }

        const rect = element.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;

        element.style.setProperty("--mouse-x", mouseX.toFixed(2) + "px");
        element.style.setProperty("--mouse-y", mouseY.toFixed(2) + "px");
    }

    function initPage(options) {
        const settings = Object.assign(
            {
                extraRevealSelector: "",
                animateSelector: ".animate-on-scroll",
                magneticSelector: "[data-magnetic]",
                tiltSelector: "[data-tilt]",
                navLoadSelector: "",
                heroTitleSelector: "",
                sectionSelector: ".bloom-section",
                headerSelector: "header.sticky, .sticky.top-0",
            },
            options || {}
        );

        initReveal(settings);
        initSectionObserver(settings.sectionSelector);
        initNavLoad(settings.navLoadSelector);
        initHeroReveal(settings.heroTitleSelector);
        initMagnetic(settings.magneticSelector);
        initTilt(settings.tiltSelector);
        initSmoothAnchors(settings.headerSelector);
    }

    window.updateFlashlight = updateFlashlight;
    window.BlossomCore = {
        initPage: initPage,
        initPageAtmosphere: initPageAtmosphere,
        updateFlashlight: updateFlashlight,
    };
})();
