# Filters

Filters are used to shape and modulate the spectrum of sounds in pleasing ways.

## **SVF** - 12dB/Octave Multimode Filter

**SVF** implements a state variable filter. The SVF topology takes a single input and computes multiple outputs (low-pass, band-pass, high-pass, all-pass, notch) at the same time with variable resonance. The filters's parameters can be modulated at runtime.

This filter can not be overdriven. The output amplitude stays proportional to the input amplitude.

```{eval-rst}
.. js:autoclass:: SVF
    :members:
```

## **Bob** - 24dB/Octave Transistor Ladder Filter

**Bob** implements a virtual-analog transistor ladder filter. It approximates the response of the electronic circuit used in Moog synthesizers.

This filter supports overdriving. The amplitude of the input signal going beyond 1.0 causes the simulated circuit to saturate, which gives a boost to the low end, fattening the sound. This effect is desirable for bass synths.

```{eval-rst}
.. js:autoclass:: Bob
    :members:
```

## **Res** - Multi-Resonator

Coming soon