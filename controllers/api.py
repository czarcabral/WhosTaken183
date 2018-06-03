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
    grade = request.vars.grade
    myquery = (db.enrollments.user_id == auth.user) & (db.enrollments.course_name == course_name) & (db.enrollments.quarter == quarter)
    db.enrollments.update_or_insert(
        myquery,
        course_name=course_name,
        quarter=quarter,
        grade=grade,
    )
    rows = db(myquery).select()
    enrollment = rows[0]
    return response.json(dict(enrollment=enrollment))
