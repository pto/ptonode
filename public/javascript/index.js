var editor, statusline, savebutton, idletimer;

window.onload = function() {
  if (localStorage.note == null) localStorage.note = "";
  if (localStorage.lastModified == null) localStorage.lastModified = 0;
  if (localStorage.lastSaved == null) localStorage.lastSaved = 0;

  editor = document.getElementById('editor');
  statusline = document.getElementById('statusline');
  savebutton = document.getElementById('savebutton');

  editor.value = localStorage.note;
  editor.disabled = true;
  editor.addEventListener('input', function() {
    localStorage.note = editor.val();
    localStorage.lastModified = Date.now();
    if (idletimer) clearTimeout(idletimer);
    idletimer = setTimeout(save, 5000);
    savebutton.disabled = false;
  });
  sync();
};

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
  $(statusline).append(msg + '<br>');
}

function save() {
  status('Save requested');
  if (idletimer) clearTimeout(idletimer);
  idletimer = null;

  if (navigator.onLine) {
    status('Saving while online');
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', '/note');
    xhr.send(editor.value);
    xhr.onload = function() {
      localStorage.lastSaved = Date.now();
      savebutton.disabled = true;
      status('Save completed');
    };
  } else {
    status('Not online: cannot save on server');
  }
}

function sync() {
  if (navigator.onLine) {
    status('Syncing');
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/note');
    xhr.send();
    xhr.onload = function() {
      var remoteModTime = 0;
      if (xhr.status === 200) {
        var remoteModeTime = xhr.getResponseHeader('Last-Modified');
        remoteModTime = new Date(remoteModTime).getTime();
      }
      if (remoteModTime > localStorage.lastModified) {
        status('Newer note found on server');
        var useit = confirm('There is a newer version of the note\n' +
                            'on the server. Click OK to use that version\n' +
                            'or click Cancel to continue editing this\n' +
                            'version and overwrite the server.');
        var now = Date.now();
        if (useit) {
          editor.value = localStorage.note = xhr.responseText;
          localStorage.lastSaved = now;
          status('Newest version downloaded');
        } else {
          status('Ignoring newer version of the note');
        }
        localStorage.lastModified = now;
      } else {
        status('You are editing the current version of the note');
      }
      if (localStorage.lastModified > localStorage.lastSaved) save();
      editor.disabled = false;
      editor.focus();
    }
  } else {
    status('Cannot sync while offline');
    editor.disabled = false;
    editor.focus();
  }
}
