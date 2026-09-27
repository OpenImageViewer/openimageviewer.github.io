import { updateDate } from './date.js';

document.addEventListener("DOMContentLoaded", async function (event) {

    updateDate();
    let currentPageId = '';
    const MapPages =
    {
        'home': 'home-body.html'
    ,   'about': 'about-body.html'
    ,   'word': 'word-body.html'
    ,   'features': 'features-body.html'
    }

    // The URL hash is the single source of truth for navigation: '' = home, '#word' = word page, ...
    // Page links are plain <a href="#..."> anchors, so back/forward buttons and deep links work natively.
    function PageIdFromHash()
    {
        const id = window.location.hash.substring(1);
        return MapPages[id] ? id : 'home'; // unknown hash falls back to home
    }

    async function LoadPage(id)
    {
        if (id == currentPageId)
            return; // Don't process request if on the same page.

        const content = await fetch(MapPages[id]);

        gtag('event', 'page_view', {
            page_path: '/' + id
            , send_to: 'UA-132326144-1'
        });

        document.getElementById("hero-body").innerHTML = await content.text();
        currentPageId = id;
        window.scrollTo(0, 0);
    }

    window.addEventListener('hashchange', function () {
        LoadPage(PageIdFromHash());
    });

    // The following code is based off a toggle menu by @Bradcomp
    // source: https://gist.github.com/Bradcomp/a9ef2ef322a8e8017443b626208999c1
    const burger = document.querySelector('.navbar-burger');
    const menu = document.querySelector('#' + burger.dataset.target);

    function HideMenu() {
        burger.classList.remove('is-active');
        menu.classList.remove('is-active');
        burger.setAttribute('aria-expanded', 'false');
    }

    burger.addEventListener('click', function () {
        const open = burger.classList.toggle('is-active');
        menu.classList.toggle('is-active');
        burger.setAttribute('aria-expanded', open); // keep screen readers in sync
    });

    // Hide menu if click anywhere on the navigation bar.
    menu.addEventListener('click', HideMenu);

    await LoadPage(PageIdFromHash()); // deep link (/#word) or home
});
