<template>
    <div class="idb-data-create" id="idb-data-create">
        <button class="btn btn-primary btn-create" @click="sendData">{{saveMessage}}</button>
        <data-form-set v-if="model" v-bind:completed-data="completedData" v-bind:set="model"/>
        <div v-if="loading" class="loading"></div>
        <div v-if="invitationDisabled" data-toggle="tooltip" data-placement="bottom" v-bind:title="disabledMessage"
             class="checkbox check-disabled">
            <label>
                <input disabled v-model="invitation" type="checkbox"> {{sentMessage}}
            </label>
        </div>
        <div v-else class="checkbox">
            <label>
                <input v-model="invitation" type="checkbox"> {{sentMessage}}
            </label>
        </div>
    </div>
</template>

<script>
    import DataFormSet from "./DataFormSet";
    import DangerAlert from "../shared/alerts/DangerAlert";

    export default {
        name: 'dataForm',
        components: {DataFormSet, DangerAlert},
        methods: {
            sendData() {
                //convert VUE observer to normal object
                let data = {
                    invitation: this.invitation,
                    data: JSON.parse(JSON.stringify(this.completedData))
                };

                if ($('input:invalid').length > 0) {
                    $('#idb-data-create').addClass('show-invalid');
                    $('.btn-create').attr('disabled', 'disabled');
                    $('.danger-message').text(emptyRequiredMessage);

                    $('html').animate({scrollTop: 0}, 400);
                    $('.alert-danger').slideDown(400);
                } else {
                    this.loading = true;
                    $.ajax({
                        type: 'POST',
                        url: createURL,
                        data: data,
                    }).done(response => {
                        response = JSON.parse(response);

                        if (response.success !== undefined && response.success) {
                            window.location.replace(showAllURL);
                        } else {
                            this.loading = false;
                            $('.loading').addClass('hidden');
                            if (response.message !== undefined) {
                                $('#dangerMessage').text(response.message);
                            } else {
                                $('#dangerMessage').text(errorMessage);
                            }
                            $('html').animate({scrollTop: 0}, 400);
                            $('.alert-danger').slideDown(400);
                        }
                    });
                }
            }
        },
        data() {
            return {
                model: null,
                completedData: {},
                sentMessage,
                invitationDisabled: true,
                disabledMessage: '',
                saveMessage: '',
                invitation: true,
                loading: false,
            };
        },
        mounted() {
            this.sentMessage = sentMessage;
            this.saveMessage = saveMessage;
            $.get(getModelURL).done((data) => {
                this.model = data;
                if (typeof this.model === 'string') {
                    this.model = JSON.parse(this.model);
                }
                this.invitationDisabled = !this.model['hasPeopleAccessMap'];
                this.invitation = !this.invitationDisabled;
                this.disabledMessage = sentDisabledMessage;
                $('.loading').hide();
            });
        },
    }
</script>

<style lang="scss" scoped>
    .btn-create {
        position: absolute;
        top: -49px;
        left: 75px;
    }

    #idb-data-create {
        position: relative;
    }

    .check-disabled {
        color: lightgrey;
    }
</style>