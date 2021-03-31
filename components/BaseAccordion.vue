<template>
    <div class="accordion box" role="presentation">
        <lazy-accordion-item v-for="(item, i) in content" :key="`content-${i}`"
            :item="item" :groupId="groupId">
            <template v-slot:category>
                <button @click="toggle" class="accordion__item--trigger" v-for="(title, i) in arraytitles" :key="`titles-${i}`">
                    <h2 class="accordion__title--text">{{title}}</h2>
                    <span class="accordion__item--trigger-icon"></span>
                </button>
            </template>
            <!-- <template v-slot:details>
                <lazy-report-details :report="item" v-if="item.ReportType === 'dispatch'" />
                <lazy-case-file-details :report="item" v-if="item.ReportType === 'case-file'" />
            </template> -->
        </lazy-accordion-item>
    </div>
</template>
<script>
export default {
    name: "BaseAccordion",
    props: {
        content: {
            type: Array,
            required: true
        },
        arraytitles: {
            type: Array,
            required: false
        }
    },
    data() {
        return {
            show: false,
            groupId: null
        }
    },
    methods: {
        toggle() {
            this.show = !this.show
        }
    },
    mounted() {
        this.groupId = this.$el.id
    }
}
</script>
<style lang="scss">

</style>