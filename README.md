A beautiful, calm and subtle particle effect using canvas.

![splash.png](splash.png)

## Setup

### Simple setup

Add the following snippet to your website:
```html
<!-- Start of Subtle.js -->
<script src="subtle.js"></script>
<script>document.addEventListener('DOMContentLoaded', Subtle.mount);</script>
<!-- End of Subtle.js -->
```

### Advanced setup

The `Subtle.mount` function accepts a configuration object.   
The following keys are currently supported:

| Key               | Default       | Description
| ----------------- | ------------- | ---------------------------------
| mode              | `Subtle.mode.square` | The particle shape
| target            | `body`        | Target element selector
| radius            | `32`          | The particle radius or size
| speed             | `0.25`        | The average particle velocity
| count             | `25`          | The number of particles on screen
| lightness         | `0.75`        | The lightness of a particle
| saturation        | `0.25`        | The color intensity of a particle
| randomizeRotation | `false`       | Whether to randomize particle rotation

Example of an intense square configuration with randomized rotation:
```js
Subtle.mount({
    mode: Subtle.mode.square,
    speed: 0.3,
    count: 50,
    lightness: 0.6,
    saturation: 0.5,
    randomizeRotation: true,
});
```