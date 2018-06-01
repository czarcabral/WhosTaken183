# -*- coding: utf-8 -*-

# db.define_table('auth_table',
#     Field('id'), # student id
#     Field('first_name'),
#     Field('last_name'),
#     Field('email'),
#     Field('bio'),
#     Field('is_public'),
# )

db.define_table('groups',
    Field('group_id'),
    Field('group_name'),
)

db.define_table('memberships',
    Field('student_id'),
    Field('group_id'),
    Field('is_admin'),
)

db.define_table('classes',
    Field('class_id'), # i.e. cmps183
    Field('class_name'), # i.e. web applications
    # Field('description'),
)

db.define_table('enrollments',
    Field('student_id'),
    Field('class_id'),
    Field('quarter'),
    Field('grade'),
    Field('is_class_public'),
    Field('is_grade_public'),
)
