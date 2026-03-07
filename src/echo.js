class Delayline {
    constructor(n) {
        this.n = n;
        this.p = 0;
        this.data = new Float32Array(n);
    }
    get end() {
        return this.data[this.p];
    }
    tap(offset) {
        var x = this.p + offset;
        x = ~~x;
        x %= this.n;
        return this.data[x];
    }
    sample(offset) {
        if(offset < 0)
            offset = 0;
        var p = offset;
        var pi = ~~p;
        return lerp(this.tap(pi), this.tap(pi+1), p-pi);
    }
    clock(input) {
        var end = this.data[this.p];
        this.data[this.p] = input;
        if(++this.p >= this.n) {
            this.p = 0;
        }
        return end;
    }
}

/**
 * @function echo#create
 * @param {Object} parameters
 * @param {number} [parameters.sidetime] - Side-delay time in seconds. Default is 0.01.
 * @param {number} [parameters.division] - Feedback spacing in quarter notes. Default is 3/3.
 * @param {number} [parameters.pan] - Feedback panning. Default is 0.5.
 * @param {number} [parameters.stereo] - Stereo widening amount. If >1 the amplitude of the stereo information is amplified which deepens the effect. Default is 1.5.
 * @param {number} [parameters.wet] - 0 = Only dry signal. 1 = Dry + 100% Wet signal. Default is 0.3.
 */

const echo = filter.def(
	class {
		constructor(opt) {
			this.lastOut = [0, 0];
			var division = opt.division || 1;
			var pan = clamp01((opt.pan || 0)*.5+.5);
			var sidetime = (opt.sidetime || 0) / ditty.dt;
			var time = 60 * division / ditty.bpm;
			this.fb = clamp(opt.feedback || 0, -1, 1);
			this.kl = 1-pan;
			this.kr = pan;
			this.wet = opt.wet || .5;
			this.stereo = isFinite(opt.stereo) ? opt.stereo : 1;
			var n = ~~(time / ditty.dt);
			this.delay = [new Delayline(n), new Delayline(n)];
			this.dside = new Delayline(~~sidetime);
		}
		process(inv, opt) {
			this.dside.clock(inv[0]);
			var l = this.dside.end * this.kl;
			var r = inv[1] * this.kr;
			var nextl = l + this.delay[1].end * this.fb;
			var nextr = r + this.delay[0].end * this.fb;
			this.lastOut[0] = inv[0] + this.delay[0].end * this.wet;
			this.lastOut[1] = inv[1] + this.delay[1].end * this.wet;
			this.delay[0].clock(nextl);
			this.delay[1].clock(nextr);
			if(this.stereo != 1) {
				var m = (this.lastOut[0] + this.lastOut[1])*.5;
				var s = (this.lastOut[0] - this.lastOut[1])*.5;
				s *= this.stereo;
				this.lastOut[0] = m+s;
				this.lastOut[1] = m-s;
			}
			return this.lastOut;
		}
	}, {sidetime: .01, division: 3/3, pan: .5, wet: .3, feedback: .5, stereo: 1.5}
);

