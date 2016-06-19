// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const jQuery = require('jquery');
const { clipboard } = require('electron');
const shelljs = require('shelljs');

(function ($) {

  var button = $('#search');
  var results = $('#results');
  var searchInput = $('#search-value');

  var executeSearch = function(event){
    event.preventDefault();

    var searchValue = searchInput.val();
    var command = 'cpass ' + searchValue;

    shelljs.exec(command, function(code, stdout){
      var value = stdout;
      var passwordEntries = stdout.split('\n\n');

      let firstPassword = passwordEntries[0].split(' ')[0];
      var output = [];
      output.push("Added first result `" + firstPassword + "` to clipboard");
      output.push('\n\n');
      output.push(stdout);

      results.text(output.join(""));
    });

  }

  button.click(executeSearch);
  searchInput.keyup(function(e){
    if (e.keyCode === 13){
      executeSearch(e);
    }
  });


})(jQuery);
