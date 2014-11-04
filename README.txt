==========
EEA jQuery
==========
.. image:: http://ci.eionet.europa.eu/job/eea.jquery-www/badge/icon
  :target: http://ci.eionet.europa.eu/job/eea.jquery-www/lastBuild
.. image:: http://ci.eionet.europa.eu/job/eea.jquery-plone4/badge/icon
  :target: http://ci.eionet.europa.eu/job/eea.jquery-plone4/lastBuild
.. image:: http://ci.eionet.europa.eu/job/eea.jquery-zope/badge/icon
  :target: http://ci.eionet.europa.eu/job/eea.jquery-zope/lastBuild

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

.. _EEA: http://www.eea.europa.eu/
.. _`eea.tags`: http://eea.github.com/docs/eea.tags
.. _`plone.recipe.zope2instance`: http://pypi.python.org/pypi/plone.recipe.zope2instance
.. _`zc.buildout`: http://pypi.python.org/pypi/zc.buildout
