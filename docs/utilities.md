# Utilities

## Shortcuts

The library creates global shortcuts for commonly used constants and functions:

|Defined in library|Value|
|----|-------|
| `max` maximum of values | `Math.max` |
| `min` minimum of values | `Math.min` |
| `abs` absolute of values | `Math.abs` |
| `random` random number between 0.0 <= x < 1.0 | `Math.random` |
| `sin` sine | `Math.sin` |
| `cos` cosine | `Math.cos` |
| `exp` exponent | `Math.exp` |
| `tanh` hyperbolic tangent | `Math.tanh` |
| `pow` power | `Math.pow` |
| `log` natural logarithm | `Math.log` |
| `PI` | `Math.PI` |
| `TAU`  | `2 * Math.PI` |

## **llerp** - logarithmic lerp()

Performs linear interpolation of two endpoint values but unlike lerp() the distribution of the intermediate points is logarithmic. This is particularly useful for interpolating quantities that are naturally perceived logarithmic such as frequency or amplitude sweeps.

```{warning}
The start point and ent point must be non-zero.
```

```js
lerp(10, 100, .7); // returns 73.0
llerp(10, 100, .7); // returns 50.118723
```

```{eval-rst}
.. js:autofunction:: llerp
```

## **poke** - call a function in playback-time

```{eval-rst}
.. js:autofunction:: poke
```

## **sleeps** - sleep() with swing

Behaves like sleep(), except for adding [swing](https://en.wikipedia.org/wiki/Swing_time) to the rhythm.
Use `ditty.swing` to globally adjust the amount of swing from 0.0 (no swing) to 0.5 (strong swing).
If `ditty.swing` is undefined or 0.0, sleeps() behaves exactly like sleep().

```{eval-rst}
.. js:autofunction:: sleeps
```

## **rhy** - Euclidean Rhythm generator

```{eval-rst}
.. js:autofunction:: rhy
```