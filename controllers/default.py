# -*- coding: utf-8 -*-

def index():
    if not auth.user : redirect(URL('login_register'))
    return dict()

def login_register():
    return dict()

@auth.requires_login()
def api_get_user_email():
    if not request.env.request_method == 'GET': raise HTTP(403)
    return response.json({'status':'success', 'email':auth.user.email})

@auth.requires_membership('admin')
def grid():
    response.view = 'generic.html'
    tablename = request.args(0)
    if not tablename in db.tables: raise HTTP(403)
    grid = SQLFORM.smartgrid(db[tablename], args=[tablename], deletable=False, editable=False)
    return dict(grid=grid)

def wiki():
    auth.wikimenu()
    return auth.wiki() 

def user():
    return dict(form=auth())

@cache.action()
def download():
    return response.download(request, db)
