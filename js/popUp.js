"use strict";


$(document).ready(function()
{
	$(".p1").click(function()
	{
		
		$(".pop").fadeIn();


	});
   $(".p2").click(function()
	{
		
		$(".pop2").fadeIn();
	});
   $(".p3").click(function()
	{

		$(".pop3").fadeIn();
	});
   $(".p4").click(function()
	{
		
		$(".pop4").fadeIn();
	});
   $(".p5").click(function()
	{
		
		$(".pop5").fadeIn();
	});
   $(".p6").click(function()
	{
		
		$(".pop6").fadeIn();
	});
   $(".pop").click(function()
	{
		
		$(".pop").fadeOut();
	});
$(".pop2").click(function()
	{
	
		$(".pop2").fadeOut();
	});
$(".pop3").click(function()
	{
		
		$(".pop3").fadeOut();
	});
$(".pop4").click(function()
	{
		
		$(".pop4").fadeOut();
	});
$(".pop5").click(function()
	{
	
		$(".pop5").fadeOut();
	});
$(".pop6").click(function()
	{
		$(".pop6").fadeOut();
	
	});

	if($("#secti").offset().top-$("body").scrollTop()==0)
	{
		console.log("sdfsdf");
		$(".pp").css.display="none";
	}

});