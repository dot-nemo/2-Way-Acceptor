// code from https://enzedonline.com/en/tech-blog/import-text-file-into-a-textarea-html-form-field/

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