import { ref, computed, unref } from 'vue';
import { defineLayout, useCollection, useSync } from '@directus/extensions-sdk';

import Layout from './layout.vue';
import Options from './options.vue';

function syncRefProperty(ref, key, defaultValue) {
    return computed({
        get() {
            return ref.value?.[key] ?? unref(defaultValue);
        },
        set(value) {
            ref.value = Object.assign({}, ref.value, { [key]: value })
        }
    });
}

export default defineLayout({
    id: 'seating-assignments',
    name: 'Seating Assignments',
    icon: 'table_bar',
    component: Layout,
    slots: {
        options: Options,
        sidebar: () => null,
        actions: () => null,
    },
    setup(props, { emit }) {
        const layoutOptions = useSync(props, 'layoutOptions', emit);

        const collection = ref(props.collection);
        const { primaryKeyField, fields } = useCollection(collection);

        const labelField = syncRefProperty(layoutOptions, 'labelField', primaryKeyField.value.field);
        const itemsField = syncRefProperty(layoutOptions, 'itemsField', undefined);
        const itemsLabelField = syncRefProperty(layoutOptions, 'itemsLabelField', 'id');
        const itemsStatusField = syncRefProperty(layoutOptions, 'itemsStatusField', undefined);
        const maxField = syncRefProperty(layoutOptions, 'maxField', undefined);
        const defaultMax = syncRefProperty(layoutOptions, 'defaultMax', 10);

        return {
            collection,
            layoutOptions,
            labelField,
            itemsField,
            itemsLabelField,
            itemsStatusField,
            maxField,
            defaultMax,
            primaryKeyField,
            fields,
        }
    },
});
