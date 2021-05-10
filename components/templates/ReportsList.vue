<template>
  <div class="reports-list">
    
    <div class="info-bar">
      <div class="info-bar__search-wrapper">
        <UiAutocomplete @sendReportsToParent="reportsfetched" :items="reportslist" theme="light" />
      </div>
      <div class="info-bar__sort">
          <label class="info-bar__sort--label">Sort By:</label>
          <a v-for="option in sortoptions" :key="option.value" @click="sortValue(option)" :class="[sortBy === option.value ? sortDirection : '']">
            {{option.text}}
          </a>
        </div>
    </div>
    <div class="reports-list__reports">
      <transition-group class="reports-list__reports-wrapper" name="flip-list" tag="div">
        <div class="reports-list__report flip-list-item" v-for="(report, i) in reports" :key="`report-type-${i}`">
          <nuxt-link class="reports-list__report-link" :to="`/storage/${report.JobId}`" v-if="page == 'storagePage'">
            <h3>{{report.JobId}}</h3>
            <p>{{report.ReportType}}</p>
            <span v-show="report.CaseFileType">{{report.CaseFileType}}</span>
            <!-- <p>{{report.teamMember.name}}</p> -->
          </nuxt-link>
        </div>
      </transition-group>
      <!-- <p v-if="reportslist.length <= 0">No reports found</p> -->
    </div>
  </div>
</template>
<script>
import {mapActions} from 'vuex';
export default {
  name: "ReportsList",
  props: ['reportslist', 'sortoptions', 'page'],
  data: () => ({
    search: null,
    report: {},
    sortBy: 'JobId',
    sortDirection: 'info-bar__sort--asc',
    reports: [],
    sketches: []
  }),
  
  computed: {
    sortedReports() {
      return this.reports.sort((r1, r2) => {
        let modifier = 1
        if (this.sortDirection === 'info-bar__sort--desc') modifier = -1;
        if (r1[this.sortBy] < r2[this.sortBy] && typeof r1[this.sortBy] === 'string') return -1 * modifier;
        if (r1[this.sortBy] > r2[this.sortBy] && typeof r1[this.sortBy] === 'string') return 1 * modifier;

        if (r1[this.sortBy] < r2[this.sortBy] && typeof r1[this.sortBy] === 'object') return -1 * modifier;
        if (r1[this.sortBy] < r2[this.sortBy] && typeof r1[this.sortBy] === 'object') return -1 * modifier;
        return 0;
      })
    },
    teamMemberName() {
      return this.reports.map((v) => {
        return v.teamMember.name
      })
    }
  },
  methods: {
    ...mapActions({
      sortReports: 'sortReports',
      fetchReports: 'fetchReports'
    }),
    reportsfetched(reports) {
      this.reports = reports
    },
    sortValue(s) {
      if (s.value === this.sortBy) {
        this.sortDirection = this.sortDirection === 'info-bar__sort--asc' ? 'info-bar__sort--desc' : 'info-bar__sort--asc';
      }
      this.sortBy = s.value
    },
    /* formattingTeamMember() {
      this.sortedReports.forEach((v) => {
        if (v.teamMember) {
          v.teamMember = v.teamMember.first + ' ' + v.teamMember.last
        }       
      })
    } */
  },
  created() {
    this.reports = this.reportslist
  },
  mounted() {
    //this.formattingTeamMember()
  }
}
</script>
<style lang="scss">
.flip-list-item {
  perspective: 5000px;
  transition: all 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  //transform: translate3d(0, 10px, 0) scale(1);
}

.flip-list-move {
  transition: transform 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  //transform: translate3d(0, 10px, 0) scale(1);
}

.flip-list-enter,
.flip-list-leave-to {
  opacity: 0;
  transition: all 500ms cubic-bezier(0.59, 0.12, 0.34, 0.95);
  transform: translate3d(0, -110px, 0) scale(.01);
}

.flip-list-leave-active {
  position: absolute;
}

.shown {
  opacity: 1;
  transform: scale(1);
}

.reports-list {
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  column-gap: 40px;
  grid-area: reports;
  padding:40px 0;

  &--search-list {
    //display:grid;
  }

  &__reports>span {
    display: flex;
    flex-wrap: wrap;
  }

  &__reports-wrapper {
    display: flex;
    flex-wrap: wrap;
  }

  &>span {

    &>h2 {
      display: flex;
      width: 100%;
      margin: 40px 0 10px;
    }
  }

  &__report {
    max-width: 237px;
    width: 100%;
    padding: 5px;
    background-color: $color-white;

    &:not(:first-child) {
      .reports-list__report {
        margin-left: 0px;
      }
    }
  }

  &__report-link {
    padding: 20px 45px;
    display: block;
    box-shadow: -1px 2px 12px -2px rgba($color-black, .8);
    border: 1px solid #a09999;
    height:100%;

    p {
      margin-bottom:5px;
    }
  }

  &__skeleton-loading {
    display: flex;
    width: 100%;

    &>div:not(:first-child) {
      margin-left: 20px;
    }
  }
}

.info-bar {
  display: grid;
  padding-bottom: 40px;
  grid-template-rows: 46px;
  grid-template-columns: 1fr 1fr;
  column-gap: 30px;
  align-items: center;
  justify-content: space-between;
  font-weight: 500;

  &__search-wrapper {
    height: 100%;
    display: flex;
    align-items: flex-end;

    &--items {
      width: 100%;
      height: 47px;
      display: flex;
      align-items: center;
    }
  }

  &__search {
    height: 42px;
  }

  &__sort {
    max-width: 300px;
    width: 100%;
    height: 100%;
    display: flex;

    a {
      padding: 10px 14px;
      background: #a09999;
      margin: 0 10px 0 0;
    }

    &--asc:after {
      content: "\25B2";
    }

    &--desc:after {
      content: "\25BC";
    }

    &--label {
      width: 20%;
      display: flex;
      align-items: center;
    }

    &--trigger {
      padding: 8px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    &--options {
      opacity: 0;
      display: flex;
      flex-direction: column;
      padding: 0 5px;
      transition: all .2s ease-in;
      cursor: none;
      visibility: hidden;
    }
  }

  &__sort-box {
    display: block;
    height: 0;
    transition: height .3s ease-in;
    background-color: $color-white;
    z-index: 2;
    position: relative;
    border: 1px solid $color-black;

    &.open {
      height: 217px;
      transition: height .3s ease-in;

      .info-bar__sort--options {
        opacity: 1;
        visibility: visible;
        cursor: pointer;
      }
    }
  }
}
</style>