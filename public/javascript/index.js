var editor, statusline, savebutton, idletimer;

$(function() {
  status('Starting onload function');
  if (localStorage.note === undefined) {
    status('Nothing in localStorage');
    localStorage.note = "";
  } else {
    status('Note exists in localStorage: ' + inspect(localStorage.note));
  }
  if (localStorage.lastModified === undefined) {
    localStorage.lastModified = 0;
  }
  if (localStorage.lastSaved === undefined) {
    localStorage.lastSaved = 0;
  }

  editor = document.getElementById('editor');
  statusLine = document.getElementById('statusLine');
  saveButton = document.getElementById('saveButton');

  editor.value = localStorage.note;
  editor.disabled = true;
  editor.addEventListener('input', function() {
    localStorage.note = editor.value;
    localStorage.lastModified = Date.now();
    if (idletimer) clearTimeout(idletimer);
    idletimer = setTimeout(save, 5000);
    saveButton.disabled = false;
  });
  status('Starting first sync from onload function');
  sync();
});

window.onbeforeunload = function() {
  if (localStorage.lastModified > localStorage.lastSaved) save();
};

window.onoffline = function() {
  status('Went offline');
};

window.ononline = function() {
  status('Went online; starting sync');
  sync();
};

window.applicationCache.onupdateready = function() {
  status('A new version of this application is ready. Reload to run it.');
};

window.applicationCache.onnoupdate = function() {
  status('You are running the latest version of this application');
};

function status(msg) {
  $(statusLine).append(msg + '<br>');
}

function save() {
  status('Save requested');
  if (idletimer) clearTimeout(idletimer);
  idletimer = null;

  if (navigator.onLine) {
    status('Saving while online');
    $.post('/note', {'note': editor.value}, function() {
      localStorage.lastSaved = Date.now();
      saveButton.disabled = true;
      status('Save completed successfully');
    });
  } else {
    status('Not online: cannot save on server');
  }
}

function sync() {
  if (navigator.onLine) {
    status('Syncing');
    $.get('/note', function(data, textStatus, jqXHR) {
      status('Get of note status: ' + textStatus);
      remoteModTime = jqXHR.getResponseHeader('Last-Modified');
      remoteModTime = new Date(remoteModTime).getTime();
      status('Server Last Modified: ' + inspect(remoteModTime));
      status('Local Last Modified: ' + inspect(localStorage.lastModified));
      if (remoteModTime > localStorage.lastModified) {
        status('Newer note found on server');
        var useIt = confirm('There is a newer version of the note\n' +
                            'on the server. Click OK to use that version\n' +
                            'or click Cancel to continue editing this\n' +
                            'version and overwrite the server.');
        var now = Date.now();
        if (useIt) {
          editor.value = localStorage.note = jqXHR.responseText;
          localStorage.lastSaved = now;
          status('Using server version of the note');
        } else {
          status('Ignoring server version of the note');
        }
        localStorage.lastModified = now;
      } else {
        status('You are editing the current version of the note');
      }
      if (localStorage.lastModified > localStorage.lastSaved) {
        save();
      }
      editor.disabled = false;
      editor.focus();
    });
  } else {
    status('Cannot sync while offline');
    editor.disabled = false;
    editor.focus();
  }
}
