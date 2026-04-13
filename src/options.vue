<script>
    export default {
        inheritArgs: false
    }
</script>

<script setup>
    import { computed, watch } from 'vue';
    import { useSync } from '@directus/extensions-sdk';

    const emit = defineEmits(['update:labelField', 'update:itemsField', 'update:maxField', 'update:defaultMax']);
    const props = defineProps({
        collection: String,
        layoutOptions: Object,
        labelField: String,
        itemsField: String,
        itemsLabelField: String,
        itemsStatusField: String,
        maxField: String,
        defaultMax: Number,
        primaryKeyField: String,
        fields: Array
    });

    const stringFields = computed(() => props?.fields?.filter((f) => ['string', 'text'].includes(f.type)));
    const relationFields = computed(() => props?.fields?.filter((f) => ['m2o', 'o2m'].includes(f.meta?.special?.[0])));
    const numberFields = computed(() => props?.fields?.filter((f) => ['integer'].includes(f.type)));

    const labelField = useSync(props, 'labelField', emit);
    const itemsField = useSync(props, 'itemsField', emit);
    const itemsLabelField = useSync(props, 'itemsLabelField', emit);
    const itemsStatusField = useSync(props, 'itemsStatusField', emit);
    const maxField = useSync(props, 'maxField', emit);
    const defaultMax = useSync(props, 'defaultMax', emit);
</script>

<template>
    <div>
        <div class="type-label">Table Label</div>
        <VSelect v-model="labelField" :items="(stringFields || []).map((e) => ({ text: e.name, value: e.field, field: e }))" />
        <small class="type-note">The field that contains a display name for each table</small>

        <br /><br />

        <div class="type-label">Table Items</div>
        <VSelect v-model="itemsField" :items="(relationFields || []).map((e) => ({ text: e.name, value: e.field, field: e }))" />
        <small class="type-note">The field that contains the items assigned to each table</small>

        <br /><br />

        <div class="type-label">Item Label</div>
        <VInput v-model="itemsLabelField" />
        <small class="type-note">The name of the field from the items collection to use as a label for each item</small>

        <br /><br />

        <div class="type-label">Item Status</div>
        <VInput v-model="itemsStatusField" />
        <small class="type-note">(optional) The name of the field from the items collection that has a true/false status of each item (false will be displayed as red, true will be displayed as green)</small>

        <br /><br />

        <div class="type-label">Max Items</div>
        <VSelect v-model="maxField" :items="(numberFields || []).map((e) => ({ text: e.name, value: e.field, field: e }))" />
        <small class="type-note">The field that sets the maximum number of items that can be assigned to each table</small>

        <br /><br />

        <div class="type-label">Default Max Items</div>
        <VInput type="number" v-model="defaultMax" />
        <small class="type-note">The default maximum number of items when the max items field does not exist or is not set</small>
    </div>
</template>