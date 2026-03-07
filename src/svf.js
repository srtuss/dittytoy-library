/**
 * The algorithm is adapted from this article by Andrew Simper of Cytomic
 * https://cytomic.com/files/dsp/SvfLinearTrapOptimised2.pdf
 */
class SVF {

    constructor()
    {
        this.lp=this.bp=this.hp=this.ap=this.no=this.ic1eq=this.ic2eq=0;
    }
    /**
     * Set parameters.
     * @param {number} fc - cutoff or center frequency in Hz
     * @param {number} q - Q parameter
     * @returns {SVF} Returns reference to SVF class for chaining function calls.
     */
    sp(fc, q) {
        fc = clamp(fc * ditty.dt, 0, .499);
        let g = Math.tan(PI * fc);
        this.k = 1 / q;
        this.a1 = 1 / (1 + g * (g + this.k));
        this.a2 = g * this.a1;
        this.a3 = g * this.a2;
        return this;
    }
    /**
     * Process next sample.
     * @param {number} v0 - Input signal of the filter
     * @returns {SVF} Returns reference to SVF class for accessing outputs.
     */
    process(v0)
    {
        let s = this;
        let v1, v2, v3;
        v3 = v0 - s.ic2eq;
        v1 = s.a1 * s.ic1eq + s.a2 * v3;
        v2 = s.ic2eq + s.a2 * s.ic1eq + s.a3 * v3;
        s.ic1eq = 2 * v1 - s.ic1eq;
        s.ic2eq = 2 * v2 - s.ic2eq;
        s.lp = v2;
        s.bp = v1;
        s.hp = v0 - s.k * v1 - v2;
        s.no = s.lp + s.hp;
        s.ap = s.lp + s.hp - s.k * s.bp;
        return s;
    }
    /**
     * Copy the object. The new object the same parameters as this object but the initial state.
     * */
    cp() {
        let r = new SVF();
        r.k = this.k;
        r.a1 = this.a1;
        r.a2 = this.a2;
        r.a3 = this.a3;
        return r;
    }
}

/**
 * low-pass output signal
 * @member {number} SVF#lp
 */
/**
 * band-pass output signal
 * @member {number} SVF#bp
 */
/**
 * high-pass output signal
 * @member {number} SVF#hp
 */
/**
 * all-pass output signal
 * @member {number} SVF#ap
 */
/**
 * notch output signal
 * @member {number} SVF#no
 */