// This is the js for the default/index.html view.

var app = function() {

    var self = {};

    Vue.config.silent = false; // show all warnings

    // Extends an array
    self.extend = function(a, b) {
        for (var i = 0; i < b.length; i++) {
            a.push(b[i]);
        }
    };

    function get_messages_url(start_idx, end_idx)
    {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return messages_url + "?" + $.param(pp);
    };

     self.get_messages = function()
    {
        console.log("getting messages");
        $.getJSON(get_messages_url(0,100), function (data)
        {
            self.vue.messages=data.messages;
            self.vue.has_more=data.has_more;
            self.vue.current_user=data.current_user;
            self.vue.auth_user=data.current_user;
            self.vue.auth_name=data.auth_name;
            self.vue.auth_email=data.auth_email;
            console.log(self.vue.messages.length);
            console.log(self.vue.auth_email);
        });
        // console.log(self.vue.auth_email);
        self.vue.message_index=0;
        // self.vue.
  //   setTimeout(function() {
  // //your code to be executed after 1 second
  //       console.log(self.vue.messages);
  //       console.log("got users");
  //       }, 1000);
    };

    function get_users_url(start_idx, end_idx)
    {
        var pp = {
            start_idx: start_idx,
            end_idx: end_idx
        };
        return users_url + "?" + $.param(pp);
    };

    self.get_users = function()
    {
        $.getJSON(get_users_url(0,100), function (data)
        {
            self.vue.users_all=data.users_all;
            self.vue.has_more=data.has_more;
            self.vue.current_user=data.current_user;
            self.vue.auth_user=data.current_user;
            self.vue.auth_name=data.auth_name;
            console.log(self.vue.current_user);
        })
  //       setTimeout(function() {
  // //your code to be executed after 1 second
  //       console.log(self.vue.users_all);
  //       console.log("got users");
  //       }, 1000);
    };

    self.add_message = function()
    {
        console.log("IN ADD");
        console.log(self.vue.users_all.length);
        var idx = -1;
            for (var i = 0; i < self.vue.users_all.length; i++) {
                // console.log(self.vue.user[i].user_email);
                // console.log(self.vue.users_all.length);
                if (self.vue.users_all[i].user_email === self.vue.receiver) {
                    idx = i;
                    break;
                }
            }
        // console.log(self.vue.users_all[idx].user_name)
        if(idx==-1)
        {
            // console.log("HI");
            alert("Please enter a valid email address.")
        } else
        {
           $.post(add_message_url,
            {
                receiver: self.vue.receiver,
                subject: self.vue.subject,
                message: self.vue.message,
                auth_name: self.vue.auth_name,
                receiver_name: self.vue.users_all[idx].user_name
            },
            function (data) {
                // console.log("The user saved value " + self.vue.my_string);
                // $.web2py.enableElement($("#add_post_submit"));
                self.vue.messages.unshift(data.messages);
            });
        window.location = "messages.html";    
        return false; 
        }
    };

    self.toggle_view = function(message_id)
    {

        console.log("toggled");
        console.log(self.vue.messages.length);
        var idx = null;
            for (var i = 0; i < self.vue.messages.length; i++) {
                if (self.vue.messages[i].id === message_id) {
                    idx = i;
                    break;
                }
            }
        // console.log(self.vue.messages[idx].is_viewing);
        self.vue.messages[idx].is_viewing = !self.vue.messages[idx].is_viewing;
        // console.log(self.vue.messages[idx].is_viewing);
        // console.log(self.vue.messages[0].has_read);
        if(!self.vue.messages[idx].has_read)
        {
            self.vue.messages[idx].has_read = !self.vue.messages[idx].has_read;
            $.post(toggle_read_url,
            {
                message_id: message_id
            },
            function (data) {
                // console.log("The user saved value " + self.vue.my_string);
                // $.web2py.enableElement($("#add_post_submit"));
                // self.vue.messages.unshift(data.messages);
            });

        }
    };

    self.toggle_outbox_view = function(message_id)
    {

        console.log("toggled");
        console.log(self.vue.messages.length);
        var idx = null;
            for (var i = 0; i < self.vue.messages.length; i++) {
                if (self.vue.messages[i].id === message_id) {
                    idx = i;
                    break;
                }
            }
        // console.log(self.vue.messages[idx].is_viewing);
        self.vue.messages[idx].is_viewing = !self.vue.messages[idx].is_viewing;
        // console.log(self.vue.messages[idx].is_viewing);
        // console.log(self.vue.messages[0].has_read);
    };

    self.delete_message = function (message_id) {
                var idx = null;
                for (var i = 0; i < self.vue.messages.length; i++) {
                    if (self.vue.messages[i].id === message_id) {
                        // If I set this to i, it won't work, as the if below will
                        // return false for items in first position.
                        idx = i;
                        break;
                    }
                }
                var sender_deleted=self.vue.messages[idx].sender_deleted;
                var receiver_deleted=self.vue.messages[idx].receiver_deleted;
                if(self.vue.messages[idx].receiver===self.vue.auth_email &&
                    self.vue.messages[idx].sender===self.vue.auth_email)
                {
                    self.vue.messages[idx].receiver_deleted=true;
                    receiver_deleted=true;
                    self.vue.messages[idx].sender_deleted=true;
                    sender_deleted=true;
                }
                else if(self.vue.messages[idx].receiver===self.vue.auth_email)
                {
                    self.vue.messages[idx].receiver_deleted=true;
                    receiver_deleted=true;
                } else 
                {
                    self.vue.messages[idx].sender_deleted=true;
                    sender_deleted=true;
                }
            self.vue.messages[idx].is_viewing = !self.vue.messages[idx].is_viewing;
        $.post(del_message_url,
            {
                message_id: message_id,
                sender_deleted: sender_deleted, 
                receiver_deleted: receiver_deleted
            }
        )
    };

    self.user_check = function()
    {
        setTimeout(function() {
        
        }, 1000);
    }

    self.reply_toggle = function(message_id)
    {
        var idx = null;
            for (var i = 0; i < self.vue.messages.length; i++) {
                if (self.vue.messages[i].id === message_id) {
                    idx = i;
                    break;
                }
            }
        console.log("toggled_reply");
        self.vue.messages[idx].is_replying = !self.vue.messages[idx].is_replying;
    };

    self.reply_message=function(message_id)
    {
        console.log(self.vue.reply);
        var idx = null;
            for (var i = 0; i < self.vue.messages.length; i++) {
                if (self.vue.messages[i].id === message_id) {
                    idx = i;
                    break;
                }
            }
            var idx2 = -1;
            for (var i = 0; i < self.vue.users_all.length; i++) {
                // console.log(self.vue.user[i].user_email);
                // console.log(self.vue.users_all.length);
                if (self.vue.users_all[i].user_email === self.vue.messages[idx].user_email) {
                    idx2 = i;
                    break;
                }
            }
        $.post(reply_message_url,
            {
                receiver: self.vue.messages[idx].user_email,
                subject: "Re: " + self.vue.messages[idx].subject,
                message: self.vue.reply,
                auth_name: self.vue.auth_name,
                receiver_name: self.vue.users_all[idx2].user_name
            },
            function (data) {
                // console.log("The user saved value " + self.vue.my_string);
                // $.web2py.enableElement($("#add_post_submit"));
                self.vue.messages.unshift(data.messages);
            });
        self.vue.messages[idx].is_replying = !self.vue.messages[idx].is_replying;
        self.vue.messages[idx].is_viewing = !self.vue.messages[idx].is_viewing;
    }

    self.toggle_inbox = function()
    {
        self.vue.in_inbox=true;
        self.vue.in_outbox=false;
        self.vue.in_read=false;
    }

    self.toggle_outbox = function()
    {
        self.vue.in_inbox=false;
        self.vue.in_outbox=true;
        self.vue.in_read=false;
    }

    self.toggle_read = function()
    {
        self.vue.in_inbox=false;
        self.vue.in_outbox=false;
        self.vue.in_read=true;
    }

    // Complete as needed.
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            messages: [],
            has_more:false,
            current_user: null,
            users_all: [],
            user_email: null,
            auth_user:null,
            auth_name:null,
            receiver: null,
            subject: null,
            message: null,
            auth_email: null,
            message_index: 0,
            reply: null,
            in_inbox: true,
            in_outbox: false,
            in_read: false
        },
        methods: {
            get_messages: self.get_messages,
            add_message: self.add_message,
            toggle_view: self.toggle_view,
            delete_message: self.delete_message,
            user_check: self.user_check,
            reply_toggle: self.reply_toggle,
            reply_message: self.reply_message,
            toggle_inbox: self.toggle_inbox,
            toggle_outbox: self.toggle_outbox,
            toggle_read: self.toggle_read,
            toggle_outbox_view: self.toggle_outbox_view
        }

    });

    self.get_messages();
    self.get_users();
    $("#vue-div").show();
    return self;
};

var APP = null;

// This will make everything accessible from the js console;
// for instance, self.x above would be accessible as APP.x
jQuery(function(){APP = app();});
