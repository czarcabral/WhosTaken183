// API Calls
var get_auth_user = function(get_auth_user_url) {
    return $.getJSON(get_auth_user_url).fail(function() {
        alert('ERROR - getJSON request (get_auth_user_url) failed');
    });
};
var get_profile_user = function(get_profile_user_url, profile_id) {
    return $.post(get_profile_user_url, {profile_id:profile_id}).fail(function() {
        alert('ERROR - post request (get_profile_user_url) failed');
    });
};
var get_users = function(get_users_url) {
    return $.getJSON(get_users_url).fail(function() {
        alert('ERROR - getJSON request (get_users_url) failed');
    });
};
var get_enrollments = function(get_enrollments_url) {
    return $.getJSON(get_enrollments_url).fail(function() {
        alert('ERROR - getJSON request (get_enrollments_url) failed');
    });
};
var get_courses = function(get_courses_url) {
    return $.getJSON(get_courses_url).fail(function() {
        alert('ERROR - getJSON request (get_courses_url) failed');
    });
};
var add_multiple_enrollments = function(add_multiple_enrollments_url, enrollments) {
    return $.post(add_multiple_enrollments_url, {enrollments:JSON.stringify(enrollments)}).fail(function() {
        alert('ERROR - post request (add_multiple_enrollments_url) failed');
    });
};
var add_multiple_courses = function(add_multiple_courses_url, courses) {
    return $.post(add_multiple_courses_url, {courses:JSON.stringify(courses)}).fail(function() {
        alert('ERROR - post request (add_multiple_courses_url) failed');
    });
};
var update_multiple_enrollments = function(update_multiple_enrollments_url, enrollments) {
    return $.post(update_multiple_enrollments_url, {enrollments:JSON.stringify(enrollments)}).fail(function() {
        alert('ERROR - post request (update_multiple_enrollments_url) failed');
    });
};
var update_profile = function(update_profile_url, user) {
    return $.post(update_profile_url, 
        {
            id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            bio: user.bio,
            is_public: user.is_public,
        }
    ).fail(function() {
        alert('ERROR - post request (update_profile_url) failed');
    });
}
var update_enrollment_grade_public = function(update_enrollment_grade_public, id) {
    return $.post(update_enrollment_grade_public, {id:id}).fail(function() {
        alert('ERROR - post request (update_enrollment_grade_public) failed');
    });
};
var update_enrollment_course_public = function(update_enrollment_course_public, id) {
    return $.post(update_enrollment_course_public, {id:id}).fail(function() {
        alert('ERROR - post request (update_enrollment_course_public) failed');
    });
};
var delete_account = function(delete_account_url) {
    return $.getJSON(delete_account_url).fail(function() {
        alert('ERROR - getJSON request (delete_account_url) failed');
    });
};


// search and filter predicates
var is_elem = function(targ) {
    return function(elem) { return elem == targ; };
};
var is_id = function(id) {
    return function(elem) { return elem.id == id; };
};
var is_name = function(course_name) {
    return function(elem) { return elem.name == course_name; };
};
var is_course_name = function(course_name) {
    return function(elem) { return elem.course_name == course_name; };
};
var is_user_id = function(user_id) {
    return function(elem) { return elem.user_id == user_id; };
};
var is_not_user_id = function(user_id) {
    return function(elem) { return elem.user_id != user_id; };
};
var is_quarter = function(quarter) {
    return function(elem) { return elem.quarter == quarter; };
};
var is_not_quarter = function(quarter) {
    return function(elem) { return elem.quarter != quarter; };
};


