(function () {
    var element = function (id) {
        return document.getElementById(id);
    }

    var status = element('status');
    var  eventdetailscolumn= element('eventdetailscolumn');
    


    //set default status
    var statusDefault = status.textCount;
    var setStatus = function (s) {
        //set staus
        status.textContent = s;
        if (s != statusDefault) {
            var delay = setTimeout(function () {
                setStatus(statusDefault);
            }, 4001);
        }

    }
    //connect to socket.io
    var socket = io.connect('https://owasptu.herokuapp.com:4001');

    socket.on('connect', function(data) {
        socket.emit('join', 'Hello World from client');
     });

    //Check for Connection
    if (socket != undefined) {
        console.log('connected to socket');
    }

    socket.on('messages', function(data) {
        console.log(data);
    });
    
    // Handle Output
    socket.on('output', function (data) {
        console.log(data);
        if (data.length) {

            for (var x = 0; x < data.length; x++) {
                var divmain= document.createElement('div');
    
                //buils out message div
                var divsub1 = document.createElement('div');
              
                var heading1 = document.createElement('h6');
                var para1= document.createElement('p');
                var divsub2=document.createElement('div');
                var divsubsub1=document.createElement('div');
                var paramap=document.createElement('p');
                var paratime=document.createElement('p');
                var iconmap= document.createElement('i');
                var icontime=document.createElement('i');
               
                var refrence = document.createElement('a');

                divmain.setAttribute('class','single-schedule-area d-flex flex-wrap justify-content-between align-items-center wow fadeInUp');
                divsub1.setAttribute('class', 'single-schedule-tumb-info d-flex align-items-center');
                divsubsub1.setAttribute('class','single-schedule-info');
                divsub2.setAttribute('class','schedule-time-place');
                iconmap.setAttribute('class','zmdi zmdi-map');
                icontime.setAttribute('class','zmdi zmdi-time');
                refrence.href="\register";


                heading1.textContent =data[x].eventsubname;
                para1.textContent =  data[x].eventname;
                
                paramap.appendChild(iconmap);
                paramap.appendChild(document.createTextNode(data[x].location)); // .textContent=data[x].location;
 
                paratime.appendChild(icontime);
                paratime.appendChild(document.createTextNode(data[x].time)); //.textContent=data[x].time;


                divsub2.appendChild(paratime);
                divsub2.appendChild(paramap);
                
                divsubsub1.appendChild(heading1);
                divsubsub1.appendChild(para1);

                divsub1.appendChild(divsubsub1);
                divmain.appendChild(divsub1);
                divmain.appendChild(divsub2);

                eventdetailscolumn.appendChild(divmain);
            }
        }
    });

    // Get Status From server
    socket.on('status', function (data) {
        // Get Message status0
        setStatus((typeof data === 'object') ? data.message : data);

        // If status is clear, clear text
        if (data.clear) {
            textarea.value = '';
        }
    });


})();