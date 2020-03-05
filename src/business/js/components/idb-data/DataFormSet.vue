<template>
    <div class="append-data-set">
        <h4>{{set.display_name}}</h4>
        <div v-for="data in set.data" v-bind:key="data.uuid">
            <div v-if="data.object_type === 'type'">
                <label>{{data.display_name}}<span v-if="data.required === 'true'" class="required">*</span></label>
                <input v-on:change="validate" :required="data.required === 'true'"
                       class="data-input form-control append-data-input" v-model="completedData[data.uuid]"
                       type="text"/>
            </div>
            <div v-else-if="data.object_type === 'set'">
                <data-form-set v-bind:set="data" v-bind:completed-data="completedData"/>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: ['set', 'completedData'],
        name: 'dataFormSet',
        methods: {
            validate() {
                if ($('input:invalid').length < 1) {
                    $('.btn-create').removeAttr('disabled');
                }
            }
        }
    }
</script>