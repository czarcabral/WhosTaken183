def my_login():
    email = request.vars.email
    password = request.vars.password
    user = auth.login_bare(email, password)
    return response.json(dict(
        success=True if user else False,
    ))

def my_register():
    email = request.vars.email
    password = request.vars.password
    db.auth_user.insert(
        first_name=request.vars.first_name,
        last_name=request.vars.last_name,
        email=email,
        password=db.auth_user.password.requires[0](password)[0],
    )
    user = auth.login_bare(email, password)
    return response.json(dict(success=True if user else False))
