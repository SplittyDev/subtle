A beautiful, calm and subtle particle effect using canvas. Click the image for a live preview.

[![splash.png](splash.png)](https://splittydev.github.io/subtle/)

## Setup

### Simple setup

1. Download the `subtle.js` file by right-clicking [this][rawfile] and clicking `save as`
2. Add the following snippet to your website:
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
| target            | `'body'`      | Target element selector
| exclude           | `null`        | Exclusion element selector
| size              | `32`          | The particle diameter or size
| speed             | `0.25`        | The average particle velocity
| count             | `25`          | The number of particles on screen
| lightness         | `0.75`        | The lightness of a particle
| saturation        | `0.25`        | The color intensity of a particle
| randomizeRotation | `false`       | Whether to randomize particle rotation
| contain           | `false`       | Whether to fully restrict particles to target bounds

Example of an intense circle configuration with randomized rotation:
```js
Subtle.mount({
    mode: Subtle.mode.circle,
    speed: 0.3,
    count: 50,
    lightness: 0.6,
    saturation: 0.5,
    randomizeRotation: true,
});
```


[rawfile]: https://raw.githubusercontent.com/SplittyDev/subtle/master/subtle.js