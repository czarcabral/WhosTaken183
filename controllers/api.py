from gluon.utils import web2py_uuid

def add_course():
    name = request.vars.course_name
    description = request.vars.course_description
    db.courses.update_or_insert(
        db.courses.name == name,
        name=name,
        description=description,
    )
    rows = db(db.courses.name == name).select()
    course = rows[0]
    return response.json(dict(course=course))

def add_enrollment():
    course_name = request.vars.course_name
    quarter = request.vars.quarter
    myquery = (
        (db.enrollments.user_id == auth.user) & 
        (db.enrollments.course_name == course_name) & 
        (db.enrollments.quarter == quarter)
    )
    db.enrollments.update_or_insert(
        myquery,
        course_name=course_name,
        quarter=quarter,
        grade=request.vars.grade,
    )
    rows = db(myquery).select()
    enrollment = rows[0]
    return response.json(dict(enrollment=enrollment))

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
