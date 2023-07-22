document.addEventListener("DOMContentLoaded", e => {
    const q = []
    const F = []

    let stepwatch = true

    function State(name) {
        this.name = name;
        this.δ = [];
    }

    function Transition(read, destination) {
        this.read = read;
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
                if (δ.read == '') {
                    const path = `(λ) => ${δ.destination.name}`;
                    if (log) console.log('Lambda transition found: %s', path);
                    if (!(this.head == this.ω.length && F.includes(this.q_i)))
                        timelines.push(new Timeline(δ.destination, this.ω, this.head, this.path + path));
                } else if (δ.read == this.ω[this.head]) {
                    const path = `(${δ.read}) => ${δ.destination.name}`;
                    if (log) console.log('Accepted %s', path);
                    timelines.push(new Timeline(δ.destination, this.ω, this.head + 1, this.path + path));
                }
            }
            return timelines;
        }
    }

    const input = document.getElementById('input');
    const run = document.getElementById('run');
    const step = document.getElementById('step');
    run.onclick = async function() {
        const indisp = document.getElementById('input_display');
        const accept = await fulltest(input.value, q[0], true, 500);
        if (accept) {
            indisp.style.backgroundColor = ''
        }
        console.log(
            (input.value.length == 0 ? 'λ' : input.value) + ' is ' + (accept ? 'accepted' : 'rejected')
            );
    }

    step.onclick = async function() {

    }

    q.push(
        new State('q0*'),
        new State('q1'),
        new State('q2'),
        new State('q3'),
        new State('q4*'),
        new State('q5'),
        new State('q6'),
        new State('q7*'),
        new State('q8'),
        new State('q9')
    );

    F.push(q[0], q[2]);

    q[0].δ.push(
        new Transition('0', q[0]),
        new Transition('', q[1]),
        new Transition('', q[5])
    );

    q[1].δ.push(
        new Transition('0', q[2])
    );

    q[2].δ.push(
        new Transition('1', q[3])
    );

    q[3].δ.push(
        new Transition('0', q[4])
    );

    q[4].δ.push(
        new Transition('', q[8]),
        new Transition('1', q[3])
    );

    q[5].δ.push(
        new Transition('1', q[6])
    );

    q[6].δ.push(
        new Transition('1', q[7])
    );

    q[7].δ.push(
        new Transition('', q[8]),
        new Transition('1', q[7])
    );

    q[8].δ.push(
        new Transition('', q[9])
    );

    q[9].δ.push(
        new Transition('', q[0])
    );

    async function fulltest(ω, q_i, log, delay) {
        const display = document.getElementById('input_display');
        display.innerHTML = '';
        for (let i = 0; i < ω.length; i++) {
            const c = ω[i];
            display.innerHTML += `<span id=disp_${i} style>${c}</span>`;
        }
        resetDisplayBG();
        document.getElementById('disp_0').style.backgroundColor = '	hsl(0, 100%, 90%)';

        if (log) console.log('Testing: ' + ω + ' on ' + q_i.name);
        let tls = [new Timeline(q_i, ω, 0, '>' + q_i.name)];
        let stepCtr = 1;
        while(true) {
            await sleepNow(delay)
            if (log) console.log('Step %d', stepCtr);
            const newTLs = [];
            let tlCtr = 0;
            tls.forEach(tl => {
                if (log) console.log('Timeline %d', tlCtr);
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

            if (newTLs.length == 0) {
                break;
            } else {
                tls = newTLs;
                const multi = 256 / tls.length;

                resetDisplayBG();
                for (let i = 0; i < tls.length; i++) {
                    const tl = tls[i];
                    const color = Math.round(multi*i);
                    if (tl.head < ω.length) {
                        document.getElementById(`disp_${tl.head}`).style.backgroundColor = `hsl(${color%256}, 100%, 90%)`;
                        await sleepNow(100)
                        // console.log(tl.head);
                    }
                }
            }
        }
        let accept = false
        for (let i = 0; i < tls.length; i++) {
            const tl = tls[i];
            if (F.includes(tl.q_i) && tl.head == ω.length) {
                accept = true;
                console.log(tl.path);
                break;
            }
        }
        return accept;
    }
});

function resetDisplayBG() {
    const displays = document.querySelectorAll('#input_display > span');
    displays.forEach(disp => {
        disp.style.backgroundColor = '';
    });
}

const sleepNow = (delay) => new Promise((resolve) => setTimeout(resolve, delay))