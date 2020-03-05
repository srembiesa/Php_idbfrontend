<template>
    <div class="alert alert-danger alert-dismissible idb-hidden">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">×</button>
        <h4><i class="icon fa fa-ban"></i> {{title}}</h4>
        <span class="danger-message">{{message}}</span>
    </div>
</template>

<script>
    export default {
        props: ['title', 'message'],
        name: 'dangerAlert'
    }
</script>