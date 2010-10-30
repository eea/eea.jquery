from Products.CMFCore.utils import getToolByName
from zExceptions import NotFound
import transaction

try:
    import zope.annotation
except ImportError:
    #BBB Plone 2.5
    def install(self, reinstall=False):
        portal_setup = getToolByName(self, 'portal_setup')
        portal_setup.setImportContext('profile-eea.jquery:01-jquery')
        res = portal_setup.runAllImportSteps()
        messages = res.get('messages', {})
        output = [message for message in messages.values() if message]
        return '\n'.join(output)
else:
    # Plone 3 doesn't need an installation method
    raise NotFound
