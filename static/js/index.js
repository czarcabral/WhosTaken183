var app = function() {
    var self = {};
    Vue.config.silent = false;
    self.find_by_id = function(id) {
        return function(elem) {
            return elem.id == id;
        };
    };
    self.get_users = function(parent_response) {
        return $.getJSON(get_users_url, function(response) {
            self.vue.users = response.users;
        }).fail(function() {
            alert('getJSON request: get_users_url - failed');
        });
    };
    self.get_enrollments = function(parent_response) {
        return $.getJSON(get_enrollments_url, function(response) {
            var enrollments = response.enrollments;
            for(var i=0; i<enrollments.length; i++) {
                let user = self.vue.users.find(self.find_by_id(enrollments[i].user_id));
                let user_full_name = user.first_name+' '+user.last_name;
                enrollments[i].user_full_name = user_full_name;
            };
            self.vue.enrollments = enrollments;    
        }).fail(function() {
            alert('getJSON request: get_enrollments_url - failed');
        });
    };
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            users: [],
            enrollments: [],
        },
        methods: {
        },
        computed: {
        },
        created() {
            self.get_users().then(self.get_enrollments);
            $('#vue-div').show();
        },
    });
    return self;
};
var APP = null;
jQuery(function() {
    APP = app();
});
