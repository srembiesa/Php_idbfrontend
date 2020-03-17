import Vue from 'vue';

const editor = new Vue({
    el: '#editor',
    data: {
        centerBtnRow: {
            textAlign: 'center'
        },
        inputStyle: {
            width: '100%'
        },
        rows: [],
        types: [
            {
                id: 0, value: "int"
            },
            {
                id: 1, value: "string"
            },
            {
                id: 2, value: "boolean"
            }
        ]
    },
    methods: {
        addRow() {
            this.rows.push({
                name: "",
                type: "",
                description: ""
            })
        },
        removeElement(index) {
            this.rows.splice(index, 1);
        }
    }
});