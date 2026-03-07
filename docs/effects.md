# Effects

Effects (as in [effect pedals](https://en.wikipedia.org/wiki/Effects_unit)) make sounds more exciting or add complexity.

## **TDL** - Tape Delay

Coming soon

## **Echo**

**Echo** is a ditty-filter that creates temporal repetitions.

```{eval-rst}
.. js:autofunction:: echo#create
```

To connect the echo effect to your loops use connect():
```js
loop(lc => {
    // play synths here
    sleep(1);
}).connect(echo.create({mix:.1}))
```

## **CMP** - Compressor

Coming soon
