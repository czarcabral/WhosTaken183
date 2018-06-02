var app = function() {
    var self = {};
    Vue.config.silent = false;
    self.add_classes = function(class_ids, class_names) {
        for(var i=0; i<class_ids.length; i++) {
            let class_id = class_ids[i];
            let class_name = class_names[i];
            (function(class_id, class_name) {
                $.post(add_class_url, 
                    {class_id:class_id, class_name:class_name}, 
                    function(data) {
                        self.vue.classes.push(data.my_class);
                    }
                );
            })(class_id, class_name);
        };
    };
    self.parse_doc = function(doc) {
        var class_ids = [];
        var class_names = [];
        // get class_ids
        var elements = doc.querySelectorAll('td.c44 p.c6 span.c11');
        for(var i=0; i<elements.length; i+=2) {
            let class_department = (elements.item(i)).innerHTML;
            let class_number = (elements.item(i+1)).innerHTML;
            let class_id = class_department+class_number;
            class_ids.push(class_id);
        };
        elements = doc.querySelectorAll('td.c40 p.c6 span.c11');
        for(var i=0; i<elements.length; i++) {
            class_names.push(elements.item(i).innerHTML);
        };
        // self.vue.class_ids = class_ids;
        // self.vue.class_names = class_names;
        self.add_classes(class_ids, class_names);
    };
    self.upload_file = function() {
        let input = document.querySelector('#upload_transcript_file_input');
        let files = input.files;
        let file = files[0];
        if(file) {
            let reader = new FileReader();
            reader.readAsText(file);
            reader.onloadend = function(event) {
                let result_str = reader.result;
                let doc = document.createElement('html');
                doc.innerHTML = result_str;
                self.parse_doc(doc);
            };
        } else {
            alert('failed to load file');
        };
    },
    self.vue = new Vue({
        el: "#vue-div",
        delimiters: ['${', '}'],
        unsafeDelimiters: ['!{', '}'],
        data: {
            classes: [],
            // class_ids: null,
            // class_names: null,
        },
        methods: {
            upload_file: self.upload_file,
        },
        computed: {
            // 
        },
        created() {
            $('#vue-div').show();
        },
    });
    return self;
};
var APP = null;
jQuery(function() {
    APP = app();
});
