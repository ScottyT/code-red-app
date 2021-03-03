<template>
  <div class="reports-list-wrapper">
    <h1 class="reports-list-wrapper__heading">Reports</h1> <!-- Change depending on which report type is showing -->
    <div class="applied-filters-section">
      <h2 class="applied-filters-section__heading">Report Type</h2>
      <div v-for="type in reportTypeFilters" :key="type.id" class="applied-filters-section__filter-options">
        <input type="checkbox" v-model="checkedReportFilters" @change="checkRep()" :value="type" :id="type.name.toLowerCase()" />
        <label :for="type.name.toLowerCase()">{{type.value}}</label>
      </div>
      <h2 class="applied-filters-section__heading">Employees</h2>
      <div class="applied-filters-section__filter-options" v-for="employee in employees" :key="employee.id">
        <input type="checkbox" v-model="checkedNameFilters" @change="checkRep()" :value="employee" :id="employee.name.toLowerCase()" />
        <label :for="employee.name.toLowerCase()">{{employee.name}}</label>
      </div>
    </div>
    <h2 v-if="reports && reports.length < 0">You don't have any reports to show</h2>
      <reports-list :reportslist="repList" :sortoptions="sortOptions" page="reportsPage" v-else />
      
      <!-- <div class="filter-pills">
        <div class="filter-pills__pill" v-for="(filter, i) in filteredArr" :key="i" @click="removeFilter(filter)">
          <v-icon light class="filter-pills__pill-icon">mdi-close-circle</v-icon>{{filter.name}}
        </div>
      </div> -->
      
    </div>
</template>
<script>
import Autocomplete from './Autocomplete.vue'
  export default {
    components: { Autocomplete },
    name: "ReportsDash",
    props: ['reports', 'employees', 'shadowArr'],
    data: () => ({
      select:null,
      sortOptions: [
        { value: 'JobId', text: 'Report Id' },
        { value: 'teamMember', text: 'Employee' },
      ],
      selectActive: false,
      reportTypeFilters: [
        { id:1, value: "Dispatch", name: "dispatch" },
        { id:2, value: "Rapid Response", name: "rapid-response" },
        { id: 3, value: "Daily Containment", name: "daily-containment" }
      ],
      checkedReportFilters: [],
      checkedNameFilters: [],
      empList:[],
      filteredArr: [],
      report:{},
      repList: [],
      reportsArr: [], //user to store reports
      items:[], // used for search
    }),
    computed:{
      list: {
        get() {
          return this.reports
        },
        set(value) {
          this.reports = value
        }
      },
    },
    watch: {
      reports(newValue) {
        this.repList = newValue
      }
    },
    methods: {
      displayResult(value) {
        this.report = this.reports.find(e => {
          return e.JobId == value
        })
      },
      checkRep() {
        var reportFil = this.checkedReportFilters
        var nameFil = this.checkedNameFilters
        this.filteredArr = reportFil.concat(nameFil)
        let resultRep = []
        let resultName = []
        if (reportFil.length > 0) {
          resultRep = this.reports.filter(a => {
            return reportFil.some(b => a.ReportType === b.name)
          })
          this.repList = resultRep
        }
        if (nameFil.length > 0) {
          resultName = this.reports.filter(a => {
            return nameFil.some(b => a.id === b.id)
          })
          /* resultName = this.reports.map(x => ({...x,teamMember:nameFil.includes(x.teamMember)}))
          console.log("result name", resultName) */
          this.repList = resultName
        }
        if (reportFil.length > 0 && nameFil.length > 0) {
          // let finalResult = resultRep.concat(resultName);
          // finalResult = [...new Set([...resultRep, ...resultName])]
          var nameMap = nameFil.map((v) => { return v.id })
          let finalResult = resultRep.filter(e => {
            return nameMap.indexOf(e.id) >= 0;
          })
          this.repList = finalResult
        }
        if (reportFil.length <= 0 && nameFil.length <= 0) {
          this.repList = this.reports
        }
      },
      removeFilter(option) {
        var index = this.filteredArr.map((x) => {return x.name}).indexOf(option.name)
        var indexRep = this.checkedReportFilters.map((x) => {return x.name}).indexOf(option.name)
        var indexName = this.checkedNameFilters.map((x) => {return x.name}).indexOf(option.name)
        if (index > -1) {
          this.filteredArr.splice(index, 1)

          if (indexRep > -1) {
            return this.checkedReportFilters.splice(indexRep, 1)
          }
          if (indexName > -1) {
            return this.checkedNameFilters.splice(indexName, 1)
          }
        }
      }
    },
    created() {
      this.repList = this.list
    }
  }
</script>
<style lang="scss">
  .reports-list-wrapper {
    padding: 45px 4vw;
    display:grid;
    grid-template-areas:"list-title list-title"
      "filters reports";
    grid-template-columns:190px 1fr;
    @include respond(tabletMid) {
      grid-template-columns:300px 1fr;
    }
    &__heading {
      grid-area:list-title;
      text-align:center;
    }
  }
  .applied-filters-section {
    grid-area:filters;
    
    &__heading {
      &:not(:first-child) {
        padding-top:20px;
      }
    }
  }

  .filter-pills {
    padding-bottom:20px;
    display:inline-flex;

    &__pill {
      box-shadow:3px 3px 4px #2f5882, -3px -2px 8px #d1e1ea;
      border-radius:15px;
      padding:0px 10px;
      height:35px;
      line-height:31px;
      position: relative;
      cursor:pointer;
      &:not(:first-child) {
        margin-left:10px;
      }

      input[type="checkbox"] {
        appearance: none;
        width:100%;
        height:100%;
        position:absolute;
        z-index:2;
      }
    }
    &__pill-icon {
      padding-right:5px;
      z-index:1;
    }
  }
  
</style>