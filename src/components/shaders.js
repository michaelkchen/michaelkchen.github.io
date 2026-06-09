import { createShader } from 'shaders/js'
import { animate } from 'motion'
const canvas = document.getElementById('background');
const header = document.querySelector('header');
const software = document.getElementById('software-section');
const art = document.getElementById('art-section');
const style = window.getComputedStyle(document.documentElement);

const defaultColor = `${style.getPropertyValue('--resume-color').trim()}`
const softwareColor = `${style.getPropertyValue('--swe-color').trim()}`
const artColor = `${style.getPropertyValue('--art-color').trim()}`

const NUM_LIGHTS = 6;

var plasma = true;
var light = true;
var ripples = true;

var rippleAnimation = null;

var color = defaultColor;

var components = [{
    type: 'RadialGradient',
    id: 'bg',
    props: {
        visible: false,
        colorA: color,
        colorB: `rgb(1, 1, 1)`,
        repeat: 0.8,
        opacity: 0.8,
    }, 
}]
components.push({
    type: 'Plasma',
    id: 'plasma',
    props: {
        visible: true,
        colorA: color,
        colorB: 'rgb(1, 1, 1)',
        density: 1,
        warp: 0.4,
    }, 
})
components.push({
    type: 'CursorRipples',
    id: 'ripples',
    props: {
        visible: false,
        decay: 7.5,
        intensity: 20,
    }
})
for (var i = 0; i < NUM_LIGHTS; i++) {
    components.push({
        type: 'Circle',
        id: 'circle' + i,
        props: {
            blendMode: 'overlay',
            radius: 0.25,
            softness: 0.2,
            visible: true,
            center: {
                type: 'mouse-position'
            }
        },
    })
}


const shader = await createShader(canvas, {
    colorSpace: 'srgb',
    components: components
})

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            if (entry.target.nodeName === 'HEADER') {
                crossColor(defaultColor)
            } else if (entry.target.id === 'software-section') {
                crossColor(softwareColor)
            } else if (entry.target.id === 'art-section') {
                crossColor(artColor)
            }
        }
    })
}, {
    threshold: 0,
    rootMargin: "-300px 0px -300px 0px"
})
observer.observe(header)
observer.observe(software)
observer.observe(art)

addEventListener('mousedown', (e) => {
    if (ripples) {
        if (rippleAnimation != null && rippleAnimation.state === 'running') {
            rippleAnimation.stop();
        }
        shader.update('ripples', {decay: 7.5, visible: true})
    }
})
addEventListener('mouseup', (e) => {
    rippleAnimation = animate(7.5, 100, {
        duration: 1,
        ease: 'easeOut',
        onUpdate: (latest) => {
            if (ripples)
                shader.update('ripples', {decay: latest})
        },
        onComplete: () => {
            shader.update('ripples', {visible: false})
        }
    })
})

window.addEventListener('resize', () => {
    const dpr = window.devicePixelRatio;
    canvas.style.width = `calc(${window.innerWidth}px + 100vw - 100%)`;
    canvas.style.height = `${window.innerHeight}px`;
    canvas.width = Math.round(window.innerWidth * dpr);
    canvas.height = Math.round(window.innerHeight * dpr);
})

const plasmaButton = document.getElementById('plasma');
plasmaButton.addEventListener('click', () => {
    plasma = !plasma;
    shader.update('plasma', {visible: plasma});
    shader.update('bg', {visible: !plasma});
    plasmaButton.classList.toggle('disabled');
})

const lightButton = document.getElementById('light');
lightButton.addEventListener('click', () => {
    light = !light;
    for (var i = 0; i < NUM_LIGHTS; i++) {
        shader.update(`circle${i}`, {opacity: light ? 1 : 0});
    }
    lightButton.classList.toggle('disabled');
}) 

const ripplesButton = document.getElementById('ripples');
ripplesButton.addEventListener('click', () => {
    ripples = !ripples;
    shader.update('ripples', {visible: ripples});
    ripplesButton.classList.toggle('disabled');
})

async function crossColor(newColor) {
    await animate(color, newColor, {
        duration: 0.5,
        ease: 'easeInOut',
        onUpdate: (latest) => {
            const rgb = latest.match(/\d+/g);
            var red = Number(rgb[0]);
            var green = Number(rgb[1]);
            var blue = Number(rgb[2]);
            color = `rgb(${red}, ${green}, ${blue})`
            shader.update('plasma', {colorA: color})
            shader.update('bg', {colorA: color})
        }
    })
}