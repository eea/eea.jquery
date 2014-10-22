String.prototype.format = function() {
  var s = this,
      i = arguments.length;

  while (i--) {
    s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
  }
  return s;
};

!function($) {
  $.timeoutDialog = function(options) {

    var settings = {
      title : 'You should save the document!',
      message : 'You didn\'t saved your work for {0}',
      counter: 0,
      delay: 300000,
      dialog_width: 350
    }

    $.extend(settings, options);

    var TimeoutDialog = {
      init: function () {
        this.setupDialogTimer();
      },

      setupDialogTimer: function() {
        var self = this;
        window.setTimeout(function() { self.setupDialog(); }, settings.delay);
      },

      setupDialog: function() {
        var self = this;
        self.destroyDialog();

        $('<div id="timeout-dialog">' +
            '<span class="eea-icon eea-icon-clock-o eea-icon-3x eea-icon-left"></span>' +
            '<p id="timeout-message">' + settings.message.format('<span id="timeout-counter">' + settings.counter + '</span>') +
            ' <span id="timeout-measurement"></span>.</p>' +
            '<p> Document' + self.lastModified() + '.</p>' +
            '</div>')
        .appendTo('body')
        .dialog({
          modal: false,
          width: settings.dialog_width,
          minHeight: 'auto',
          zIndex: 10000,
          closeOnEscape: false,
          draggable: false,
          resizable: false,
          dialogClass: 'timeout-dialog',
          title: settings.title,
          show: {
                  effect: "fade",
                  duration: 1000
                },
          position: { my: "right top", at: "right bottom", of: window },
        });

        self.startCountdown();
      },

      destroyDialog: function() {
        if ($("#timeout-dialog").length) {
          $(this).dialog("close");
          $('#timeout-dialog').remove();
        }
      },

      toHHMMSS: function(seconds) {
        var sec_num = parseInt(seconds, 10);
        var hours   = Math.floor(sec_num / 3600);
        var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
        var seconds = sec_num - (hours * 3600) - (minutes * 60);

        if (hours   < 10) {hours   = "0"+hours;}
        if (minutes < 10) {minutes = "0"+minutes;}
        if (seconds < 10) {seconds = "0"+seconds;}
        var time    = hours+':'+minutes+':'+seconds;
        return time;
      },

      lastModified: function() {
        try {
            data = $(".documentModified").html();
            if (data !== null) {
                return $(".documentModified").html();
            } else {
                return ' could not find last modified information';
            }
        }
        catch(err) {
            console.log('Unable to get the last modified information.');
            return null
        }
      },

      startCountdown: function() {
        var self = this,
            counter = settings.counter + (settings.delay / 1000),
            timeMeasurement = 'seconds';

        this.counter_interval = window.setInterval(function() {
          counter += 1;

          if (counter <= 60) {
              timeMeasurement = 'seconds';
          } else if (counter >= 60 && counter <= 3600) {
              timeMeasurement = 'minutes';
          } else {
              timeMeasurement = 'hours';
          }

          $("#timeout-counter").html(self.toHHMMSS(counter));
          $("#timeout-measurement").html(timeMeasurement);

          if (counter <= 0) {
            window.clearInterval(self.counter);
          }

        }, 1000);
      }
    };

    $.timeoutDialog.reset = function() {
        if ($("#timeout-dialog").length) {
          $('#timeout-dialog').dialog("close");
          window.clearInterval(TimeoutDialog.counter_interval);
          window.setTimeout(function() { $('#timeout-dialog').dialog("open"); TimeoutDialog.startCountdown(); }, settings.delay);
        }
    }

    TimeoutDialog.init();
  };
}(window.jQuery);