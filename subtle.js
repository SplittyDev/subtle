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

            // Radius/Size starts with 0
            this.r = 0;

            // Random hue
            this.c = Math.random() * 360;

            // Random speed within [speed/2, speed]
            this.s = (state.conf.speed + (Math.random() * state.conf.speed)) / 2.0;

            // Random position
            this.x = (Math.random() * state.width) | 0;
            this.y = (Math.random() * state.height) | 0;

            // Random rotation in radians
            this.rad = Math.random() * Math.PI * 2;
        }

        // Update particle
        update(state) {

            // Increase radius/size by speed
            this.r += this.s;

            // Increase hue by 1
            this.c = (this.c + 1) % 360;

            // r <= 25%
            if (this.r < state.conf.radius * 0.25) {
                this.a = (this.r / (state.conf.radius * 0.25));
            }

            // r >= 25% && r <= 75%
            else if (this.r >= state.conf.radius * 0.25 && this.r <= state.conf.radius * 0.75) {
                this.a = 1;
            }

            // r >= 75% && r <= 100%
            else if (this.r >= state.conf.radius * 0.75 && this.r <= state.conf.radius) {
                this.a = (state.conf.radius - this.r) / (state.conf.radius * 0.25);
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
            state.canvas.width = window.innerWidth;
            state.canvas.height = window.innerHeight;
            state.width = state.canvas.scrollWidth;
            state.height = state.canvas.scrollHeight;
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
        radius: 32,
        speed: 0.25,
        count: 25,
        lightness: 0.75,
        saturation: 0.25,
        randomizeRotation: false,
        mode: Modes.circle,
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
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';

        // Add canvas to body
        document.body.appendChild(canvas);

        // Initialize state
        const state = {
            canvas: canvas,
            conf: Object.assign({}, DefaultConf, conf),
        };

        // Prepare rendering
        subtle_setup(state);

        // Start render loop
        subtle_present(state);
    };

    // Export Subtle object
    window.Subtle = Subtle;
})();