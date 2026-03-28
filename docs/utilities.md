# Utilities

## Shortcuts

The library creates global shortcuts for commonly used constants and functions:

|Library definition||Value|
|-------|-------------------|------------|
| `max` | maximum of values | `Math.max` |
| `min` | minimum of values | `Math.min` |
| `abs` | absolute of values | `Math.abs` |
| `random` | random number between 0.0 <= x < 1.0 | `Math.random` |
| `sin` | sine | `Math.sin` |
| `cos` | cosine | `Math.cos` |
| `exp` | exponent | `Math.exp` |
| `tanh` | hyperbolic tangent | `Math.tanh` |
| `pow` | power | `Math.pow` |
| `log` | natural logarithm | `Math.log` |
| `PI` || `Math.PI` |
| `TAU`  || `2 * Math.PI` |

## **llerp** - logarithmic lerp()

Performs linear interpolation of two endpoint values but unlike lerp() the distribution of the intermediate points is logarithmic. This is particularly useful for interpolating quantities that are naturally perceived logarithmic such as frequency or amplitude sweeps.

```{warning}
The start point and end point must be non-zero.
```

### How to use

```js
lerp(10, 100, .7); // returns 73.0
llerp(10, 100, .7); // returns 50.118723
```

```{eval-rst}
.. js:autofunction:: llerp
```

## **poke** - call a function in playback-time

Useful for parameter automation.

```{warning}
Keep in mind that the changes to global variables are only visible to synths played by the same loop as the call to `poke`. This is because Ditty loops execute isolated from each other.
```

```{eval-rst}
.. js:autofunction:: poke
```

### How to use

```js
let parameter = 0;

// change the value of "parameter" every beat
loop(lc => {
    poke(() => parameter = sin(ditty.tick));
    sleep(1);
});
```

## **sleeps** - sleep() with swing

Behaves like sleep(), except for adding [swing](https://en.wikipedia.org/wiki/Swing_time) to the rhythm.
Use `ditty.swing` to globally adjust the amount of swing from 0.0 (no swing) to 0.5 (strong swing).
If `ditty.swing` is undefined or 0.0, sleeps() behaves exactly like sleep().

```{eval-rst}
.. js:autofunction:: sleeps
```

### How to use

```js
ditty.bpm = 90;
ditty.swing = .3;

// plays a metronome sound with swing
loop(lc => {
    for(let i = 0; i < 4; ++i) {
        sine.play(i?c7:c6, {duration:.02, release:.02});
        sleeps(.25);
    }
});
```

## **rhy** - Euclidean Rhythm generator

```{eval-rst}
.. js:autofunction:: rhy
```

### How to use

```js
let pattern1 = rhy(5, 16); // returns [1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0]

let pattern2 = rhy(7, 16); // returns [1, 0, 0, 1, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0]

let pattern3 = rhy(3, 8); // returns [1, 0, 0, 1, 0, 0, 1, 0]

loop(() => {
    let pattern = [pattern1, pattern2, pattern3].choose();
    pattern.forEach((v,j) => {
        if(v)
            sine.play(c5, {duration:0, release:.1});
        sleep(1/4);
    });
});

// play a hi-hat sound every beat
let hihat = synth.def((p,e,t,o)=>(Math.random()-.5)*e.value, {release:.05});
loop(() => {
    hihat.play();
    sleep(1);
});
```

## **fft** - Fast Fourier Transform

Coming soon