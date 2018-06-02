# -*- coding: utf-8 -*-

# ----- menu stuff -----
response.menu = [
    (T('Home'), False, URL('default', 'index'), [])
]

# ----- if in production -----
DEVELOPMENT_MENU = True
if DEVELOPMENT_MENU:
    response.menu += [
        (T('My Sites'), False, URL('admin', 'default', 'site')),
    ]    

auth.settings.login_next = URL('index')
auth.settings.logout_next = URL('index')
auth.settings.profile_next = URL('index')
auth.settings.register_next = URL('index')
auth.settings.change_password_next = URL('index')
auth.settings.reset_password_next = URL('index')
