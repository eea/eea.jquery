/*global jQuery window document ga _paq setTimeout*/

/*!
 * visibly - v0.7 Page Visibility API Polyfill
 * https://github.com/addyosmani
 * Copyright (c) 2011-2014 Addy Osmani
 * Dual licensed under the MIT and GPL licenses.
 *
 * Methods supported:
 * visibly.onVisible(callback)
 * visibly.onHidden(callback)
 * visibly.hidden()
 * visibly.visibilityState()
 * visibly.visibilitychange(callback(state));
 */

// Matomo support
var _paq = _paq || [];

(function () {

    window.visibly = {
        q: document,
        p: undefined,
        prefixes: ['webkit', 'ms', 'o', 'moz', 'khtml'],
        props: ['VisibilityState', 'visibilitychange', 'Hidden'],
        m: ['focus', 'blur'],
        visibleCallbacks: [],
        hiddenCallbacks: [],
        genericCallbacks: [],
        _callbacks: [],
        cachedPrefix: "",
        fn: null,

        onVisible: function (_callback) {
            if (typeof _callback == 'function') {
                this.visibleCallbacks.push(_callback);
            }
        },
        onHidden: function (_callback) {
            if (typeof _callback == 'function') {
                this.hiddenCallbacks.push(_callback);
            }
        },
        getPrefix: function () {
            if (!this.cachedPrefix) {
                for (var l = 0, b; b = this.prefixes[l++];) {
                    if (b + this.props[2] in this.q) {
                        this.cachedPrefix = b;
                        return this.cachedPrefix;
                    }
                }
            }
        },

        visibilityState: function () {
            return this._getProp(0);
        },
        hidden: function () {
            return this._getProp(2);
        },
        visibilitychange: function (fn) {
            if (typeof fn == 'function') {
                this.genericCallbacks.push(fn);
            }

            var n = this.genericCallbacks.length;
            if (n) {
                if (this.cachedPrefix) {
                    while (n--) {
                        this.genericCallbacks[n].call(this, this.visibilityState());
                    }
                } else {
                    while (n--) {
                        this.genericCallbacks[n].call(this, arguments[0]);
                    }
                }
            }

        },
        isSupported: function (index) {
            return ((this._getPropName(2)) in this.q);
        },
        _getPropName: function (index) {
            return (this.cachedPrefix == "" ? this.props[index].substring(0, 1).toLowerCase() + this.props[index].substring(1) : this.cachedPrefix + this.props[index]);
        },
        _getProp: function (index) {
            return this.q[this._getPropName(index)];
        },
        _execute: function (index) {
            if (index) {
                this._callbacks = (index == 1) ? this.visibleCallbacks : this.hiddenCallbacks;
                var n = this._callbacks.length;
                while (n--) {
                    this._callbacks[n]();
                }
            }
        },
        _visible: function () {
            window.visibly._execute(1);
            window.visibly.visibilitychange.call(window.visibly, 'visible');
        },
        _hidden: function () {
            window.visibly._execute(2);
            window.visibly.visibilitychange.call(window.visibly, 'hidden');
        },
        _nativeSwitch: function () {
            this[this._getProp(2) ? '_hidden' : '_visible']();
        },
        _listen: function () {
            try { /*if no native page visibility support found..*/
                if (!(this.isSupported())) {
                    if (this.q.addEventListener) { /*for browsers without focusin/out support eg. firefox, opera use focus/blur*/
                        window.addEventListener(this.m[0], this._visible, 1);
                        window.addEventListener(this.m[1], this._hidden, 1);
                    } else { /*IE <10s most reliable focus events are onfocusin/onfocusout*/
                        if (this.q.attachEvent) {
                            this.q.attachEvent('onfocusin', this._visible);
                            this.q.attachEvent('onfocusout', this._hidden);
                        }
                    }
                } else { /*switch support based on prefix detected earlier*/
                    this.q.addEventListener(this._getPropName(1), function () {
                        window.visibly._nativeSwitch.apply(window.visibly, arguments);
                    }, 1);
                }
            } catch (e) { }
        },
        init: function () {
            this.getPrefix();
            this._listen();
        }
    };

    this.visibly.init();
})();



// TextStatistics.js
// Christopher Giffard (2012)
// 1:1 API Fork of TextStatistics.php by Dave Child (Thanks mate!)
// https://github.com/DaveChild/Text-Statistics


(function (glob) {

    function cleanText(text) {
        // all these tags should be preceeded by a full stop.
        var fullStopTags = ['li', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'dd'];

        fullStopTags.forEach(function (tag) {
            text = text.replace("</" + tag + ">", ".");
        });

        text = text.replace(/<[^>]+>/g, "") // Strip tags
            .replace(/[,:;()\/&+]|\-\-/g, " ") // Replace commas, hyphens etc (count them as spaces)
            .replace(/[\.!?]/g, ".") // Unify terminators
            .replace(/^\s+/, "") // Strip leading whitespace
            .replace(/[\.]?(\w+)[\.]?(\w+)@(\w+)[\.](\w+)[\.]?/g, "$1$2@$3$4") // strip periods in email addresses (so they remain counted as one word)
            .replace(/[ ]*(\n|\r\n|\r)[ ]*/g, ".") // Replace new lines with periods
            .replace(/([\.])[\.]+/g, ".") // Check for duplicated terminators
            .replace(/[ ]*([\.])/g, ". ") // Pad sentence terminators
            .replace(/\s+/g, " ") // Remove multiple spaces
            .replace(/\s+$/, ""); // Strip trailing whitespace

        if (text.slice(-1) != '.') {
            text += "."; // Add final terminator, just in case it's missing.
        }
        return text;
    }

    var TextStatistics = function TextStatistics(text) {
        this.text = text ? cleanText(text) : "";
    };

    TextStatistics.prototype.fleschKincaidReadingEase = function (text) {
        text = text ? cleanText(text) : this.text;
        return Math.round((206.835 - (1.015 * this.averageWordsPerSentence(text)) - (84.6 * this.averageSyllablesPerWord(text))) * 10) / 10;
    };

    TextStatistics.prototype.fleschKincaidGradeLevel = function (text) {
        text = text ? cleanText(text) : this.text;
        return Math.round(((0.39 * this.averageWordsPerSentence(text)) + (11.8 * this.averageSyllablesPerWord(text)) - 15.59) * 10) / 10;
    };

    TextStatistics.prototype.gunningFogScore = function (text) {
        text = text ? cleanText(text) : this.text;
        return Math.round(((this.averageWordsPerSentence(text) + this.percentageWordsWithThreeSyllables(text, false)) * 0.4) * 10) / 10;
    };

    TextStatistics.prototype.colemanLiauIndex = function (text) {
        text = text ? cleanText(text) : this.text;
        return Math.round(((5.89 * (this.letterCount(text) / this.wordCount(text))) - (0.3 * (this.sentenceCount(text) / this.wordCount(text))) - 15.8) * 10) / 10;
    };

    TextStatistics.prototype.smogIndex = function (text) {
        text = text ? cleanText(text) : this.text;
        return Math.round(1.043 * Math.sqrt((this.wordsWithThreeSyllables(text) * (30 / this.sentenceCount(text))) + 3.1291) * 10) / 10;
    };

    TextStatistics.prototype.automatedReadabilityIndex = function (text) {
        text = text ? cleanText(text) : this.text;
        return Math.round(((4.71 * (this.letterCount(text) / this.wordCount(text))) + (0.5 * (this.wordCount(text) / this.sentenceCount(text))) - 21.43) * 10) / 10;
    };

    TextStatistics.prototype.textLength = function (text) {
        text = text ? cleanText(text) : this.text;
        return text.length;
    };

    TextStatistics.prototype.letterCount = function (text) {
        text = text ? cleanText(text) : this.text;
        text = text.replace(/[^a-z]+/ig, "");
        return text.length;
    };

    TextStatistics.prototype.sentenceCount = function (text) {
        text = text ? cleanText(text) : this.text;

        // Will be tripped up by "Mr." or "U.K.". Not a major concern at this point.
        return text.replace(/[^\.!?]/g, '').length || 1;
    };

    TextStatistics.prototype.wordCount = function (text) {
        text = text ? cleanText(text) : this.text;
        return text.split(/[^a-z0-9\'@\.\-]+/i).length || 1;
    };

    TextStatistics.prototype.averageWordsPerSentence = function (text) {
        text = text ? cleanText(text) : this.text;
        return this.wordCount(text) / this.sentenceCount(text);
    };

    TextStatistics.prototype.averageCharactersPerWord = function (text) {
        var txt = text ? this.cleanText(text) : this.text;
        return this.letterCount(txt) / this.wordCount(txt);
    };

    TextStatistics.prototype.averageSyllablesPerWord = function (text) {
        text = text ? cleanText(text) : this.text;
        var syllableCount = 0,
            wordCount = this.wordCount(text),
            self = this;

        text.split(/\s+/).forEach(function (word) {
            syllableCount += self.syllableCount(word);
        });

        // Prevent NaN...
        return (syllableCount || 1) / (wordCount || 1);
    };

    TextStatistics.prototype.wordsWithThreeSyllables = function (text, countProperNouns) {
        text = text ? cleanText(text) : this.text;
        var longWordCount = 0,
            self = this;

        countProperNouns = countProperNouns === false ? false : true;

        text.split(/\s+/).forEach(function (word) {

            // We don't count proper nouns or capitalised words if the countProperNouns attribute is set.
            // Defaults to true.
            if (!word.match(/^[A-Z]/) || countProperNouns) {
                if (self.syllableCount(word) > 2) {
                    longWordCount++;
                }
            }
        });

        return longWordCount;
    };

    TextStatistics.prototype.percentageWordsWithThreeSyllables = function (text, countProperNouns) {
        text = text ? cleanText(text) : this.text;

        return (this.wordsWithThreeSyllables(text, countProperNouns) / this.wordCount(text)) * 100;
    };

    TextStatistics.prototype.syllableCount = function (word) {
        var syllableCount = 0,
            prefixSuffixCount = 0,
            wordPartCount = 0;

        // Prepare word - make lower case and remove non-word characters
        word = word.toLowerCase().replace(/[^a-z]/g, "");

        // Specific common exceptions that don't follow the rule set below are handled individually
        // Array of problem words (with word as key, syllable count as value)
        var problemWords = {
            "simile": 3,
            "forever": 3,
            "shoreline": 2
        };

        // Return if we've hit one of those...
        if (problemWords.hasOwnProperty(word)) {
            return problemWords[word];
        }

        // These syllables would be counted as two but should be one
        var subSyllables = [/cial/, /tia/, /cius/, /cious/, /giu/, /ion/, /iou/, /sia$/, /[^aeiuoyt]{2,}ed$/, /.ely$/, /[cg]h?e[rsd]?$/, /rved?$/, /[aeiouy][dt]es?$/, /[aeiouy][^aeiouydt]e[rsd]?$/, /^[dr]e[aeiou][^aeiou]+$/, // Sorts out deal, deign etc
            /[aeiouy]rse$/ // Purse, hearse
        ];

        // These syllables would be counted as one but should be two
        var addSyllables = [/ia/, /riet/, /dien/, /iu/, /io/, /ii/, /[aeiouym]bl$/, /[aeiou]{3}/, /^mc/, /ism$/, /([^aeiouy])\1l$/, /[^l]lien/, /^coa[dglx]./, /[^gq]ua[^auieo]/, /dnt$/, /uity$/, /ie(r|st)$/];

        // Single syllable prefixes and suffixes
        var prefixSuffix = [/^un/, /^fore/, /ly$/, /less$/, /ful$/, /ers?$/, /ings?$/];

        // Remove prefixes and suffixes and count how many were taken
        prefixSuffix.forEach(function (regex) {
            if (word.match(regex)) {
                word = word.replace(regex, "");
                prefixSuffixCount++;
            }
        });

        wordPartCount = word.split(/[^aeiouy]+/ig)
            .filter(function (wordPart) {
                return !!wordPart.replace(/\s+/ig, "").length;
            })
            .length;

        // Get preliminary syllable count...
        syllableCount = wordPartCount + prefixSuffixCount;

        // Some syllables do not follow normal rules - check for them
        subSyllables.forEach(function (syllable) {
            if (word.match(syllable)) {
                syllableCount--;
            }
        });

        addSyllables.forEach(function (syllable) {
            if (word.match(syllable)) {
                syllableCount++;
            }
        });

        return syllableCount || 1;
    };

    function textStatistics(text) {
        return new TextStatistics(text);
    }

    (typeof module != "undefined" && module.exports) ? (module.exports = textStatistics) : (typeof define != "undefined" ? (define("textstatistics", [], function () {
        return textStatistics;
    })) : (glob.textstatistics = textStatistics));
})(this);

// Plugin definition.
// portions of google analytics code inspired from
// http://cutroni.com/blog/2014/02/12/advanced-content-tracking-with-universal-analytics/
(function ($, window, document, undefined) {
    "use strict";

    var throttle = window.underscore ? window.underscore.throttle : function (t, e) {
        var n;
        return function () {
            var i, o = this, r = arguments;
            n || (i = function () {
                n = null,
                    t.apply(o, r);
            },
                n = window.setTimeout(i, e));
        };
    };

    var capitalize = function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    };

    $.fn.screentimeAnalytics = function (options) {
        var opts = $.extend({}, $.fn.screentimeAnalytics.defaults, options);
        // Our plugin implementation code goes here.

        var looker, content_looker;
        var started;
        var timers = { beginning: 0, content_bottom: 0, page_bottom: 0 };
        var counter = { content: 0 };
        var content_core = this[0];
        if (!content_core) {
            return;
        }
        var minReadTime = window.parseInt(Math.round(window.textstatistics(
            content_core.innerText).wordCount() / opts.avgWPM), 10) * 60;
        var start_obj_metrics = {}, content_obj_metrics = {}, page_obj_metrics = {};
        var reached_content_bottom = opts.metrics['reached_content_bottom'];
        var content_bottom = opts.metrics['content_bottom'];
        var reached_page_bottom = opts.metrics['reached_page_bottom'];
        var page_bottom = opts.metrics['page_bottom'];

        // Set some flags for tracking & execution
        var timer;
        var scroller;
        var endContent;
        var didComplete;
        var ptype;
        var sentPageTrack;
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
            $.each(timers, function (key, val) {
                timers[key] = val + 1;
            });

        };
        var startTimers = function startTimers() {
            if (!started) {
                incrementTimeSpent();
                started = true;
            }
            looker = window.setInterval(function () {
                incrementTimeSpent();
            }, 1000);
        };

        // viewport and onScreen functionality taken from
        // https://github.com/robflaherty/screentime/blob/master/screentime.js
        function Viewport() {
            this.top = $window.scrollTop();
            this.height = $window.height();
            this.bottom = this.top + this.height;
            this.width = $window.width();
        }

        function Field(elem) {
            var $elem = $(elem);
            this.top = $elem.offset().top;
            this.height = $elem.height();
            this.bottom = this.top + this.height;
            this.width = $elem.width();
        }

        function onScreen(viewport, field) {
            var cond, buffered, partialView;

            // Field entirely within viewport
            if ((field.bottom <= viewport.bottom) && (field.top >= viewport.top)) {
                return true;
            }

            // Field bigger than viewport
            if (field.height > viewport.height) {

                cond = (viewport.bottom - field.top) > (viewport.height / 2) && (field.bottom - viewport.top) > (viewport.height / 2);

                if (cond) {
                    return true;
                }

            }

            // Partially in view
            buffered = (field.height * (opts.percentOnScreen / 100));
            partialView = ((viewport.bottom - buffered) >= field.top && (field.bottom - buffered) > viewport.top);

            return partialView;
        }

        function checkViewport() {
            var viewport = new Viewport();
            var field = new Field(content_core);
            if (onScreen(viewport, field)) {
                counter['content'] += 1;
            }
        }

        var startContentReading = function startTimers() {
            if (!started) {
                checkViewport();
                started = true;
            }
            content_looker = window.setInterval(function () {
                checkViewport();
            }, 1000);
        };

        var stopTimers = function stopTimers() {
            window.clearInterval(looker);
            looker = null;
        };

        var stopContentReading = function startTimers() {
            window.clearInterval(content_looker);
            content_looker = null;
        };
        var $window = $(window);
        var $document = $(document);

        $window.one("scroll", function () {
            // Set some time variables to calculate reading time
            if (!started) {
                startTimers();
                startContentReading();
            }

            // Track the article load
            if (!opts.debug) {
                if (window.ga) {
                    ga('send', 'event', 'Reading', '1 Page Loaded', ptype, { 'nonInteraction': 1 });
                }
                _paq.push(['trackEvent', 'Reading', 'load', ptype, 1]);
            } else {
                window.console.log('The page has loaded.');
            }

            // Check the location and track user
            var timeToScroll, totalTime, timeToContentEnd;

            function trackLocation() {
                var scrollTop = $window.scrollTop();
                var bottom = Math.round($window.height() + scrollTop);
                var height = $document.height();

                // If user starts to scroll send an event
                if (scrollTop > opts.readerLocation && !scroller) {
                    timeToScroll = timers['beginning'];

                    if (!opts.debug) {
                        if (window.ga) {
                            start_obj_metrics[opts.metrics['started_reading']] = timeToScroll;
                            start_obj_metrics[opts.metrics['start_reading']] = 1;
                            ga('set', start_obj_metrics);
                            ga('send', 'event', 'Reading', '2 Started Content Reading', ptype, timeToScroll);
                        }
                        _paq.push(['setCustomVariable', 1, 'Reading: Started Content Reading', timeToScroll, 'page']);
                        _paq.push(['trackEvent', 'Reading', 'start', ptype, timeToScroll]);
                    } else {
                        window.console.log('Reached content start in ' + timeToScroll);
                    }
                    scroller = true;
                }

                // If user has hit the bottom of the content send an event
                if (window.innerHeight >= (content_core.getBoundingClientRect().bottom + opts.bottomThreshold) && !endContent) {
                    timeToContentEnd = timers['content_bottom'];
                    if (!opts.debug) {
                        if (timeToContentEnd < (minReadTime - opts.readTimeThreshold)) {
                            if (window.ga) {
                                ga('set', 'dimension1', 'Scanner');
                                ga('send', 'event', 'Reading', '5 Content Scanned', ptype, timeToContentEnd);
                            }
                            _paq.push(['setCustomDimension', 1, 'scanner']);
                            _paq.push(['trackEvent', 'Reading', 'scan', ptype, timeToContentEnd]);
                        } else {
                            if (window.ga) {
                                ga('set', 'dimension1', 'Reader');
                            }
                            _paq.push(['setCustomDimension', 1, 'reader']);
                            if (!sentPageTrack) {
                                sentPageTrack = true;
                                if (window.ga) {
                                    ga('send', 'pageview', window.location.pathname);
                                }
                                _paq.push(['setCustomUrl', window.location.pathname]);
                                _paq.push(['trackPageView']);
                            }
                            if (window.ga) {
                                ga('send', 'event', 'Reading', '6 Content Read', ptype, timeToContentEnd);
                            }
                            _paq.push(['trackEvent', 'Reading', 'read', ptype, timeToContentEnd]);
                        }
                        if (reached_content_bottom) {
                            if (window.ga) {
                                ga('set', reached_content_bottom, timeToContentEnd);
                            }
                            _paq.push(['setCustomVariable', 2, 'Reading: Reached Content Bottom', timeToContentEnd, 'page']);
                        }
                        if (content_bottom) {
                            if (window.ga) {
                                ga('set', content_bottom, 1);
                            }
                        }
                        if (window.ga) {
                            ga('send', 'event', 'Reading', '3 Reached Content Bottom', ptype, timeToContentEnd);
                        }
                        _paq.push(['trackEvent', 'Reading part', 'content body read', ptype, timeToContentEnd]);
                    } else {
                        window.console.log('Reached content section bottom in ' + timeToContentEnd);
                    }
                    endContent = true;
                }

                // If user has hit the bottom of page send an event
                if (bottom >= height - opts.bottomThreshold && !didComplete) {
                    totalTime = timers['page_bottom'];
                    if (!opts.debug) {
                        if (reached_page_bottom) {
                            page_obj_metrics[reached_page_bottom] = totalTime;
                        }
                        if (page_bottom) {
                            page_obj_metrics[page_bottom] = 1;
                        }
                        if (window.ga) {
                            ga('set', page_obj_metrics);
                            ga('send', 'event', 'Reading', '4 Reached Page Bottom', ptype, totalTime);
                        }
                        _paq.push(['setCustomVariable', 3, 'Reading: Reached Page Bottom', totalTime, 'page']);
                        _paq.push(['trackEvent', 'Reading part', 'page footer seen', ptype, totalTime]);
                    } else {
                        window.console.log('Reached page bottom in ' + totalTime);
                    }
                    didComplete = true;
                    stopTimers('onvisible');
                }
            }

            var lazyNavScroll = throttle(function () {
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
            $window.scroll(lazyNavScroll);
        });

        if (document.hasFocus && document.hasFocus()) {
            $window.trigger('scroll');
        }
        if (window.visibly) {
            window.visibly.onHidden(function () {
                if (!didComplete) {
                    stopTimers();
                }
                stopContentReading();
            });
            window.visibly.onVisible(function () {
                if (!didComplete) {
                    stopTimers();
                    startTimers();
                }
                stopContentReading();
                startContentReading();
            });
        }

        window.onbeforeunload = function () {
            var content_time = counter['content'];
            if (window.ga) {
                ga('send', 'event', 'Reading', '7 Content area time spent', ptype, content_time);
            }
            _paq.push(['trackEvent', 'Reading time', 'total', ptype, content_time]);

            var timeToread = minReadTime - opts.readTimeThreshold;
            if (content_time > timeToread && endContent) {
                if (window.ga) {
                    ga('set', 'dimension1', 'Reader');
                    ga('send', 'event', 'Reading', '9 Content Area Reader', ptype, content_time);
                }
                _paq.push(['setCustomDimension', 1, 'reader']);
                _paq.push(['trackEvent', 'Reading type', 'reader', ptype, content_time]);
            } else {
                if (window.ga) {
                    ga('set', 'dimension1', 'Scanner');
                    ga('send', 'event', 'Reading', '8 Content Area Scanner', ptype, content_time);
                }
                _paq.push(['setCustomDimension', 1, 'scanner']);
                _paq.push(['trackEvent', 'Reading type', 'scanner', ptype, content_time]);
            }
        };
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
        percentOnScreen: 7,
        ptype: null, // portal type used as the google analytics event action label
        // calculated from body class portaltype entry otherwise default to
        // Article. Pass another string entry if you have another way
        // to calculate the portal type or you want another label for the action
        metrics: { // define your metric mapping in case you already have analytics metrics
            // override this mapping in case you have no free metrics in order
            // to avoid recieving hits from this plugin
            'started_reading': 'metric1',
            'reached_content_bottom': 'metric2',
            'reached_page_bottom': 'metric3',
            'start_reading': 'metric4',
            'content_bottom': 'metric5',
            'page_bottom': 'metric6'
        }
    };

})(jQuery, window, document);
