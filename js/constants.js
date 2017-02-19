const {BrowserWindow} = require('electron');
var lastConstants = null;

const configuration = {
  url:'http://michael-laptop.local',
  socket_port:':81'
}

var refreshConstants = function(){
  $.getJSON(configuration.url + '/constants/', function(data){
    console.log('new Data');
    lastConstants = data;
    $(".values-list table").find("tr:gt(0)").remove();
    $.each(data, function(index, value){
      $(".values-list table").append(
        '<tr><td><div class="remove-button"><i class="material-icons md-light md-inactive" id="' + value.Name + '">delete</i></div></td>' +
        '<td class="const-name">' + value.Name + '</td>' +
        '<td class="const-desc">' + value.Description + '</td>' +
        '<td><input type="text" value=\"' + value.Value + '\" class="const-value-input" id="'+ value.Name+'"></input></td></tr>');
    });
  });
}

$(document).ready(function(){
  setInterval(refreshConstants, 500);
  refreshConstants();
  $('#push-changes').click( () => {
    $.getJSON(configuration.url + '/constants/', function(data){
      $.each(data, function(index, value){
        var body = {
          Name: value.Name,
          Description: value.Description,
          Value: $('input.const-value-input#' + value.Name).val()
        };
        console.log(body);
        $.ajax({
          type:"POST",
          url:configuration.url + "/constant/set",
          data:JSON.stringify(body),
          success:function(){
            setTimeout(refreshConstants(), 1000);
          },
          dataType:"json",
          contentType: "application/json"
        });
      });
    });
  });
  $('#add-item').on('click', () => {
    addConstant($('#add-item-form #Name').val(), $('#add-item-form #Description').val(), $('#add-item-form #Value').val())
    $('#add-item-form #Name').val('');
    $('#add-item-form #Description').val('');
    $('#add-item-form #Value').val('');
  });
  $(document).on('click', '.remove-button', (e) => {
    removeConstant(e.target.id);
  });
});
//setInterval(refreshConstants, 1000);

function removeConstant(name){
  $.ajax({
    type:"GET",
    url:configuration.url + "/constant/remove/" + name,
    success: function(){
      setTimeout(refreshConstants(), 1000);
    }
  });
}

function addConstant(name, desc, value){
  $.ajax({
    type:"POST",
    url: configuration.url + "/constant/add",
    data:JSON.stringify({
      Name: name,
      Description: desc,
      Value: value
    }),
    success:function(){
      setTimeout(refreshConstants(), 1000);
    },
    dataType:"json",
    contentType: "application/json"
  });
}

var socket = require('socket.io-client').connect(configuration.url + configuration.socket_port, {reconnect : true});
socket.on('connection', (data) => {});
socket.on('constants-updated', (data) => {
  console.log('Recieved message');
  setTimeout(refreshConstants(), 1000);
});
