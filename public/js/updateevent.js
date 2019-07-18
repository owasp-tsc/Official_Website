const button = document.getElementById('updateevent');
button.addEventListener('click', function(e) {
  console.log('button was clicked');
    let eventupdatedetails = {
        eventname: document.getElementById('eventname').value,
        eventsubname: document.getElementById('eventsubname').value,
        time: document.getElementById('time').value,
        location: document.getElementById('location').value
    };
    if (checkEmptyString(eventupdatedetails.eventname))
    {
        alert('User name is required');
        return;
    }
    if (checkEmptyString(eventupdatedetails.eventsubname))
    {
        alert('User Email is required');
        return;
    }
    if (checkEmptyString(eventupdatedetails.time))
    {
        alert('User Password is required');
        return;
    }

if (checkEmptyString(eventupdatedetails.location))
{
    alert('Event name is required');
    return;
}


    $.ajax({
        type: "POST",
        url: "/updateevents",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0 && msg[0].status == true) {
                alert(msg[0].message);
                location.href='/';
            }
            else {
                alert("Something went wrong please try again !");
            }
        },
        data: eventupdatedetails
    });
});

function checkEmptyString(val)
{
    return (val == undefined || val == null || val.trim().length == 0);
}
