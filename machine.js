document.addEventListener("DOMContentLoaded", e => {
    const q = []
    const F = []
    let lEnd = '⋊', rEnd = '⋉';
    const right = true, left = false;
    let lTouch = false, rTouch = false;

    function State(name) {
        this.name = name;
        this.δ = [];
    }

    function Transition(read, direction, destination) {
        this.read = read;
        this.direction = direction
        this.destination = destination;
    }

    class Timeline {
        constructor(q_i, ω, head, path) {
            this.q_i = q_i;
            this.ω = ω;
            this.head = head;
            this.path = path;
        }

        step(log) {
            const timelines = []
            for (let i = 0; i < this.q_i.δ.length; i++) {
                const δ = this.q_i.δ[i];
                if (δ.read == this.ω[this.head]) {
                    const path = `(${δ.read}) ; ${δ.direction ? '+' : '-'} => ${δ.destination.name}`;
                    if (log) console.log('Found %s', path);
                    timelines.push(new Timeline(δ.destination, this.ω, δ.direction ? this.head + 1 : this.head - 1, this.path + path));
                    if (δ.read == lEnd) {
                        lTouch = true;
                    } else if (δ.read == rEnd) {
                        rTouch = true;
                    }
                } else if (δ.read == '') {
                    const path = `(λ) ; ${this.direction ? '+' : '-'} => ${δ.destination.name}`;
                    if (log) console.log('Lambda transition found: %s', path);
                    if (!(lTouch && rTouch && F.includes(this.q_i) && this.q_i.δ.length == 0))
                        timelines.push(new Timeline(δ.destination, this.ω, this.head, this.path + path));
                    else
                        console.log(`but ${this.q_i.name} is a final state with nothing left to read`);
                }
            }
            return timelines;
        }
    }

    const input = document.getElementById('input');
    const run = document.getElementById('run');
    const step = document.getElementById('step');
    const reset = document.getElementById('reset');
    run.onclick = async function() {
        reset.onclick();
        const indisp = document.getElementById('input_display');
        const accept = await fulltest(lEnd + input.value + rEnd, q[0], true, 250, 0);
        if (accept) {
            indisp.style.backgroundColor = 'hsl(127, 100%, 90%)'
        } else {
            indisp.style.backgroundColor = 'hsl(0, 100%, 90%)'
        }
        console.log(
            (input.value.length == 0 ? 'λ' : input.value) + ' is ' + (accept ? 'accepted' : 'rejected')
            );
    }

    let stepCtr = 1;
    step.onclick = async function() {
        const indisp = document.getElementById('input_display');
        const accept = await fulltest(lEnd + input.value + rEnd, q[0], true, 250, stepCtr);

        if (accept != null) {
            if (accept) {
                indisp.style.backgroundColor = 'hsl(127, 100%, 90%)'
            } else {
                indisp.style.backgroundColor = 'hsl(0, 100%, 90%)'
            }
            console.log(
                (input.value.length == 0 ? 'λ' : input.value) + ' is ' + (accept ? 'accepted' : 'rejected')
                );

        }
            stepCtr++;
    }

    reset.onclick = function() {
        stepCtr = 1;
        resetDisplayBG();
    }

    q.push(
        new State('q0'),
        new State('q1'),
        new State('q2'),
        new State('q3'),
        new State('q4*')
    );

    F.push(q[4]);

    q[0].δ.push(
        new Transition(lEnd, right, q[0]),
        new Transition('A', right, q[0]),
        new Transition('B', right, q[0]),
        new Transition(rEnd, left, q[1])
    );

    q[1].δ.push(
        new Transition('A', left, q[2]),
        new Transition('B', left, q[2])
    );

    q[2].δ.push(
        new Transition('A', left, q[4]),
        new Transition('B', left, q[3])
    );

    async function fulltest(ω, q_i, log, delay, step) {
        const display = document.getElementById('input_display');
        display.innerHTML = '';
        for (let i = 0; i < ω.length; i++) {
            const c = ω[i];
            display.innerHTML += `<span id=disp_${i} style>${c}</span>`;
        }
        resetDisplayBG();
        if (ω.length == 0) {
            display.innerHTML = `<span id=disp_0 style>λ</span>`;
        }

        if (log) console.log('Testing: ' + (ω.length > 0 ? ω : 'λ') + ' on ' + q_i.name);
        let tls = [new Timeline(q_i, ω, 0, '>' + q_i.name)];
        let stepCtr = 1;
        while(true) {
            if (step == 0) await sleepNow(delay)
            if (log) console.log('Step %d', stepCtr);
            const newTLs = [];
            let tlCtr = 0;
            tls.forEach(tl => {
                if (log) console.log('Timeline %d starts on %s; head on %d; reading %s', tlCtr, tl.q_i.name, tl.head, (ω.length > 0 ? tl.ω[tl.head] : 'λ') );
                let found = false;
                tl.step(log).forEach(tl2 => {
                    found = true;
                    newTLs.push(tl2);
                })
                if (!found) {
                    if (log) console.log('Timeline %d has died', tlCtr);
                }
                tlCtr++;
            });
            stepCtr++;

            const multi = 256 / tls.length;
            resetDisplayBG();
            for (let i = tls.length - 1; i >= 0; i--) {
                const tl = tls[i];
                const color = Math.round(multi*i);
                if (tl.head < ω.length) {
                    const disp = document.getElementById(`disp_${tl.head}`)
                    if (step == 0) await sleepNow(50)
                    disp.style.backgroundColor = `hsl(${color%256}, 100%, 90%)`;
                }
            }

            if (newTLs.length == 0) {
                step = 0
                break;
            } else {
                tls = newTLs;
            }
            if (stepCtr == step + 1)
                break;
        }
        let accept = false
        for (let i = 0; i < tls.length && step == 0; i++) {
            const tl = tls[i];
            if (F.includes(tl.q_i)) {
                resetDisplayBG();
                accept = true;
                console.log(tl.path);
                break;
            }
        }
        if (step != 0 && tls.length != 0) {
            return null;
        }
        return accept;
    }
});

function resetDisplayBG() {
    const indisp = document.getElementById('input_display');
    indisp.style.backgroundColor = '';
    const displays = document.querySelectorAll('#input_display > span');
    displays.forEach(disp => {
        disp.style.backgroundColor = '';
    });
}

const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))