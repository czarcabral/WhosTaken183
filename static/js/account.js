var app = function() {
    var self = {};
    Vue.config.silent = false;
    self.delete_account = function() {
        return $.getJSON(delete_account_url).fail(function() {
            alert('ERROR - getJSON request (delete_account_url) failed');
        });
    };
    self.init_data = function() {
        // self.vue.is_loaded = true;
    };
    self.click_delete_account = function() {
        // $.when(self.delete_account()).then(function() {
        //     window.location.href = logout_url;
        // });
    };
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            is_loaded: false,
        },
        methods: {
            click_delete_account: self.click_delete_account,
        },
        computed: {
        },
        created() {
            self.init_data();
            this.is_loaded = true;
            $('#vue-div').show();
        },
    });
    return self;
};
var APP = null;
jQuery(function() {
    APP = app();
});
