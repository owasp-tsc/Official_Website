const button = document.getElementById('login');
button.addEventListener('click', function(e) {
  console.log('button was clicked');
    let admin = {
        userName: document.getElementById('userName').value,
        userPassword: document.getElementById('userPassword').value
    };
    if (checkEmptyString(admin.userName))
    {
        alert('User name is required');
        return;
    }
    if (checkEmptyString(admin.userPassword))
    {
        alert('User Password is required');
        return;
    }

    $.ajax({
        type: "POST",
        url: "/login",
        dataType: "json",
        success: function (msg) {
            if (msg.length > 0) {
                location.href='/gallery';
            } else {
                alert("Invalid User !");
            }
        },
        data: admin
    });
});

function checkEmptyString(val)
{
    return (val == undefined || val == null || val.trim().length == 0);
}
