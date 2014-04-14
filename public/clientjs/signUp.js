function sendMessage(e) {
    // prevent the page from redirecting
    e.preventDefault();

    $.post('',
    {
       name: $('name').val(),
       email: $('email').val(), 
       password: $('password').val(),
       street: $('street').val(),
       city: $('city').val(),
       state: $('state').val(),
       zip: $('zip').val()
    },
    function(data,status){
    //TODO 
    });
}

//overrides default behavior of messageForm
window.addEventListener('load', function(){
    var messageForm = document.getElementById('signForm');
    messageForm.addEventListener('submit', sendMessage, false);
}, false);
