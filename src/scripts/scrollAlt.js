const prefersMotion = window.matchMedia('(prefers-reduced-motion: no-preference)');
const supportsView = CSS.supports('animation-timeline', 'view()');

if (prefersMotion.matches && !supportsView) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            console.log("change")
            if (entry.isIntersecting) {
                entry.target.classList.remove('hide');
            } else {
                entry.target.classList.add('hide')
            }
        })
    }, {
        threshold: 0,
        rootMargin: "-300px 0px -300px 0px"
    })

    document.querySelectorAll('section, header').forEach(section => {
        observer.observe(section);
    })
}
document.querySelector('header').classList.remove('hide')