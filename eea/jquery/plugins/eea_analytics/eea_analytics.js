/*global jQuery window document ga setTimeout*/
// Plugin definition.
// portions of google analytics code inspired from
// http://cutroni.com/blog/2014/02/12/advanced-content-tracking-with-universal-analytics/
;(function($, window, document, undefined) {
	"use strict";
    var throttle =  window.underscore ? window.underscore.throttle : function(t, e) {
        var n;
        return function() {
            var i, o = this, r = arguments;
            n || (i = function() {
                n = null,
                    t.apply(o, r);
            },
                n = window.setTimeout(i, e));
        };
    };

    var capitalize = function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    $.fn.screentimeAnalytics = function( options ) {
        var opts = $.extend( {}, $.fn.screentimeAnalytics.defaults, options );
        // Our plugin implementation code goes here.

        var looker = null;
        var started;
        var timers = { beginning: 0, content_bottom: 0, page_bottom: 0};
        var content_core = this[0];
        var minReadTime = window.parseInt(Math.round(window.textstatistics(
                    content_core.innerText).wordCount() / opts.avgWPM), 10) * 60;

        // Set some flags for tracking & execution
        var timer;
        var scroller;
        var endContent;
        var didComplete;
        var ptype;

        // Get some information about the current page
        if (!opts.ptype) {
            ptype = $('body').attr('class').match('portaltype-[a-z-]*');
            var ptype_length;
            if (ptype) {
                ptype = ptype[0].split('-');
                ptype_length = ptype.length;
                ptype = ptype_length === 2 ? capitalize(ptype[1]) :
                    capitalize(ptype[1]) + ' ' + capitalize(ptype[2]);
            }
            else {
                ptype = 'Article';
            }
        }

        var incrementTimeSpent = function incrementTimeSpent() {
            $.each(timers, function(key, val) {
                timers[key] = val + 1;
            });

        };
        var startTimers = function startTimers() {
            if (!started) {
                incrementTimeSpent();
                started = true;
            }
            looker = window.setInterval(function() {
                incrementTimeSpent();
            }, 1000);
        };
        var stopTimers = function stopTimers() {
            window.clearInterval(looker);
            looker = null;
        };

        $(window).one("scroll", function() {
            // Set some time variables to calculate reading time
            if (!started) {
                startTimers();
            }

            // Track the article load
            if (!opts.debug) {
                ga('send', 'event', 'Reading', '1 Page Loaded', ptype, {'nonInteraction': 1});
            } else {
                window.console.log('The page has loaded.');
            }

            // Check the location and track user
            var timeToScroll, totalTime, timeToContentEnd;

            function trackLocation() {
                if (!content_core.length) {
                    return;
                }
                var scrollTop = $(window).scrollTop();
                var bottom = Math.round($(window).height() + scrollTop);
                var height = $(document).height();

                // If user starts to scroll send an event
                if (scrollTop > opts.readerLocation && !scroller) {
                    timeToScroll = timers['beginning'];

                    if (!opts.debug) {
                        ga('send', 'event', 'Reading', '2 Started Content Reading', ptype, timeToScroll,
                            {'metric1': timeToScroll, 'metric3': 1});
                    } else {
                        window.console.log('Reached content start in ' + timeToScroll);
                    }
                    scroller = true;
                }

                // If user has hit the bottom of the content send an event
                if (window.innerHeight >= content_core.getBoundingClientRect().bottom && !endContent) {
                    timeToContentEnd = timers['content_bottom'];
                    if (!opts.debug) {
                        if (timeToContentEnd < (minReadTime - opts.readTimeThreshold)) {
                            ga('set', 'dimension1', 'Scanner');
                            ga('send', 'event', 'Reading', '5 Content Scanned', ptype, timeToContentEnd);
                        } else {
                            ga('set', 'dimension1', 'Reader');
                            ga('send', 'event', 'Reading', '6 Content Read', ptype, timeToContentEnd);
                        }
                        ga('send', 'event', 'Reading', '3 Reached Content Bottom', ptype, timeToContentEnd,
                            {'metric2': timeToContentEnd, 'metric4': 1});
                    } else {
                        window.console.log('Reached content section bottom in ' + timeToContentEnd);
                    }
                    endContent = true;
                }

                // If user has hit the bottom of page send an event
                if (bottom >= height - opts.bottomThreshold && !didComplete) {
                    totalTime = timers['page_bottom'];
                    if (!opts.debug) {
                        ga('send', 'event', 'Reading', '4 Reached Page Bottom', ptype, totalTime, {'metric3': totalTime, 'metric6': 1});
                    } else {
                        window.console.log('Reached page bottom in ' + totalTime);
                    }
                    didComplete = true;
                    stopTimers('onvisible');
                }
            }

            // Track the scrolling and track location

            var lazyNavScroll = throttle(function(){
                if (timer) {
                    window.clearTimeout(timer);
                }

                // Use a buffer so we don't call trackLocation too often.
                if (!didComplete) {
                    timer = setTimeout(trackLocation, opts.callBackTime);
                }
                else {
                    timer = null;
                }

            }, opts.throttleTime);
            $(window).scroll(lazyNavScroll);
        });

        if (document.hasFocus && document.hasFocus()) {
            $(window).trigger('scroll');
        }
        if (window.visibly) {
            window.visibly.onHidden(function() {
                if (!didComplete) {
                    stopTimers('onhidden');
                }
            });
            window.visibly.onVisible(function() {
                if (!didComplete) {
                    stopTimers('onvisible');
                    startTimers('onvisible');
                }
            });
        }
    };

    // Plugin defaults – added as a property on our plugin function.
    $.fn.screentimeAnalytics.defaults = {
        debug: false,
        callBackTime: 100, // Default time delay before checking location
        readerLocation: 100, // # px before tracking a reader
        throttleTime: 100, // Default time delay before checking scroll event
        avgWPM: 228, // average words per minute
        readTimeThreshold: 30, // buffer to treat spent time as read time in seconds
        bottomThreshold: 50,
        ptype: null // portal type used as the google analytics event action label
    };

})(jQuery, window, document);
