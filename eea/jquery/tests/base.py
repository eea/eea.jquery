""" Tests
"""
from eea.jquery.tests.layer import EEAjQueryLayer
from Products.PloneTestCase import PloneTestCase

PloneTestCase.setupPloneSite()

class FunctionalTestCase(PloneTestCase.FunctionalTestCase):
    """ Test case
    """
    layer = EEAjQueryLayer
