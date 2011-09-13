jQuery(function() {
  $('#getJSON').click(function() {
    $('#results').append('<i>Getting JSON...</i><br>');
    $.jsonp({
      url: 'http://localhost:3000/api/v3/users',
      callbackParameter: 'callback',
      beforeSend: function(xOptions) {
        $('#results').append('<i>beforeSend</i><br>');
      },
      success: function(json, textStatus) {
        $('#results').append('<i>success: ' + textStatus + '</i><br>');
        $('#results').append('<ul>' + json.map(function(item) {
          return '<li>' + item.user.user_id + '</li>';
        }).join('') + '</ul>');
      },
      error: function(xOptions, textStatus) {
        $('#results').append('<i>error: ' + textStatus + '</i><br>');
      },
      complete: function(xOptions, textStatus) {
        $('#results').append('<i>complete: ' + textStatus + '</i><br>');
      }
    });
    $('#results').append('<i>$.jsonp call finished</i><br>');
  });
});