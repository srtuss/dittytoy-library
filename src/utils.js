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