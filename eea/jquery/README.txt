==========
EEA jQuery
==========
EEA jQuery provides jQuery 1.3.2 and 1.4.2 JS libraries as zope3 resources
and some jQuery plugins like: bbq, browser, cookie, fancybox, galleryview,
jqzoom, qtip, splitter, tagcloud, flashembed and more. Each plugin comes with
its own GenericSetup profile in order to easily use it within your Plone sites.


.. contents::


Installation
============
  * Go to ZMI > portal_setup > Import tab
  * Import all steps from desired EEA jQuery profile.
    - e.g. EEA jQuery Cookie. Now you can use jQuery.cookie within your custom JS libraries.


Usage
=====

.. note ::

  This add-on doesn't do anything by itself. It needs to be integrated by a
  developer within your own products. For reference you can check
  the `eea.tags`_ package.


Authors
=======

  EEA_ - European Environment Agency (EU)

.. _EEA: http://www.eea.europa.eu/
.. _`eea.tags`: http://eea.github.com/docs/eea.tags
