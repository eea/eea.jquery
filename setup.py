""" EEA JQuery Installer
"""
import os
from os.path import join
from setuptools import setup, find_packages

NAME = 'eea.jquery'
PATH = NAME.split('.') + ['version.txt']
VERSION = open(join(*PATH)).read().strip()

setup(name=NAME,
      version=VERSION,
      description="jQuery library and plugins for Plone",
      long_description=open("README.txt").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      classifiers=[
          "Framework :: Zope2",
          "Framework :: Zope3",
          "Framework :: Plone",
          "Framework :: Plone :: 4.0",
          "Framework :: Plone :: 4.1",
          "Framework :: Plone :: 4.2",
          "Programming Language :: Zope",
          "Programming Language :: Python",
          "Topic :: Software Development :: Libraries :: Python Modules",
          "License :: OSI Approved :: GNU General Public License (GPL)",
        ],
      keywords='eea jquery plugins plone zope3',
      author='European Environment Agency',
      author_email="webadmin@eea.europa.eu",
      maintainer='Alin Voinea (Eau de Web)',
      maintainer_email='alin@eaudeweb.ro',
      download_url="http://pypi.python.org/pypi/eea.jquery",
      url='http://eea.github.com/docs/eea.jquery',
      license='GPL',
      packages=find_packages(exclude=['ez_setup']),
      namespace_packages=['eea'],
      include_package_data=True,
      zip_safe=False,
      install_requires=[
          'setuptools',
          # -*- Extra requirements: -*-
          'collective.js.jqueryui',
      ],
      extras_require={
          'test': [
              'plone.app.testing'
          ]
      },
      entry_points="""
      [z3c.autoinclude.plugin]
      target = plone
      """
      )
