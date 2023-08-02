const submitBtn = document.querySelector('#submit');
const textArea = document.querySelector('#code-input');

const format = document.querySelector('#format');

submitBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    console.log("clicked submit btn");

    const text = document.getElementById('code-input').value;
    console.log(text);

    let lines = text.split('\n');
    const machine_values = []
    for(let i = 0;i < lines.length; i++){
        machine_values.push(lines[i]);
    }

    console.log(machine_values)
});

textArea?.addEventListener('keyup', (e) => {
    e.preventDefault();
    console.log('keyup');

    if(textArea.value === "") {
        format.innerHTML = "";
    } else {
        format.innerHTML = `Fix Format: <br>
                            2 <b>/* number of states */</b> <br> 
                            A B <b>/* list of states*/</b><br> 
                            2 <b>/* number of inputs */</b> <br> 
                            0 1 <b>/* list of inputs */</b> <br> 
                            4 <b>/* number of transitions */</b><br> 
                            A 0 R <b>/* transitions in the format (place transiiton format here) */</b> <br> 
                            A 1 L <b>/* such that f(q,s) = q' (edit idk for 2dfa) */</b> <br> 
                            B 0 L  (edit idk for 2dfa)<br> 
                            B 1 R   (edit idk for 2dfa)<br> 
                            A <b>/* start state */ </b><br> 
                            1 <b>/* accept state  */</b> <br> 
                            B <b>/* reject state */</b>`
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