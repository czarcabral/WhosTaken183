# -*- coding: utf-8 -*-

# Customize your APP title, subtitle and menus here
response.logo = A(B('web', SPAN(2), 'py'), XML('&trade;&nbsp;'),
                  _class="navbar-brand", _href="http://www.web2py.com/",
                  _id="web2py-logo")
response.title = request.application.replace('_', ' ').title()
response.subtitle = ''

response.meta.author = configuration.get('app.author')
response.meta.description = configuration.get('app.description')
response.meta.keywords = configuration.get('app.keywords')
response.meta.generator = configuration.get('app.generator')

response.google_analytics_id = None

# this is the main application menu add/remove items as required
response.menu = [
    (T('Home'), False, URL('default', 'index'), [])
]

DEVELOPMENT_MENU = True
# provide shortcuts for development. remove in production
def _():
    # shortcuts
    app = request.application
    ctr = request.controller
    
    # useful links to internal and external resources
    response.menu += [
        (T('My Sites'), False, URL('admin', 'default', 'site')),
    ]
if DEVELOPMENT_MENU:
    _()
if "auth" in locals():
    auth.wikimenu()
