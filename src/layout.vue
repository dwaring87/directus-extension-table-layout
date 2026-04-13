<script>
    export default {
        inheritAttrs: false,
    };
</script>

<script setup>
    import { ref, computed, watch, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    import { useItems } from '@directus/extensions-sdk';
    import Table from './table.vue';

    const router = useRouter();
    const props = defineProps({
        collection: String,
        layoutOptions: Object,
        fields: Array
    });

    const collectionKey = ref(props?.collection);
    const labelField = ref(props?.layoutOptions?.labelField);
    const itemsField = ref(props?.layoutOptions?.itemsField);
    const itemsLabelField = ref(props?.layoutOptions?.itemsLabelField);
    const itemsStatusField = ref(props?.layoutOptions?.itemsStatusField);
    const maxField = ref(props?.layoutOptions?.maxField);
    const defaultMax = ref(props?.layoutOptions?.defaultMax);
    const primaryFieldProps = computed(() => props?.fields?.filter((e) => e.schema?.is_primary_key)[0]);

    watch(() => props.layoutOptions, async (o) => {
        labelField.value = o?.labelField;
        itemsField.value = o?.itemsField;
        itemsLabelField.value = o?.itemsLabelField;
        itemsStatusField.value = o?.itemsStatusField;
        maxField.value = o?.maxField;
        defaultMax.value = o?.defaultMax;
        await getTables();
    });

    const query = {
        fields: ref(['*.*']),
        limit: ref(null),
        sort: ref(`${itemsField.value}.${labelField.value}`),
        search: ref(null),
        filter: ref(null),
        page: ref(1),
    }
    const { getItems:getTables, items:tables } = useItems(collectionKey, query);

    const edit = (table) => {
        const primaryFieldID = primaryFieldProps.value.field;
        const url = `/content/${collectionKey.value}/${encodeURIComponent(table[primaryFieldID])}`;
        router.push(url);
    }

    onMounted(async () => {
        await getTables();
    });
</script>

<template>
    <div class="status-container">
        <p class="status status-true">{{ itemsStatusField }} = true</p>
        <p class="status status-false">{{ itemsStatusField }} = false</p>
        <p class="status status-unknown">{{ itemsStatusField }} = unknown</p>
        <p class="status status-unassigned">unassigned</p>
    </div>
    <div class="table-container">
        <Table v-for="table in tables"
            :table="table"
            :label="table[labelField]"
            :items="table[itemsField]"
            :itemsLabelField="itemsLabelField"
            :itemsStatusField="itemsStatusField"
            :maxItems="table[maxField] || defaultMax"
            @edit="() => edit(table)">
        </Table>
    </div>
</template>

<style>
    div.status-container {
        width: 100%;
        max-width: 500px;
        margin: 25px auto;
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        justify-content: center;
    }
    .status {
        padding: 5px 15px;
        border-radius: 25px;
    }
    .status-true {
        background: #1065ab;
        color: white;
    }
    .status-false {
        background: #b31529;
        color: white;
    }
    .status-unknown {
        background: black;
        color: white;
    }
    .status-unassigned {
        background: #f5f0d3;
        color: black;
    }
    div.table-container {
        margin: 15px;
        display: flex;
        flex-wrap: wrap;
        gap: 25px;
        align-items: center;
        justify-content: space-around;
    }
</style>
