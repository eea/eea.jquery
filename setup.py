""" EEA JQuery Installer
"""
from setuptools import setup, find_packages
import os
from os.path import join

NAME = 'eea.jquery'
PATH = NAME.split('.') + ['version.txt']
VERSION = open(join(*PATH)).read().strip()

setup(name=NAME,
      version=VERSION,
      description="jQuery library and plugins for Plone",
      long_description=open("README.txt").read() + "\n" +
                       open(os.path.join("docs", "HISTORY.txt")).read(),
      classifiers=[
        "Programming Language :: Python",
        "Topic :: Software Development :: Libraries :: Python Modules",
        ],
      keywords='eea jquery plone zope3',
      author='Alin Voinea',
      author_email='alin.voinea@eaudeweb.ro',
      url='http://pypi.python.org/pypi/eea.jquery',
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
      entry_points="""
      # -*- Entry points: -*-
      """,
      )
