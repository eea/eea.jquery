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
      timeout: 1200,
      countdown: 60,
      title : 'You should save your work!',
      message : 'You didn\'t saved your work for {0} seconds.',
      question: '',
      keep_alive_button_text: 'Yes, Keep me signed in',
      sign_out_button_text: 'No, Sign me out',
      keep_alive_url: '/keep-alive',
      logout_url: null,
      logout_redirect_url: '/',
      restart_on_yes: true,
      dialog_width: 350
    }

    $.extend(settings, options);

    var TimeoutDialog = {
      init: function () {
        this.setupDialogTimer();
      },

      setupDialogTimer: function() {
        var self = this;
        window.setTimeout(function() {
           self.setupDialog();
        }, (settings.timeout - settings.countdown) * 1000);
      },

      setupDialog: function() {
        var self = this;
        self.destroyDialog();

        $('<div id="timeout-dialog">' +
            '<span class="eea-icon eea-icon-clock-o eea-icon-3x eea-icon-left"></span>' +
            '<p id="timeout-message">' + settings.message.format('<span id="timeout-countdown">' + settings.countdown + '</span>') + '</p>' +
            '<p id="timeout-question">' + settings.question + '</p>' +
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



/*
          buttons : {
            'keep-alive-button' : {
              text: settings.keep_alive_button_text,
              id: "timeout-keep-signin-btn",
              click: function() {
                self.keepAlive();
              }
            },
            'sign-out-button' : {
              text: settings.sign_out_button_text,
              id: "timeout-sign-out-button",
              click: function() {
                self.signOut(true);
              }
            }
          }
*/

        });

        self.startCountdown();
      },

      destroyDialog: function() {
        if ($("#timeout-dialog").length) {
          $(this).dialog("close");
          $('#timeout-dialog').remove();
        }
      },

      startCountdown: function() {
        var self = this,
            counter = settings.countdown;

        this.countdown = window.setInterval(function() {
          counter -= 1;
          $("#timeout-countdown").html(counter);

          if (counter <= 0) {
            window.clearInterval(self.countdown);
            self.signOut(false);
          }

        }, 1000);
      },

      keepAlive: function() {
        var self = this;
        this.destroyDialog();
        window.clearInterval(this.countdown);

        $.get(settings.keep_alive_url, function(data) {
          if (data == "OK") {
            if (settings.restart_on_yes) {
              self.setupDialogTimer();
            }
          }
          else {
            self.signOut(false);
          }
        });
      },

      signOut: function(is_forced) {
        var self = this;
        this.destroyDialog();

        if (settings.logout_url != null) {
            $.post(settings.logout_url, function(data){
                self.redirectLogout(is_forced);
            });
        }
        else {
            self.redirectLogout(is_forced);
        }
      },

      redirectLogout: function(is_forced){
        var target = settings.logout_redirect_url + '?next=' + encodeURIComponent(window.location.pathname + window.location.search);
        if (!is_forced)
          target += '&timeout=t';
        window.location = target;
      }
    };

    TimeoutDialog.init();
  };
}(window.jQuery);