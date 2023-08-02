const submitBtn = document.querySelector('#submit');
const textArea = document.querySelector('#code-input');

const format = document.querySelector('#format');


let machine_val = {
    states: [],
    inputs: [],
    transitions: [],
    start_state: "",
    accept_state: "",
    reject_state: ""
}

submitBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("clicked submit btn");

    const text = document.getElementById('code-input').value;
    console.log(text);

    let lines = text.split('\n');
    const machine_values = []
    
    const numStates = parseInt(lines[0]);
    const states = lines[1].split(' ');

    for(let i = 0; i < numStates; i++) {
        machine_val.states.push(states[i]);
    }

    const numInputs = parseInt(lines[2]);
    const inputs = lines[3].split(' ');

    for(let i = 0; i < numInputs; i++) {
        machine_val.inputs.push(inputs[i]);
    }

    const numTransitions = parseInt(lines[4]);
    for (i = 0; i < numTransitions; i++) {
        machine_val.transitions.push(lines[i + 5]); // adjust to sep values
    }

    machine_val.start_state = lines[numTransitions + 5];
    machine_val.accept_state = lines[numTransitions + 6];
    machine_val.reject_state = lines[numTransitions + 7];

    
    format.innerHTML = `Number of States: ${numStates} <br>
                        States: <br>`;

    for (let i = 0; i < numStates; i++) {
        format.innerHTML += `${machine_val.states[i]} <br>`
    }

    format.innerHTML += `<br>Number of inputs: ${numInputs} <br>
                        Inputs: <br>`;
    for (let i = 0; i < numInputs; i++) {
        format.innerHTML += `${machine_val.inputs[i]} <br>`
    }
                
    format.innerHTML += `<br>Number of Transitions: ${numTransitions} <br>`;
    
    for (let i = 0; i < numTransitions; i++) {
        format.innerHTML += `${machine_val.transitions[i]} <br>`
    }

    format.innerHTML += `<br>Start State: ${machine_val.start_state} <br>
                        Accept State: ${machine_val.accept_state} <br>
                        Reject State: ${machine_val.reject_state} <br>`

    console.log(machine_values);
    
});

textArea?.addEventListener('keyup', (e) => {
    e.preventDefault();
    console.log('keyup');

    if(textArea.value === "") {
        format.innerHTML = "";
    } else {
        format.innerHTML = `Fix Format: <br>
                            copy format here`
    }
});




// code below from https://enzedonline.com/en/tech-blog/import-text-file-into-a-textarea-html-form-field/

const initialiseImportTextFieldPanel = (fileInputId, textAreaId) => {

    const fileInput = document.getElementById(fileInputId);
    const textArea = document.getElementById(textAreaId);
    const textInitialHeight = textArea.style.height
    if (textArea.style.maxHeight == '') {textArea.style.maxHeight = '30em';}
    textArea.style.overflowY='auto';

    const readFile = (source, target) => {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            target.value = event.target.result;
            target.style.height = textInitialHeight;
            target.style.height = target.scrollHeight 
                + parseFloat(getComputedStyle(target).paddingTop) 
                + parseFloat(getComputedStyle(target).paddingBottom) + 'px';
        });
        reader.readAsText(source);
    }

    fileInput.addEventListener('change', (event) => {
        event.preventDefault();
        const input = fileInput.files[0];
        readFile(input, textArea)
        fileInput.value = '';
        fileInput.blur();
    });

}