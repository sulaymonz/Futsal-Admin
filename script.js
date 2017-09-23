/**
 * Created by sulaymonz on 9/18/17.
 */

window.onload = function(){

    var cont = document.querySelector('.main-container');

    var form       = cont.querySelector('form');
    var submit     = cont.querySelector('#submit');
    var photos     = cont.querySelector('#photos');
    var feedback   = cont.querySelector('#feedback');
    var snackbar   = cont.querySelector('#snackbar');

    var inputs         = getAll('input[type=text], input[type=number], select', cont);
    var checkboxes     = getAll('input[type=checkbox]', cont);
    var requiredFields = getAll('input:required', cont);

    var formData;
    var fileList;
    var imageFormats = ["image/jpeg", "image/png", "image/gif"];

    var isValid = true;
    var invalids = [];

    photos.addEventListener('change', handleFileSelect);

    submit.addEventListener("click", function(){
        resetInvalids();
        if(validateForm()){
            // collecting data to submit
            formData = new FormData();

            inputs.forEach(function(input){
                formData.append(input.id, input.value);
            });
            checkboxes.forEach(function(checkbox){
                formData.append(checkbox.id, checkbox.checked);
            });
            for(var i=0; i<fileList.length; i++){
                formData.append("photos", fileList[i]);
            }

            // uncomment to log the data collected
            /*for(var value of formData.values()){
             console.log(value);
            }*/

            if(validateFiles(formData)){
                showSnackbar('Зал успешно добавлен.'); // should put this line inside success function when db url ready
                $.ajax({
                    url: "ourURLHere",
                    type: "POST",
                    data: formData,
                    processData: false,
                    contentType: false,
                    success: function (response) {
                        console.log(response);
                        // TODO: fields should be emptied after data successfully sent
                    }
                });
            }
            else {
                showErrorMessage('Файлы должны быть в формате jpg, png или gif');
                buttonStyleDanger();
            }
        }
        else {
            showErrorMessage('Заполните объязательные поля (*)');
            buttonStyleDanger();
        }
    });

    // removing error style from input when start typing
    requiredFields.forEach(function(field){
        field.addEventListener('keydown', function(){
            removeErrorColor(this);
        });
    });

    function handleFileSelect(){
        fileList = this.files;
        removeErrorColor(this);
    }

    function validateForm(){
        requiredFields.forEach(function(req){
            if(req.value == ""){
                isValid = false;
                invalids.push(req);  // array of invalid fields will be used to reset them soon.
                addErrorColor(invalids[invalids.length-1]);  // styling invalids.
            }
        });

        return isValid;
    }

    function validateFiles(data){
        var images = data.getAll("photos");  // here getAll() is built-in method of FormData object
        var filesValid = true;
        images.forEach(function(image){
            if(imageFormats.indexOf(image.type) == -1) {
                filesValid = false;
                addErrorColor(photos);
            }
        });
        return filesValid;
    }

    function resetInvalids(){
        invalids.forEach(function(inv){
            removeErrorColor(inv);
        });
        removeErrorColor(photos);
        isValid = true;
        invalids = [];
        hideErrorMessage();
        buttonStyleDefault();
    }

    function addErrorColor(node){
        node.parentNode.classList.add('has-error');
    }

    function removeErrorColor(node){
        node.parentNode.classList.remove('has-error');
    }

    function showErrorMessage(message){
        feedback.innerHTML = message;
        feedback.classList.add('show');
    }

    function hideErrorMessage(){
        feedback.classList.remove('show');
    }

    function buttonStyleDanger(){
        submit.classList.remove('btn-default');
        submit.classList.add('btn-danger');
    }

    function buttonStyleDefault(){
        submit.classList.remove('btn-danger');
        submit.classList.add('btn-default');
    }

    function showSnackbar(message){
        snackbar.innerHTML = message;
        snackbar.classList.add('show');
        setTimeout(function(){
            snackbar.classList.remove('show');
        }, 3000);
    }

    function getAll(selector, context){
        var nodes = context.querySelectorAll(selector);
        var arr = [];
        for(var i=0; i<nodes.length; i++){
            arr.push(nodes[i]);
        }
        return arr;
    }

};