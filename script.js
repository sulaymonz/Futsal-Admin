/**
 * Created by sulaymonz on 9/18/17.
 */

window.onload = function(){

    var cont = document.querySelector('.main-container');

    var form       = cont.querySelector('form');
    var submit     = cont.querySelector('#submit');
    var photos     = cont.querySelector('#photos');

    var inputs         = getAll('input[type=text], input[type=number], select', cont);
    var checkboxes     = getAll('input[type=checkbox]', cont);
    var requiredFields = getAll('input:required', cont);

    var formData;
    var fileList;
    var imageFormats = ["image/jpeg", "image/png", "image/gif"];

    var isValid = true;
    var invalids = [];

    photos.addEventListener('change', handleFiles);

    submit.addEventListener("click", function(){
        resetInvalids();
        validateForm();

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

        /*for(var value of formData.values()){
            console.log(value);
        }*/

        $.ajax({
            url: "ourURLHere",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                console.log(response);
            }
        });

    });

    function handleFiles(){
        fileList = this.files;
    }

    function validateForm(){
        for(var i=0; i<requiredFields.length; i++){
            if(requiredFields[i].value == ""){
                isValid = false;
                invalids.push(requiredFields[i]);
            }
        }
        if(!isValid){
            invalids.forEach(function(inv){
                inv.parentNode.parentNode.classList.add('has-error');
            });
        }

    }

    function validateFiles(data){
        var images = data.getAll("photos");
        images.forEach(function(image){
            if(imageFormats.indexOf(image.type) == -1) return false;
        });

    }

    function resetInvalids(){
        invalids.forEach(function(inv){
            inv.parentNode.parentNode.classList.remove('has-error');
        });
        isValid = true;
        invalids = [];
    }

    function showSnackbar(message){  // TODO: shows the message in snackbar that appears at bottom for 3 seconds
        console.log(message);
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