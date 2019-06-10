$(document).ready(function()
{
$(".contactUs").click(function() {
    $('html,body').animate({
        scrollTop: $(".contactt").offset().top},
        'slow');
});
});
