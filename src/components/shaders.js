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

console.log(defaultColor)

// const defaultColor = 'rgb(82, 61, 97)' //'rgb(31, 8, 48)'
// const softwareColor = 'rgb(8, 27, 48)'
// const artColor = 'rgb(17, 8, 48)'
var color = defaultColor;

var components = [{
    type: 'Plasma',
    id: 'liquid',
    props: {
        colorA: color,
        colorB: 'rgb(1, 1, 1)',
        density: 1,
        warp: 0.4,
    }, 
}]
components.push({
    type: 'CursorRipples',
    id: 'ripples',
    props: {
        visible: true,
        decay: 7.5,
        intensity: 20,
    }
})
for (var i = 0; i < 6; i++) {
    components.push({
        type: 'Circle',
        id: 'circle' + i,
        props: {
            blendMode: 'overlay',
            radius: 0.25,
            softness: 0.2,
            visible: true,
            // maskType: 'alphaInverted',
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
    shader.update('ripples', {visible: true})
})
addEventListener('mouseup', (e) => {
    shader.update('ripples', {visible: false})
    // animate(7.5, 100, {
    //     duration: 1,
    //     ease: 'linear',
    //     onUpdate: (latest) => {
    //         shader.update('ripples', {decay: latest})
    //     }
    // })
})

async function crossColor(newColor) {
    await animate(color, newColor, {
        duration: 0.5,
        ease: 'easeInOut',
        onUpdate: (latest) => {
            const rgb = latest.match(/\d+/g);
            color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
            shader.update('liquid', {colorA: color})
        }
    })
}