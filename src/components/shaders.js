import { createShader } from 'shaders/js'
import { animate } from 'motion'
const canvas = document.getElementById('background');
const header = document.querySelector('header');
const software = document.getElementById('software-section');
const art = document.getElementById('art-section');

const defaultColor = 'rgb(31, 8, 48)'
const softwareColor = 'rgb(8, 27, 48)'
const artColor = 'rgb(17, 8, 48)'
var color = defaultColor;

var components = [{
    type: 'Swirl',
    id: 'liquid',
    props: {
        colorA: 'rgb(1, 1, 1)',
        colorB: color,
        blend: 50,
        detail: 1,
        speed: 0.5,
    }, 
}]
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
        
        // {
        //     type: 'Glow',
        //     id: 'glow',
        //     props: {
        //         intensity: 1000,
        //         threshold: 0,
        //         maskSource: 'circle'
        //     },
        // }
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

async function crossColor(newColor) {
    await animate(color, newColor, {
        duration: 0.5,
        ease: 'easeInOut',
        onUpdate: (latest) => {
            const rgb = latest.match(/\d+/g);
            color = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
            shader.update('liquid', {colorB: color})
        }
    })
}