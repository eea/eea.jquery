""" Run doctests
"""
import doctest
import unittest
from Testing.ZopeTestCase import FunctionalDocFileSuite
from eea.jquery.tests.base import FunctionalTestCase

OPTIONFLAGS = (doctest.REPORT_ONLY_FIRST_FAILURE |
               doctest.ELLIPSIS |
               doctest.NORMALIZE_WHITESPACE)

def test_suite():
    """ Suite
    """
    return unittest.TestSuite((
        FunctionalDocFileSuite('README.txt',
                               package='eea.jquery',
                               optionflags=OPTIONFLAGS,
                               test_class=FunctionalTestCase),
       ))
