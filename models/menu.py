# -*- coding: utf-8 -*-

# ----- menu stuff -----
response.menu = [
    (T('Home'), False, URL('default', 'index'), []),
    (T('Profile'), False, URL('default', 'profile'), []),
    (T('Account'), False, URL('default', 'account'), []),
]

# ----- if in production -----
DEVELOPMENT_MENU = True
if DEVELOPMENT_MENU:
    response.menu += [
        (T('My Sites'), False, URL('admin', 'default', 'site')),
    ]    
