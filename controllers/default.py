# -*- coding: utf-8 -*-

def index():
    if not auth.user : redirect(URL('user'))
    return dict()

def profile():
    if not auth.user : redirect(URL('user'))
    if (not request.args) : redirect(URL('profile', args=[auth.user.id]))
    myid = request.args(0)
    myquery = (db.auth_user.id == myid)
    user = db(myquery).select().first()
    if(user == None):
        raise HTTP(404, "ERROR: user not found")
    return dict(
        id=user.id, 
        first_name=user.first_name, 
        last_name=user.last_name, 
        email=user.email,
        bio=user.bio,
        is_public=user.is_public,
    )

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
