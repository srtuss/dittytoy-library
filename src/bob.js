// https://www.kvraudio.com/forum/viewtopic.php?f=33&t=349859
//// LICENSE TERMS: Copyright 2012 Teemu Voipio
// 
// You can use this however you like for pretty much any purpose,
// as long as you don't claim you wrote it. There is no warranty.
//
// Distribution of substantial portions of this code in source form
// must include this copyright notice and list of conditions.
//

function tanhXdX(x) {
    var a = x*x;
    return ((a + 105)*a + 945) / ((15*a + 420)*a + 945);
}

/**
 * This class is a port of "Cheap non-linear zero-delay filter" by Teemu Voipio
 * https://www.kvraudio.com/forum/viewtopic.php?f=33&t=349859
 */
class Bob {
    constructor(q=.9, f=.01) {
        this.zi = 0;
        this.s = [0, 0, 0, 0];
        this.sf(f);
        this.sq(q);
        this.lp = 0;
    }
    /**
     * Set cutoff frequency.
     * @param {number} fc - cutoff or center frequency in Hz
     * @returns {Bob} Returns reference to the class for chaining function calls.
     */
    sf(fc) {
        this.f = Math.tan(Math.PI * fc * ditty.dt);
        return this;
    }
    /**
     * Set resonance amount.
     * The filter starts self-oscillating at settings over 0.9.
     * @param {number} reso
     * @returns {Bob} Returns reference to the class for chaining function calls.
     */
    sq(reso) {
        this.r = (40.0/9.0) * reso;
        return this;
    }
    /**
     * Process next sample.
     * @param {number} v0 - Input signal of the filter.
     * @returns {Bob} Returns reference to the class for accessing outputs.
     */
    process(v0) {
        var s = this.s;
        var f = this.f;
        var r = this.r;
        var ih = 0.5 * (v0 + this.zi);
        this.zi = v0;
        var t0 = tanhXdX(ih - r * s[3]);
        var t1 = tanhXdX(s[0]);
        var t2 = tanhXdX(s[1]);
        var t3 = tanhXdX(s[2]);
        var t4 = tanhXdX(s[3]);
        var g0 = 1 / (1 + f*t1), g1 = 1 / (1 + f*t2);
        var g2 = 1 / (1 + f*t3), g3 = 1 / (1 + f*t4);
        var f3 = f*t3*g3;
        var f2 = f*t2*g2*f3;
        var f1 = f*t1*g1*f2;
        var f0 = f*t0*g0*f1;
        var y3 = (g3*s[3] + f3*g2*s[2] + f2*g1*s[1] + f1*g0*s[0] + f0*v0) / (1 + r*f0);
        var xx = t0*(v0 - r*y3);
        var y0 = t1*g0*(s[0] + f*xx);
        var y1 = t2*g1*(s[1] + f*y0);
        var y2 = t3*g2*(s[2] + f*y1);
        s[0] += 2*f * (xx - y0);
        s[1] += 2*f * (y0 - y1);
        s[2] += 2*f * (y1 - y2);
        s[3] += 2*f * (y2 - t4*y3);
        this.lp = y3;
        return this;
    }
}

/**
 * low-pass output signal
 * @member {number} Bob#lp
 */