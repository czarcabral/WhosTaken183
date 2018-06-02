# -*- coding: utf-8 -*-

def index():
    if not auth.user : redirect(URL('user'))
    return dict()

def profile():
    return dict()

def user():
    if request.args(0) == 'register' :
        db.auth_user.bio.writable = False
        db.auth_user.is_public.writable = False
    return dict(form=auth())

@auth.requires_membership('admin')
def grid():
    response.view = 'generic.html'
    tablename = request.args(0)
    if not tablename in db.tables: raise HTTP(403)
    grid = SQLFORM.smartgrid(db[tablename], args=[tablename], deletable=False, editable=False)
    return dict(grid=grid)

@cache.action()
def download():
    return response.download(request, db)
