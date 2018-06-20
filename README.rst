==========
EEA jQuery
==========
.. image:: https://ci.eionet.europa.eu/buildStatus/icon?job=eea/eea.jquery/develop
  :target: https://ci.eionet.europa.eu/job/eea/job/eea.jquery/job/develop/display/redirect
  :alt: develop
.. image:: https://ci.eionet.europa.eu/buildStatus/icon?job=eea/eea.jquery/master
  :target: https://ci.eionet.europa.eu/job/eea/job/eea.jquery/job/master/display/redirect
  :alt: master

Introduction
============

EEA jQuery provides jQuery 1.3.2 and 1.4.2 JS libraries as zope3 resources
and some jQuery plugins like: annotator, bbq, browser, cookie, fancybox,
galleryview, jqzoom, qtip, splitter, tagcloud, flashembed and more.

Each plugin comes with its own GenericSetup profile in order to easily use it
within your Plone sites.

.. note ::

  This add-on doesn't do anything by itself. It needs to be integrated by a
  developer within your own products. For reference you can check
  the `eea.tags`_ package.


.. contents::


Installation
============

zc.buildout
-----------
If you are using `zc.buildout`_ and the `plone.recipe.zope2instance`_
recipe to manage your project, you can do this:

* Update your buildout.cfg file:

  * Add ``eea.jquery`` to the list of eggs to install
  * Tell the `plone.recipe.zope2instance`_ recipe to install a ZCML slug

  ::

    [instance]
    ...
    eggs =
      ...
      eea.jquery

    zcml =
      ...
      eea.jquery

* Re-run buildout, e.g. with::

  $ ./bin/buildout

You can skip the ZCML slug if you are going to explicitly include the package
from another package's configure.zcml file.

Dependencies
============

`EEA jQuery`_ has the following dependencies:
  - collective.js.jqueryui

Source code
===========

- `Plone Collective on Github <https://github.com/collective/eea.jquery>`_
- `EEA on Github <https://github.com/eea/eea.jquery>`_


Plugins documentation
=====================

`eea_screentimeanalytics`_ An EEA's developed google analytics plugin that
can tell you, exactly, how many users are reading for real the content of
a webpage. Reading is detecting by catching they scroll events versus
the time needed to read the actual content (average reader speed is around
200 words per minute) and reaches the bottom of the page. If they reaches
the bottom of the page too fast they are categorized as scanner.


Copyright and license
=====================
The Initial Owner of the Original Code is European Environment Agency (EEA).
All Rights Reserved.

The EEA jQuery (the Original Code) is free software;
you can redistribute it and/or modify it under the terms of the GNU
General Public License as published by the Free Software Foundation;
either version 2 of the License, or (at your option) any later
version.

Contributor(s):
---------------

- Alin Voinea (Eau de Web)
- Antonio De Marinis (European Environment Agency)
- Alec Ghica (Eau de Web)
- Sasha Vincic (Valentine Web Systems)
- Mathieu Le Marec - Pasquet (kiorky) (Makina Corpus)

Credits:
--------

- Peter Holzer (Agitator)


More details under docs/License.txt

Funding
=======

EEA_ - European Environment Agency (EU)

.. _EEA: https://www.eea.europa.eu/
.. _`eea.tags`: https://eea.github.com/docs/eea.tags
.. _`eea_screentimeanalytics`: https://github.com/collective/eea.jquery/tree/master/eea/jquery/plugins/eea_screentimeanalytics/docs
.. _`plone.recipe.zope2instance`: https://pypi.python.org/pypi/plone.recipe.zope2instance
.. _`zc.buildout`: https://pypi.python.org/pypi/zc.buildout
