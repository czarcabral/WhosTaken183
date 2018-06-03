# -*- coding: utf-8 -*-

def get_auth_user():
    return auth.user.id if auth.user else None

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
    Field('user_id', type='integer', default=get_auth_user()),
    Field('course_name'),
    Field('quarter'),
    Field('grade'),
    Field('is_course_public', type='boolean', default=True),
    Field('is_grade_public', type='boolean', default=True),
)
