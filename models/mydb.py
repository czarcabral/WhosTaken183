# -*- coding: utf-8 -*-
import datetime
def get_auth_user_id():
    return auth.user.id if auth.user else None

def get_user_email():
    return auth.user.email if auth.user is not None else None
db.define_table('groups',
    Field('group_name'),
)

db.define_table('memberships',
    Field('student_id', type='integer'),
    Field('group_id', type='integer'),
    Field('is_admin', type='boolean'),
)

db.define_table('courses',
    Field('name'), # i.e. cmps183
    Field('description'), # i.e. web applications
    # Field('description'),
)

db.define_table('enrollments',
    Field('user_id', type='integer', default=get_auth_user_id()),
    Field('course_name'),
    Field('quarter'),
    Field('grade'),
    Field('email'),
    Field('is_course_public', type='boolean', default=True),
    Field('is_grade_public', type='boolean', default=True),
)

db.define_table('messages',
                Field('receiver'),
                Field('user_email', default=get_user_email()),
                Field('user_name'),
                Field('subject'),
                Field('body'),
                Field('sender'),
                Field('receiver_name'),
                Field('sender_deleted','boolean'),
                Field('receiver_deleted','boolean'),
                Field('updated_on', 'datetime', update=datetime.datetime.utcnow()),
                Field('is_viewing', 'boolean', default=False),
                Field('has_read', 'boolean'),
                Field('is_replying', 'boolean', default=False)
                )

db.define_table('users',
                Field('user_email'),
                Field('user_name'),
                Field('user_id'),
                Field('classes', 'list:string')
                )
