""" Testing
"""
from plone.app.testing import TEST_USER_ID
from plone.app.testing import setRoles
from plone.app.testing import PloneSandboxLayer
from plone.app.testing import applyProfile
from plone.app.testing import PLONE_FIXTURE
from plone.app.testing import FunctionalTesting
from zope.configuration import xmlconfig

class EEAFixture(PloneSandboxLayer):
    """ EEA Testing Policy
    """
    defaultBases = (PLONE_FIXTURE,)

    def setUpZope(self, app, configurationContext):
        """ Setup Zope
        """
        import eea.jquery
        xmlconfig.file('configure.zcml',
                       eea.jquery,
                       context=configurationContext)
        xmlconfig.file('testing.zcml',
                       eea.jquery,
                       context=configurationContext)

    def setUpPloneSite(self, portal):
        """ Setup Plone
        """
        applyProfile(portal, 'eea.jquery:all')

        # Login as manager
        setRoles(portal, TEST_USER_ID, ['Manager'])

EEAFIXTURE = EEAFixture()
FUNCTIONAL_TESTING = FunctionalTesting(bases=(EEAFIXTURE,),
                                       name='EEAjQuery:Functional')
