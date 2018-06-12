from gluon.utils import web2py_uuid
import json

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

def get_profile_user():
    profile_id = request.vars.profile_id
    profile_user = db(db.auth_user.id==profile_id).select(
        db.auth_user.id, 
        db.auth_user.first_name, 
        db.auth_user.last_name, 
        db.auth_user.email, 
        db.auth_user.bio, 
        db.auth_user.is_public
    ).first()
    return response.json(dict(profile_user=profile_user))

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
        (db.enrollments.user_id == get_auth_user_id())
    )
    enrollments = db(myquery).select()
    for enrollment in enrollments:
        if(enrollment.is_grade_public == False) and (enrollment.user_id != get_auth_user_id()) :
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
        email=auth.user.email
    )

def add_course(course):
    name = course['course_name']
    description = course['course_description']
    db.courses.update_or_insert(
        db.courses.name == name,
        name=name,
        description=description
    )
    return response.json(dict())

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
    auth.user.first_name = request.vars.first_name
    auth.user.last_name = request.vars.last_name
    auth.user.email_name = request.vars.email_name
    auth.user.bio_name = request.vars.bio_name
    auth.user.is_public = request.vars.is_public
    db.auth_user.update_or_insert(
        db.auth_user.id == get_auth_user_id(),
        first_name=request.vars.first_name,
        last_name=request.vars.last_name,
        email=request.vars.email,
        bio=request.vars.bio,
        is_public=request.vars.is_public
    )
    return get_auth_user()

def update_enrollment_grade_public():
    myid = request.vars.id
    enrollment = db(db.enrollments.id==myid).select().first()
    enrollment.update_record(is_grade_public=not enrollment.is_grade_public)
    return response.json(dict())

def update_enrollment_course_public():
    myid = request.vars.id
    enrollment = db(db.enrollments.id==myid).select().first()
    enrollment.update_record(is_course_public=not enrollment.is_course_public)
    return response.json(dict())

def delete_account():
    db(db.auth_user.id == get_auth_user_id()).delete()
    db(db.enrollments.user_id == get_auth_user_id()).delete()
    return response.json(dict())

def get_messages():
    # print("HI")
    # db.messages.truncate()
    start_idx=int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx=int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    messages = []
    has_more = False
    # first_login = True
    check=db().select(db.messages.ALL)
    # db.users.truncate()
    # db.messages.truncate()
    rows=db().select(db.messages.ALL, limitby=(start_idx, end_idx + 1), orderby=~db.messages.updated_on)
    for i,r in enumerate(rows):
        # print(r.user_email)
        if i < end_idx - start_idx:
            t= dict(
                id=r.id,
                user_name=r.user_name,
                user_email=r.user_email,
                subject=r.subject,
                receiver=r.receiver,
                sender=r.sender,
                updated_on=r.updated_on,
                sender_deleted=r.sender_deleted,
                receiver_deleted=r.receiver_deleted,
                message=r.body,
                is_viewing=r.is_viewing,
                has_read=r.has_read,
                is_replying=r.is_replying,
                receiver_name=r.receiver_name
            )
            messages.append(t)
        else: 
            has_more=True
    logged_in = auth.user_id is not None
    current_user=-1
    # print(messages[0].subject)
    auth_name=""
    auth_email=""
    if logged_in:
        current_user=auth.user_id
        auth_name = auth.user.first_name + " " + auth.user.last_name
        auth_email=auth.user.email
    return response.json(dict(
        messages=messages,
        has_more=has_more,
        logged_in=logged_in,
        current_user=current_user,
        auth_name=auth_name,
        auth_email=auth_email
    ))

def get_users2():
    # print("HI")
    start_idx=int(request.vars.start_idx) if request.vars.start_idx is not None else 0
    end_idx=int(request.vars.end_idx) if request.vars.end_idx is not None else 0
    users_all = []
    has_more = False
    first_login = True
    check=db().select(db.users.ALL)
    # db.users.truncate()
    if auth.user is not None:
        for i,r in enumerate(check):
            if auth.user.email == r.user_email:
                first_login=False
                break
        if first_login is True:
            add_user()
    rows=db().select(db.users.ALL, limitby=(start_idx, end_idx + 1))
    for i,r in enumerate(rows):
        print(r.user_email)
        if i < end_idx - start_idx:
            t= dict(
                id=r.id,
                user_name=r.user_name,
                user_email=r.user_email,
                user_id=r.user_id,
            )
            users_all.append(t)
        else: 
            has_more=True
    print(len(users_all))
    logged_in = auth.user_id is not None
    current_user=-1
    auth_name=""
    if logged_in:
        current_user=auth.user_id
        auth_name = auth.user.first_name + " " + auth.user.last_name
    return response.json(dict(
        users_all=users_all,
        has_more=has_more,
        logged_in=logged_in,
        current_user=current_user,
        auth_name=auth_name
    ))

def add_user():
    db.users.insert(
        user_email=auth.user.email,
        user_name=auth.user.first_name + " " + auth.user.last_name,
        user_id=auth.user_id
    )

@auth.requires_signature()
def add_message():
    print("in add")
    # db.messages.truncate()
    # print(request.vars.sender)
    # print(request.vars.subject)
    print(request.vars.receiver_name)
    t_id = db.messages.insert(
        receiver=request.vars.receiver,
        sender=auth.user.email,
        subject=request.vars.subject,
        body=request.vars.message,
        user_name=request.vars.auth_name,
        has_read=False,
        sender_deleted=False,
        receiver_deleted=False,
        receiver_name=request.vars.receiver_name
    )
    t = db.messages(t_id)
    # print("message added")
    redirect(URL('default','index'))
    return response.json(dict(messages=t))

@auth.requires_signature()
def toggle_read():
    if request.vars.message_id is not None:
        q = ((db.messages.id == request.vars.message_id))
    row = db(q).select().first()
    # print(request.vars.price)
    row.update_record(has_read=True)
    return "ok"

@auth.requires_signature()
def delete_message():
    sender = False
    receiver = False
    if request.vars.sender_deleted == "true":
        sender = True
    if request.vars.receiver_deleted == "true":
        receiver = True
    if request.vars.message_id is not None:
        q = ((db.messages.id == request.vars.message_id))
        if sender and receiver:
                db(q).delete()
                print("message actually deleted")
        elif sender:
            row = db(q).select().first()
            row.update_record(sender_deleted=True)
            print("sender deleted")
        elif receiver:
            row = db(q).select().first()
            row.update_record(receiver_deleted=True)
            print("receiver_deleted")
    # db(db.post.id == request.vars.post_id).delete()
    return "ok"

@auth.requires_signature()
def reply_message():
    # print("in add")
    # db.messages.truncate()
    # print(request.vars.sender)
    print(request.vars.message)
    t_id = db.messages.insert(
        receiver=request.vars.receiver,
        sender=auth.user.email,
        subject=request.vars.subject,
        body=request.vars.message,
        user_name=request.vars.auth_name,
        has_read=False,
        receiver_name=request.vars.receiver_name
    )
    t = db.messages(t_id)
    # print("message added")
    # redirect(URL('default','index'))
    return response.json(dict(messages=t))
