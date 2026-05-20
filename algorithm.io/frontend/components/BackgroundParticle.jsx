import React, { useEffect, useState, useCallback } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; 


import SLL from "../icons/SLL.png";
import Vector from "../icons/Vector.png";

const BackgroundParticles = () => {
    const [init, setInit] = useState(false);

    // Inicializa o motor de partículas uma única vez
    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadSlim(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
    };

    const options = {
        // cap frame-rate to a common display refresh (helps reduce tearing)
        fpsLimit: 60,
        particles: {
            number: {
                value: 40,
            },
            rotate: {
                // full range of rotation
                value: { min: 0, max: 360 },
                direction: "random",
                animation: {
                    enable: true,
                    // explicit numeric speed (using an object here caused unstable interpolation)
                    speed: 4,
                    sync: false,
                },
            },
            shape: {
                type: "image",
                options: {
                    image: [
                        {
                            src: SLL,
                            // use reasonable intrinsic sizes so downscaling preserves stroke thickness
                            width: 4096,
                            height: 4096,
                        },
                        {
                            src: Vector,
                            width: 4096,
                            height: 4096,
                        },
                    ],
                },
            },
            opacity: {
                value: 0.9,
            },
            size: {
                // increase particle render size so strokes look thicker and more legible
                value: { min: 28, max: 34 },
            },
            move: {
                enable: true,
                // modest speed with randomness for smooth motion
                speed: 1.2,
                direction: "none",
                random: true,
                straight: false,
                outModes: {
                    default: "out",
                },
            },
        },
        // enable retina detection so images render crisply on high-DPI displays
        detectRetina: true,
    };

    if (init) {
        return (
                        <Particles
                                id="tsparticles"
                                particlesLoaded={particlesLoaded}
                                options={options}
                                style={{
                                    position: 'absolute',
                                    width: '100%',
                                    height: '100%',
                                    zIndex: -1,
                                    top: 0,
                                    left: 0,
                                    pointerEvents: 'none',
                                }}
                        />
        );
    }

    return null;
};

export default BackgroundParticles;