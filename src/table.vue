<script setup>
    import { computed, onMounted, watch } from 'vue';

    const emit = defineEmits(['edit']);
    const props = defineProps({
        table: Object,
        label: String,
        items: Array,
        itemsLabelField: String,
        itemsStatusField: String,
        maxItems: Number
    });
    const tableID = computed(() => String(JSON.stringify(props?.label || '')).toLowerCase().replace(/[^a-z0-9]/gmi, " ").replace(/\s+/g, "-"));
    const itemCount = computed(() => props?.items?.length || 0);
    watch(() => props.table, () => draw());
    watch(() => props.label, () => draw());
    watch(() => props.items, () => draw());
    watch(() => props.itemsLabelField, () => draw());
    watch(() => props.itemsStatusField, () => draw());
    watch(() => props.maxItems, () => draw());

    const edit = () => emit('edit');
    const topPosition = (ry, so, n, i) => {
        return ry + -ry * Math.cos((360 / n / 180) * (i + so) * Math.PI)
    }
    const leftPosition = (rx, so, n, i) => {
        return rx + rx * (Math.sin((360 / n / 180) * (i + so) * Math.PI));
    }

    const draw = () => setup(props?.maxItems, 150, 150, 0, 42);
    const setup = (n, rx, ry, so, wh) => {
        if ( tableID.value && tableID.value !== "" ) {

            // Setup styles
            var ss = document.styleSheets;
            ss[0].insertRule('#' + tableID.value + ' { position: relative; border-radius: 50%; box-shadow: inset 0 0 ' + wh + 'px ' + wh / 4 + 'px #999; background: #eee; width: ' + String((rx * 2) + wh) + 'px; height: ' + String((ry * 2) + wh) + 'px; margin: 0 auto; cursor: pointer }', 1);
            ss[0].insertRule('.circle { position: absolute; text-align: center; border-radius: 50%; transition: transform 0.2s ease; width: ' + wh + 'px; height: ' + wh + 'px; line-height: ' + wh + 'px;}', 1);
            ss[0].insertRule('.circle-occupied { background: black; color: papayawhip; }', 1);
            ss[0].insertRule('.circle-empty { background: #f5f0d3; color: black; }', 1);
            ss[0].insertRule('.circle-false { background: #b31529; color: white; }', 1);
            ss[0].insertRule('.circle-true { background: #1065ab; color: white; } ', 1);
            ss[0].insertRule('.circle-label { position: absolute; text-align: center }');

            // Setup table
            var m = document.createElement('div');
            m.id = tableID.value;

            // Add circles for each seat
            for (var i = 0; i < n; i++) {
                var cont = document.createElement('div');
                var x = topPosition(ry, so, n, i);
                var y = leftPosition(rx, so, n, i);

                var c = document.createElement('div');
                var cl = '';
                if ( i >= itemCount.value ) {
                    cl = 'circle-empty';
                }
                else if ( props?.itemsStatusField && props?.items?.[i]?.[props.itemsStatusField] === true ) {
                    cl = 'circle-true';
                }
                else if ( props?.itemsStatusField && props?.items?.[i]?.[props.itemsStatusField] === false ) {
                    cl = 'circle-false';
                }
                else {
                    cl = 'circle-occupied';
                }
                c.className = `circle ${cl}`;
                c.innerHTML = i + 1;
                c.style.top = String(x) + 'px';
                c.style.left = String(y) + 'px';

                cont.appendChild(c);
                m.appendChild(cont);
            }

            document.getElementById(tableID.value).innerHTML = m.innerHTML;

        }
    }

    onMounted(() => draw());
</script>

<template>
    <div class="table-wrapper">
        <h2 class="table-label">{{ label }}</h2>
        <div :id="tableID" class="table" @click="edit"></div>
        <div class="table-items">
            <VChip v-for="(item, index) in items" :style="index >= props?.maxItems ? 'background-color: #a73030; color: #fff;' : 'background-color: #eee; color: #000'">
                {{ item[itemsLabelField || 'id'] }}
            </VChip>
        </div>
    </div>
</template>

<style>
    div.table-wrapper {
        text-align: center;
    }
    .table-label {
        font-size: 125%;
        font-weight: bold;
        margin-bottom: 25px;
    }
    div.table-items {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        align-items: center;
        justify-content: space-around;
        margin: 15px;
    }
</style>