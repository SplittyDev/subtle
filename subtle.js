(() => {

    // Subtle particle
    class Particle {
        constructor(state) {
            this.reinitialize(state);
        }

        // Initialize variables
        reinitialize(state) {

            // Opacity starts with 0
            this.a = 0;

            // Size starts with 0
            this.r = 0;

            // Random hue
            this.c = Math.random() * 360;

            // Random speed within [speed/2, speed]
            this.s = (state.conf.speed + (Math.random() * state.conf.speed)) / 2.0;

            // Random position
            const calculatePosition = () => {
                const getRandomIntInclusive = (min, max) => {
                    min = Math.ceil(min);
                    max = Math.floor(max);
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                };
                const pad = state.conf.contain ? state.conf.size : 0;
                this.x = getRandomIntInclusive(pad, state.width - pad * 2);
                this.y = getRandomIntInclusive(pad, state.height - pad * 2);
            };
            calculatePosition();

            // Random rotation in radians
            this.rad = Math.random() * Math.PI * 2;

            // Recalculate position while collisions with
            // exclusion target are detected.
            if (state.ex !== null) {
                const cBounds = state.canvas.getBoundingClientRect();
                const exBounds = state.ex.getBoundingClientRect();
                while (subtle_intersects(
                    cBounds.left + this.x - (state.conf.size),
                    cBounds.left + this.x + (state.conf.size * 2),
                    cBounds.top + this.y - (state.conf.size),
                    cBounds.top + this.y + (state.conf.size * 2),
                    exBounds.left,
                    exBounds.right,
                    exBounds.top,
                    exBounds.bottom
                )) calculatePosition();
            }
        }

        // Update particle
        update(state) {

            // Increase size by speed
            this.r += this.s;

            // Increase hue by 1
            this.c = (this.c + 1) % 360;

            // r <= 25%
            if (this.r < state.conf.size * 0.25) {
                this.a = (this.r / (state.conf.size * 0.25));
            }

            // r >= 25% && r <= 75%
            else if (this.r >= state.conf.size * 0.25 && this.r <= state.conf.size * 0.75) {
                this.a = 1;
            }

            // r >= 75% && r <= 100%
            else if (this.r >= state.conf.size * 0.75 && this.r <= state.conf.size) {
                this.a = (state.conf.size - this.r) / (state.conf.size * 0.25);
            }

            // r > 100%
            else {
                this.reinitialize(state);
            }
        }

        // Render particle
        render(state) {

            // Push state
            state.context.save();

            // Calculate lightness and saturation
            const lit = state.conf.lightness * 100.0;
            const sat = state.conf.saturation * 100.0;

            // Set stroke style
            state.context.strokeStyle = `hsla(${this.c},${sat}%,${lit}%,${this.a})`;

            // Begin path
            state.context.beginPath();

            // Switch on modes
            switch (state.conf.mode) {

                // Circle
                case Modes.circle: {

                    // Draw circle
                    state.context.arc(
                        this.x, // x
                        this.y, // y
                        this.r, // r
                        0, // sAngle
                        2 * Math.PI, // eAngle
                    );

                    break;
                }

                // Square
                case Modes.square: {

                    // Test if rotation is randomized
                    if (state.conf.randomizeRotation) {

                        // Calculate center
                        const cx = this.x + this.r / 2;
                        const cy = this.y + this.r / 2;

                        // Translate to center
                        state.context.translate(cx, cy);

                        // Rotate canvas
                        state.context.rotate(this.rad);
                    }

                    // Draw rectangle
                    state.context.rect(
                        state.conf.randomizeRotation ? 0 : this.x, // x
                        state.conf.randomizeRotation ? 0 : this.y, // y
                        this.r, // w
                        this.r // h
                    );
                
                    break;
                }
            }

            // Draw stroke
            state.context.stroke();

            // Pop state
            state.context.restore();
        }
    }

    // Setup
    function subtle_setup(state) {

        // Fitting function
        const subtle_fit = () => {
            const bounds = state.el.getBoundingClientRect();
            state.canvas.style.left = `${bounds.left}px`;
            state.canvas.style.top = `${bounds.top}px`;
            state.canvas.style.width = `${bounds.width}px`;
            state.canvas.style.height = `${bounds.height}px`;
            state.canvas.width = bounds.width;
            state.canvas.height = bounds.height;
            state.width = bounds.width;
            state.height = bounds.height;
        }

        // Fit canvas and refit on resize
        subtle_fit() || window.addEventListener('resize', subtle_fit);

        // Set time to current timestamp
        state.time = Date.now();

        // Create 2D context
        state.context = state.canvas.getContext('2d');

        // Spawn particles
        state.particles = Array.from({length: state.conf.count}).map(_ => new Particle(state));
    }

    // Rectanglular intersection detection
    function subtle_intersects(l1, r1, t1, b1, l2, r2, t2, b2) {
        return r1 >= l2 && l1 <= r2 && b1 >= t2 && t1 <= b2;
    }

    // Update scene
    function subtle_update(state) {
        state.particles.forEach(p => p.update(state));
    }

    // Render scene
    function subtle_render(state) {

        // Clear canvas
        state.context.clearRect(0, 0, state.width, state.height);

        // Render all particles
        state.particles.forEach(p => p.render(state));
    }

    // Present scene
    function subtle_present(state) {

        // Increase time
        state.time += 0.1;

        // Update scene
        subtle_update(state);

        // Render scene
        subtle_render(state);

        // Request next loop iteration
        window.requestAnimationFrame(function() {
            subtle_present(state);
        });
    }

    // Render modes
    const Modes = {
        circle: 1,
        square: 2,
    };

    // Default configuration
    const DefaultConf = {
        target: 'body',
        exclude: null,
        size: 32,
        speed: 0.25,
        count: 25,
        lightness: 0.75,
        saturation: 0.25,
        randomizeRotation: false,
        contain: false,
        mode: Modes.square,
    };
    
    // Subtle object
    const Subtle = {
        mode: Modes,
    };

    /**
     * Mounts the Subtle effect.
     */
    Subtle.mount = function mount(conf) {

        // Create new canvas
        const canvas = document.createElement('canvas');

        // Style appropriately
        canvas.style.position = 'absolute';
        canvas.style.zIndex = '-1';

        // Merge configuration
        const finalConf = Object.assign({}, DefaultConf, conf);

        // Get target and exclusion elements
        const targetEl = document.querySelector(finalConf.target || 'body');
        const excludeEl = finalConf.exclude ? document.querySelector(finalConf.exclude) : null;

        // Initialize state
        const state = {
            canvas: canvas,
            conf: finalConf,
            el: targetEl,
            ex: excludeEl,
        };

        // Add canvas to target element
        state.el.appendChild(canvas);

        // Prepare rendering
        subtle_setup(state);

        // Start render loop
        subtle_present(state);
    };

    // Export Subtle object
    window.Subtle = Subtle;
})();