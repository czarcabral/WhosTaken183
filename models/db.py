# -*- coding: utf-8 -*-

from gluon.contrib.appconfig import AppConfig
from gluon.tools import Auth, Service, PluginManager
import logging, sys

if request.global_settings.web2py_version < "2.15.5":
    raise HTTP(500, "Requires web2py 2.15.5 or newer")





# ----- configuration stuff -----

configuration = AppConfig(reload=True)

if not request.env.web2py_runtime_gae:
    db = DAL(configuration.get('db.uri'),
            pool_size=configuration.get('db.pool_size'),
            migrate_enabled=configuration.get('db.migrate'),
            check_reserved=['all'])
    session.connect(request, response, db=db)
else:
    db = DAL('google:datastore+ndb')
    session.connect(request, response, db=db)
response.generic_patterns = [] 
if request.is_local and not configuration.get('app.production'):
    response.generic_patterns.append('*')
response.formstyle = configuration.get('forms.formstyle')
response.form_label_separator = configuration.get('forms.separator') or ''
if configuration.get('scheduler.enabled'):
    from gluon.scheduler import Scheduler
    scheduler = Scheduler(db, heartbeat=configure.get('heartbeat'))





# ----- authentication stuff ------

auth = Auth(db, host_names=configuration.get('host.names'))
service = Service()
plugins = PluginManager()

auth.settings.extra_fields['auth_user'] = [
    Field('bio', type='text', default=None),
    Field('is_public', type='boolean', default=True),
]
auth.define_tables(username=False, signature=False)

auth.settings.registration_requires_verification = False
auth.settings.registration_requires_approval = False
auth.settings.reset_password_requires_verification = False

auth.settings.actions_disabled.append('verify_email')
auth.settings.actions_disabled.append('retrieve_username')
auth.settings.actions_disabled.append('request_reset_password')

def user_bar():
    action = '/user'
    if auth.user:
        logout = A('Logout', _href=URL('default', 'user', args='logout'))
        bar = SPAN('Hello '+auth.user.first_name, ' | ', logout, _class='auth_navbar')
    else:
        login = A('Log In', _href=URL('default', 'user', args='login'))
        register=A('Sign Up',_href=URL('default', 'user', args='register'))
        bar = SPAN('', login, '', register, _class='auth_navbar')
    return bar





# ----- meta data -----

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





# ----- logging functionality -----

FORMAT = "%(asctime)s %(levelname)s %(process)s %(thread)s %(funcName)s():%(lineno)d %(message)s"
logging.basicConfig(stream=sys.stderr)
logger = logging.getLogger(request.application)
logger.setLevel(logging.INFO)

logger.info("====> Request: %r %r %r %r" % (request.env.request_method, request.env.path_info, request.args, request.vars))
