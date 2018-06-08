from gluon.utils import web2py_uuid

def get_auth_user():
    auth_user = db(db.auth_user.id==get_auth_user_id()).select(
        db.auth_user.id, 
        db.auth_user.first_name, 
        db.auth_user.last_name, 
        db.auth_user.email, 
        db.auth_user.bio, 
        db.auth_user.is_public
    ).first()
    return response.json(dict(auth_user=auth_user))

def get_users():
    users = db(db.auth_user.is_public==True).select(
        db.auth_user.id, 
        db.auth_user.first_name, 
        db.auth_user.last_name, 
        db.auth_user.email, 
        db.auth_user.bio
    )
    return response.json(dict(users=users))

def get_enrollments():
    myquery = (
        (db.enrollments.is_course_public == True) | 
        (db.enrollments.user_id == auth.user.id)
    )
    enrollments = db(myquery).select()
    for enrollment in enrollments:
        if(enrollment.is_grade_public == False) and (enrollment.user_id != auth.user.id) :
            enrollment.update(grade='PRIVATE')
    return response.json(dict(enrollments=enrollments))

def get_courses():
    courses = db(db.courses).select()
    return response.json(dict(courses=courses))

def add_enrollment(enrollment):
    course_name = enrollment['course_name']
    quarter = enrollment['quarter']
    grade = enrollment['grade']
    myquery = (
        (db.enrollments.user_id == auth.user) & 
        (db.enrollments.course_name == course_name) & 
        (db.enrollments.quarter == quarter)
    )
    db.enrollments.update_or_insert(
        myquery,
        course_name=course_name,
        quarter=quarter,
        grade=grade,
    )

def add_course(course):
    name = course['course_name']
    description = course['course_description']
    db.courses.update_or_insert(
        db.courses.name == name,
        name=name,
        description=description,
    )
    return dict()

def add_multiple_enrollments():
    enrollments = eval(request.vars.enrollments)
    for enrollment in enrollments:
        add_enrollment(enrollment)
    return response.json(dict())

def add_multiple_courses():
    courses = eval(request.vars.courses)
    for course in courses:
        add_course(course)
    return response.json(dict())

def update_multiple_enrollments():
    db(db.enrollments.user_id == get_auth_user_id()).delete()
    enrollments = eval(request.vars.enrollments)
    for enrollment in enrollments:
        add_enrollment(enrollment)
    return response.json(dict())

def update_profile():
    db.auth_user.update_or_insert(
        db.auth_user.id == get_auth_user_id(),
        first_name=request.vars.first_name,
        last_name=request.vars.last_name,
        email=request.vars.email,
        bio=request.vars.bio,
        is_public=request.vars.is_public
    )
    return get_auth_user()
