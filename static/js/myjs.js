var app = function() {
    var self = {};
    Vue.config.silent = false;
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
        },
        methods: {
        }
    });
    return self;
};
var APP = null;
jQuery(function() {
    APP = app();
});
