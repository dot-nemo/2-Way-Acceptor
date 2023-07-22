document.addEventListener("DOMContentLoaded", e => {
    const q = []
    const F = []

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
    run.onclick = function() {
        console.log(
            (input.value.length == 0 ? 'λ' : input.value) + ' is ' + (fulltest(input.value, q[0], false) ? 'accepted' : 'rejected')
            );
    }

    q.push(
        new State('q0'),
        new State('q1*'),
        new State('q2'),
        new State('q3*'),
        new State('q4'),
        new State('q5')
    );

    F.push(q[1], q[3]);

    q[0].δ.push(
        new Transition('', q[1]),
        new Transition('', q[3])
    );

    q[1].δ.push(
        new Transition('a', q[2])
    );

    q[2].δ.push(
        new Transition('a', q[1])
    );

    q[3].δ.push(
        new Transition('a', q[4])
    );

    q[4].δ.push(
        new Transition('a', q[5])
    );

    q[5].δ.push(
        new Transition('a', q[3])
    );

    function fulltest(ω, q_i, log) {
        const display = document.getElementById('input_display');
        display.innerHTML = '';
        for (let i = 0; i < ω.length; i++) {
            const c = ω[i];
            display.innerHTML += `<span id=disp_${i}>${c}</span>`;
        }
        resetDisplayBG();
        document.getElementById('disp_0').style.backgroundColor = '	hsl(0, 100%, 90%)';

        if (log) console.log('Testing: ' + ω + ' on ' + q_i.name);
        let tls = [new Timeline(q_i, ω, 0, '>' + q_i.name)];
        let stepCtr = 1;
        while(true) {
            if (log) console.log('Step %d', stepCtr);
            const newTLs = [];
            let tlCtr = 0;
            resetDisplayBG();
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
                for (let i = 0; i < tls.length; i++) {
                    const tl = tls[i];
                    const num = tl.head;
                    const color = Math.round(multi*(i+1))
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