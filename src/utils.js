const{max,min,abs,random,sin,cos,exp,tanh,pow,log,PI}=Math;
const TAU=2*PI;

/**
 * Generate euclidean rhythm pattern.
 * @param {number} k number of triggers in the pattern
 * @param {number} n pattern length
 * @returns {array} pattern
 */
function rhy(k, n) {
    let nx = k, ny = n-k, x = [1], y = [0];
    while(nx && ny > 1) {
        if(nx < ny) {
            x = x.concat(y);
            ny -= nx;
        }
        else {
            let t = nx - ny;
            nx = ny;
            ny = t;
            let k = x.concat(y);
            y = x;
            x = k;
        }
    }
    return Array(nx).fill(x).flat().concat(Array(ny).fill(y).flat());
}

/**
 * @param {number} a start point
 * @param {number} b end point
 * @param {number} v parameter 0.0 - 1.0
 * @returns {number} interpolated value
 */
const llerp = (a, b, v) => exp(lerp(log(a), log(b), v));

const __pks = synth.def((p,e,t,o) => o.f.length ? (o.f.pop()(),0) : 0);

/**
 * Call function in playback time.
 * @param {function} f Function to call.
 */
const poke = (f) => __pks.play(1,{f:[f]});

let _st = 0; // this works because Dittytoy executes every loop as a separate worker
             // which means every loop sees it's own "_st".

/**
 * 
 * @param {number} v Playback time advance in quarter notes.
 */
function sleeps(v) {
	if(ditty.swing > 0) {
		let sf = min(ditty.swing, .5);
		let oo = 1 + ~~(v*100);
		v /= oo;
		let zz = 0;
		for(let i = 0; i < oo; ++i) {
			let pha = (_st*2)%1;
			let st = pha < .5;
			zz += v*(st ? 1+sf : 1-sf);
			_st += v;
		}
		sleep(zz);
	}
	else
		sleep(v);
}

/**
 * @param {array} real Array of real data
 * @param {array} imag Array of imaginary data
 * @param {number} fftFrameSize FFT frame size
 * @param {number} sign 1 or -1
 */
function fft(real, imag, fftFrameSize, sign) {
    var temp;
    for(var i = 1; i < fftFrameSize - 1; ++i) {
        // bit reverse
        for(var j = 0, bitm = 1; bitm < fftFrameSize; bitm <<= 1) {
            j <<= 1;
            if(i & bitm)
                j += 1;
        }
        if(i < j) {
            temp = real[i]; real[i] = real[j]; real[j] = temp;
            temp = imag[i]; imag[i] = imag[j]; imag[j] = temp;
        }
    }
    for(var le = 1; le < fftFrameSize; ) {
        var le2 = le;
        le <<= 1
        var ur = 1, ui = 0;
        var arg = PI / le2;
        var wr = cos(arg);
        var wi = sign * sin(arg);
        for(var j = 0; j < le2; ++j) {
            var p1 = j;
            var p2 = p1 + le2;
            for(var i = j; i < fftFrameSize; i += le) {
                var tr = real[p2] * ur - imag[p2] * ui;
                var ti = real[p2] * ui + imag[p2] * ur;
                real[p2] = real[p1] - tr;
                imag[p2] = imag[p1] - ti;
                real[p1] += tr;
                imag[p1] += ti;
                p1 += le;
                p2 += le;
            }
            
            tr = ur * wr - ui * wi;
            ui = ur * wi + ui * wr;
            ur = tr;
        }
    }
}