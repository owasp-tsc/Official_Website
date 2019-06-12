const button = document.getElementById('register');
button.addEventListener('click', function(e) {
  console.log('button was clicked');
    let eventregistration = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        year: document.getElementById('year').value,
        eventname: document.getElementById('eventname').value
    };
    if (checkEmptyString(eventregistration.name))
    {
        alert('User name is required');
        return;
    }
    if (checkEmptyString(eventregistration.email))
    {
        alert('User Email is required');
        return;
    }
    if (checkEmptyString(eventregistration.year))
    {
        alert('User Password is required');
        return;
    }

if (checkEmptyString(eventregistration.eventname))
{
    alert('Event name is required');
    return;
}


    $.ajax({
        type: "POST",
        url: "/register",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0 && msg[0].status == true) {
                alert(msg[0].message);
                location.href='/register';
            }
            else {
                alert("Something went wrong please try again !");
            }
        },
        data: eventregistration
    });
});

function checkEmptyString(val)
{
    return (val == undefined || val == null || val.trim().length == 0);
}
