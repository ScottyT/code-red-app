<template>
  <div>
    <span v-if="!isLoggedIn">
      <LazyLoginForm /></span>
    <div v-else-if="isLoggedIn">
      <div class="form-wrapper form-wrapper__case-file">
        <h1 class="text-center">Water Emergency Services Incorporated</h1>
        <h2 class="text-center">Daily Technician Case File Report</h2>
        <ValidationObserver v-slot="{ handleSubmit }">
          <h2>{{message}}</h2>
          <h2 class="alert alert--error">{{errorMessage}}</h2>
          <form ref="form" class="form" @submit.prevent="handleSubmit(submitForm)" v-if="!submitted">
            <div class="form__form-group">
              <ValidationProvider rules="required" v-slot="{ errors, ariaMsg }" name="Job Id" class="form__input--input-group">
                <input type="hidden" v-model="selectedJobId" />
                <label class="form__label">Job ID Number</label>
                <select class="form__select" v-model="selectedJobId">
                  <option disabled value="">Please select a Job ID</option>
                  <option v-for="(item, i) in $store.state.jobids" :key="`jobid-${i}`">{{item}}</option>
                </select>
                <span class="form__input--error" v-bind="ariaMsg">{{ errors[0] }}</span>
              </ValidationProvider>
              <div class="form__input--input-group">
                <label class="form__label">Team Lead ID #</label>
                <input type="text" readonly v-model="getUser.id" name="teamLeadId" class="form__input" />
              </div>
              <div class="form__input--input-group">
                <label for="date" class="form__label">Date</label>
                <input id="date" v-model="dateFormatted" readonly class="form__input" />
              </div>
              <div class="form__input--input-group">
                <label for="location" class="form__label">Address</label>
                <div id="geocoder" ref="geocoder" class="form__geocoder form__input"
                     @change="$nuxt.$emit('location-updated')"></div>
              </div>
            </div>
            <div class="form__form-group">
              <label class="form__label">Address</label>
              <input v-model="location.address" name="Address" type="text" class="form__input form__input--long" />
              <label class="form__label">City, State, and Zip</label>
              <input v-model="location.cityStateZip" name="CityStateZip" type="text"
                     class="form__input form__input--long" />
            </div>
            <div class="form__form-group form__form-group--info-box">
              <h3>1) CONTENT CLEANING TECHNICIAN INSPECTION</h3>
              <ol class="form__form-group--listing">
                <li v-for="(item, i) in contentCleaningInspection" :key="`content-cleaning-${i}`">
                  <span>{{item.subheading}}</span>
                  <ol class="form__form-group form__form-group--sublisting">
                    <li v-for="subitem in item.sublist" :key="subitem.label">
                      <input :id="subitem.label" type="checkbox" v-model="selectedContentCleaning" :value="subitem" />
                      <label :for="subitem.label" class="form__label">{{subitem.label}}</label>
                    </li>
                  </ol>
                </li>
              </ol>
            </div>
            <div class="form__form-group form__form-group--info-box">
              <h3>2) WATER RESTORATION TECHNICIAN INSPECTION</h3>
              <ol class="form__form-group--listing">
                <li v-for="(item, i) in waterRestorationInspection" :key="`water-restoration-${i}`">
                  <span>{{item.subheading}}</span>
                  <ol class="form__form-group form__form-group--sublisting">
                    <li v-for="subitem in item.sublist" :key="subitem.label">
                      <input :id="subitem.label" type="checkbox" v-model="selectedWaterRestoration" :value="subitem" />
                      <label :for="subitem.label" class="form__label">{{subitem.label}}</label>
                    </li>
                  </ol>
                </li>
              </ol>
            </div>
            <div class="form__form-group form__form-group--info-box">
              <h3>3) WATER REMEDIATION TECHNICIAN ASSESSMENT</h3>
              <ol class="form__form-group--listing">
                <li v-for="(item, i) in waterRemediationAssesment" :key="`water-remdiation-${i}`">
                  <span>{{item.subheading}}</span>
                  <ol class="form__form-group form__form-group--sublisting">
                    <li v-for="subitem in item.sublist" :key="subitem.label">
                      <input :id="subitem.label" type="checkbox" v-model="selectedWaterRemediation" :value="subitem" />
                      <label :for="subitem.label" class="form__label">{{subitem.label}}</label>
                    </li>
                  </ol>
                </li>
              </ol>
            </div>
            <div class="form__form-group form__form-group--info-box">
              <h3>4) OVERVIEW OF SCOPE OF WORK</h3>
              <ol class="form__form-group--listing">
                <li v-for="(item, i) in overviewScopeOfWork" :key="`scope-${i}`">
                  <span>{{item.subheading}}</span>
                  <ol class="form__form-group form__form-group--sublisting">
                    <li v-for="subitem in item.sublist" :key="subitem.label">
                      <input :id="subitem.label" type="checkbox" v-model="selectedOverviewScope" :value="subitem" />
                      <label :for="subitem.label" class="form__label">{{subitem.label}}</label>
                    </li>
                  </ol>
                </li>
              </ol>
            </div>
            <div class="form__form-group form__form-group--info-box">
              <h3>5) SPECIALIZED EXPERT</h3>
              <ol class="form__form-group--listing">
                <li v-for="(item, i) in specializedExpert" :key="`expert-${i}`">
                  <span>{{item.subheading}}</span>
                  <ol class="form__form-group form__form-group--sublisting">
                    <li v-for="subitem in item.sublist" :key="subitem.label">
                      <input :id="subitem.label" type="checkbox" v-model="selectedExpert" :value="subitem" />
                      <label :for="subitem.label" class="form__label">{{subitem.label}}</label>
                    </li>
                  </ol>
                </li>
              </ol>
            </div>
            <div class="form__form-group form__form-group--info-box">
              <h3>6) SCOPE OF WORK</h3>
              <ol class="form__form-group--listing">
                <li v-for="(item, i) in scopeOfWork" :key="`scope2-${i}`">
                  <span>{{item.subheading}}</span>
                  <ol class="form__form-group form__form-group--sublisting">
                    <li v-for="subitem in item.sublist" :key="subitem.label">
                      <input :id="subitem.label" type="checkbox" v-model="selectedScope" :value="subitem" />
                      <label :for="subitem.label" class="form__label">{{subitem.label}}</label>
                    </li>
                  </ol>
                </li>
              </ol>
            </div>
            <div class="form__form-group form__form-group--info-box">
              <h3>7) PROJECT WORK PLANS</h3>
              <ol class="form__form-group--listing">
                <li v-for="(item, i) in projectWorkPlans" :key="`work-plans-${i}`">
                  <span>{{item.subheading}}</span>
                  <ol class="form__form-group form__form-group--sublisting">
                    <li v-for="subitem in item.sublist" :key="subitem.label">
                      <input :id="subitem.label" type="checkbox" v-model="selectedWorkPlans" :value="subitem" />
                      <label :for="subitem.label" class="form__label">{{subitem.label}}</label>
                    </li>
                  </ol>
                </li>
              </ol>
            </div>
            <div class="form__form-group--full-width">
              <label for="notes" class="form__label">Notes</label>
              <textarea class="form__input--textbox form__input" v-model="notes"></textarea>
            </div>
            <div class="form__form-group--block form__section">
              <h3>Evaluation Logs</h3>
              <div class="form__input-wrapper">
                <div class="form__input--input-group">
                  <label for="dispatchToProperty" class="form__label">Dispatch to Property</label>
                  <v-dialog ref="dispatchDialog" v-model="evalLogsDialog.dispatchToProperty" persistent
                            :return-value.sync="dispatchToProperty" transition="scale-transition" max-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <input type="text" id="dispatchToProperty" v-model="dispatchPropertyFormatted" class="form__input"
                             v-bind="attrs" v-on="on" />
                      <span class="button" @click="dispatchToProperty = ''">clear</span>
                    </template>
                    <v-time-picker v-if="evalLogsDialog.dispatchToProperty" v-model="dispatchToProperty" format="ampm"
                                   full-width>
                      <v-spacer></v-spacer>
                      <v-btn text color="#fff" @click="evalLogsDialog.dispatchToProperty = false">Cancel</v-btn>
                      <v-btn text color="#fff" @click="$refs.dispatchDialog.save(dispatchToProperty)">OK</v-btn>
                    </v-time-picker>
                  </v-dialog>
                </div>
                <div class="form__input--input-group">
                  <label for="startTime" class="form__label">Start Time</label>
                  <v-dialog ref="dialogEvalStart" v-model="evalLogsDialog.evalStart" persistent
                            :return-value.sync="evalStart" transition="scale-transition" max-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <input type="text" id="startTime" v-model="evalStartFormatted" class="form__input" v-bind="attrs"
                             v-on="on" />
                      <span class="button" @click="evalStart = ''">clear</span>
                    </template>
                    <v-time-picker v-if="evalLogsDialog.evalStart" v-model="evalStart" format="ampm" full-width>
                      <v-spacer></v-spacer>
                      <v-btn text color="#fff" @click="evalLogsDialog.evalStart = false">Cancel</v-btn>
                      <v-btn text color="#fff" @click="$refs.dialogEvalStart.save(evalStart)">OK</v-btn>
                    </v-time-picker>
                  </v-dialog>
                </div>
                <div class="form__input--input-group">
                  <label for="endTime" class="form__label">End Time</label>
                  <v-dialog ref="dialogEvalEnd" v-model="evalLogsDialog.evalEnd" persistent :return-value.sync="evalEnd"
                            transition="scale-transition" max-width="290px">
                    <template v-slot:activator="{ on, attrs }">
                      <input type="text" id="endTime" v-model="evalEndFormatted" class="form__input" v-bind="attrs"
                             v-on="on" />
                      <span class="button" @click="evalEnd = ''">clear</span>
                    </template>
                    <v-time-picker v-if="evalLogsDialog.evalEnd" v-model="evalEnd" format="ampm" full-width>
                      <v-spacer></v-spacer>
                      <v-btn text color="#fff" @click="evalLogsDialog.evalEnd = false">Cancel</v-btn>
                      <v-btn text color="#fff" @click="$refs.dialogEvalEnd.save(evalEnd)">OK</v-btn>
                    </v-time-picker>
                  </v-dialog>
                </div>
                <div class="form__input--input-group">
                  <label for="totalTime" class="form__label">Total Time</label>
                  <input type="text" readonly v-model="duration" />
                </div>
                <div class="form__input--input-group">
                    <input id="verifyCheckbox" :value="workCompletedAfterHours" v-model="workCompletedAfterHours" type="checkbox" />
                    <label for="verifyCheckbox" class="form__label">Work Completed After Hours</label>
                </div>
              </div>
              <div class="form__form-group">
                <div class="form__input-wrapper">
                  <label class="form__label">Sign for Verification</label>
                  <lazy-signature-pad-modal :sigData="verifySig" sigRef="verifySignaturePad" />
                </div>
              </div>
            </div>
            <div class="form__button-wrapper"><button class="button form__button-wrapper--submit" type="submit">{{ submitting ? 'Submitting' : 'Submit' }}</button></div>
          </form>
        </ValidationObserver>
      </div>
    </div>
  </div>
</template>
<script>
  import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
  import {
    mapGetters, mapActions
  } from 'vuex';
  import moment from 'moment';
  export default {
    data: (vm) => ({
        jobId: null,
        date: new Date().toISOString().substr(0, 10),
        dateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        dateDialog: false,
        location: {
          address: null,
          city: null,
          cityStateZip: null
        },
        message: '',
        errorMessage: '',
        submitted: false,
        submitting: false,
        contentCleaningInspection: [
            {
                subheading: "Content - (On-site Emergency Action Plan)",
                sublist: [
                    {label: "On-Site Content Manipulation", group: "Content - (On-site Emergency Action Plan)"},
                    {label: "On-Site Brick & Stack Furniture", group: "Content - (On-site Emergency Action Plan)"},
                    {label: "Furniture Dolly & Special Equip", group: "Content - (On-site Emergency Action Plan)"},
                ]
            },
            {
                subheading: "Content - (Off-site Emergency Action Plan)",
                sublist: [
                    {label: "Inventory Content", group: "Content - (Off-site Emergency Action Plan)"},
                    {label: "On-Site Storage Pod", group: "Content - (Off-site Emergency Action Plan)"},
                    {label: "Off-Site Storage Warehouse", group: "Content - (Off-site Emergency Action Plan)"},
                    {label: "Small Box & Tape", group: "Content - (Off-site Emergency Action Plan)"},
                    {label: "Medium Box & Tape", group: "Content - (Off-site Emergency Action Plan)"},
                    {label: "Large Box & Tape", group: "Content - (Off-site Emergency Action Plan)"},
                    {label: "Moving Van 16” & Greater", group: "Content - (Off-site Emergency Action Plan)"},
                    {label: "Dumpster Truck Load of Debris", group: "Content - (Off-site Emergency Action Plan)"},
                    {label: "Dumpster 12 Yard or Greater", group: "Content - (Off-site Emergency Action Plan)"}
                ]
            }
        ],
        selectedContentCleaning:[],
        waterRestorationInspection: [
            {
                subheading: "Daily Preliminary Determination",
                sublist: [
                    {label: "Site Specific Safety", group: "Daily Preliminary Determination"},
                    {label: "Status of Water Intrusion", group: "Daily Preliminary Determination"},
                    {label: "Power Capability", group: "Daily Preliminary Determination"},
                    {label: "Water Migration", group: "Daily Preliminary Determination"},
                    {label: "Assembly Restorability", group: "Daily Preliminary Determination"},
                    {label: "Substructure Evaluation", group: "Daily Preliminary Determination"},
                    {label: "HVAC Evaluation", group: "Daily Preliminary Determination"},
                    {label: "Secondary Damages", group: "Daily Preliminary Determination"},
                    {label: "High Risk Occupants", group: "Daily Preliminary Determination"},
                    {label: "Public Health issues Exist", group: "Daily Preliminary Determination"},
                    {label: "Risk of Health Effects", group: "Daily Preliminary Determination"},
                    {label: "Occupants Need to Express", group: "Daily Preliminary Determination"},
                    {label: "Believe of Aerosolizing", group: "Daily Preliminary Determination"},
                    {label: "Project Should Stop", group: "Daily Preliminary Determination"},
                    {label: "Identify Contaminates", group: "Daily Preliminary Determination"},
                    {label: "Instrument Documentation", group: "Daily Preliminary Determination"}
                ]
            },
            {
                subheading: "Daily Moisture Determinations",
                sublist: [
                    {label: "Water Migration Mapping", group: "Daily Moisture Determinations"},
                    {label: "Water Intrusion Tracking", group: "Daily Moisture Determinations"},
                    {label: "Free Water Tracking", group: "Daily Moisture Determinations"},
                    {label: "Bound Water Tracking", group: "Daily Moisture Determinations"},
                    {label: "Category 1 Water (Supply)", group: "Daily Moisture Determinations"},
                    {label: "Category 2 Water (Drain)", group: "Daily Moisture Determinations"},
                    {label: "Category 3 Water (Waste)", group: "Daily Moisture Determinations"},
                    {label: "Regulated, HMR, Mold", group: "Daily Moisture Determinations"},
                    {label: "Class 1 Intrusion (-5%)", group: "Daily Moisture Determinations"},
                    {label: "Class 2 Intrusion (5-40%)", group: "Daily Moisture Determinations"},
                    {label: "Class 3 Intrusion (+40%)", group: "Daily Moisture Determinations"},
                    {label: "Class 4 Intrusion (Bound)", group: "Daily Moisture Determinations"}
                ]
            }
        ],
        selectedWaterRestoration: [],
        waterRemediationAssesment: [
            {
                subheading: "Restorer Occupant Protection",
                sublist: [
                    {label: "Site Safety Survey", group:"Restorer Occupant Protection"},
                    {label: "Emergency Action Plans", group:"Restorer Occupant Protection"},
                    {label: "Fire Prevention Plan", group:"Restorer Occupant Protection"},
                    {label: "Eye Protection", group:"Restorer Occupant Protection"},
                    {label: "Disposable Coveralls, Hood, Booties", group:"Restorer Occupant Protection"},
                    {label: "Hand Protection", group:"Restorer Occupant Protection"},
                    {label: "Respiratory Protection", group:"Restorer Occupant Protection"},
                    {label: "Head Protection", group:"Restorer Occupant Protection"},
                    {label: "Hearing Protection", group:"Restorer Occupant Protection"}
                ]
            },
            {
                subheading: "Warning Signs",
                sublist: [
                    {label: "DNE – Sewage Remediation in Progress", group: "Warning Signs"},
                    {label: "Caution: Slip, Trip, and Fall Hazards", group: "Warning Signs"},
                    {label: "Caution: Hard Hat Area", group: "Warning Signs"},
                    {label: "Work Area Under Negative Air-Pressure", group: "Warning Signs"},
                    {label: "No Unauthorized Entry", group: "Warning Signs"},
                    {label: "Personal Protective Equipment Required", group: "Warning Signs"}
                ]
            },
            {
                subheading: "Hazard Communication",
                sublist: [
                    {label: "Inform Multi-Employers", group: "Hazard Communication"},
                    {label: "Inform Protection Means", group: "Hazard Communication"},
                    {label: "Provide Access to SDS", group: "Hazard Communication"},
                    {label: "Inform Employers of Signs", group: "Hazard Communication"},
                    {label: "Share Protection Means", group: "Hazard Communication"}
                ]
            },
            {
                subheading: "Safe Work Practices in Contaminated Environments",
                sublist: [
                    {label: "Remove PPE In & Out", group: "Safe Work Practices in Contaminated Environments"},
                    {label: "Contamination Shower", group: "Safe Work Practices in Contaminated Environments"},
                    {label: "Dispose of PPE", group: "Safe Work Practices in Contaminated Environments"},
                    {label: "Do not Cross Contaminate", group: "Safe Work Practices in Contaminated Environments"},
                    {label: "Chemical Resistant Gloves", group: "Safe Work Practices in Contaminated Environments"},
                    {label: "2nd Pair of Rubber Glovers", group: "Safe Work Practices in Contaminated Environments"},
                    {label: "Buddy System", group: "Safe Work Practices in Contaminated Environments"},
                    {label: "Address First Aid promptly", group: "Safe Work Practices in Contaminated Environments"},
                    {label: "Tail Gate Meeting", group: "Safe Work Practices in Contaminated Environments"},
                    {label: "Emergency Plan Discussed", group: "Safe Work Practices in Contaminated Environments"},
                    {label: "Emergency Wash sites", group: "Safe Work Practices in Contaminated Environments"},
                    {label: "Report Injuries Immediately", group: "Safe Work Practices in Contaminated Environments"},
                ]
            }
        ],
        selectedWaterRemediation: [],
        overviewScopeOfWork: [
            {
                subheading: "Itemization of services to be performed Overview",
                sublist: [
                    {label: "Determinations", group: "Itemization of services to be performed Overview"},
                    {label: "Administration Procedures", group: "Itemization of services to be performed Overview"},
                    {label: "Project Documentation", group: "Itemization of services to be performed Overview"},
                    {label: "Risk Management", group: "Itemization of services to be performed Overview"},
                    {label: "Equipment", group: "Itemization of services to be performed Overview"},
                    {label: "Instruments", group: "Itemization of services to be performed Overview"},
                    {label: "Tools", group: "Itemization of services to be performed Overview"},
                    {label: "Building Material Science", group: "Itemization of services to be performed Overview"},
                    {label: "Limitations", group: "Itemization of services to be performed Overview"},
                    {label: "Complications", group: "Itemization of services to be performed Overview"},
                    {label: "Complexities", group: "Itemization of services to be performed Overview"},
                    {label: "Conflicts", group: "Itemization of services to be performed Overview"},
                    {label: "Contents Evaluation", group: "Itemization of services to be performed Overview"},
                    {label: "Restoration", group: "Itemization of services to be performed Overview"},
                    {label: "Remediation", group: "Itemization of services to be performed Overview"},
                    {label: "HVAC", group: "Itemization of services to be performed Overview"}
                ]
            },
            {
                subheading: "Anti-Microbial Technology",
                sublist: [
                    {label: "Anti-Microbial Agent", group: "Anti-Microbial Technology"},
                    {label: "Odor Counter Agent", group: "Anti-Microbial Technology"},
                    {label: "Mold Spray Agent", group: "Anti-Microbial Technology"},
                    {label: "Biological Cleaning Agent", group: "Anti-Microbial Technology"},
                    {label: "Anti-Micro Sealant", group: "Anti-Microbial Technology"},
                    {label: "Odor Shellac Sealant", group: "Anti-Microbial Technology"},
                    {label: "Mold/Mildew Sealant", group: "Anti-Microbial Technology"},
                    {label: "Encapsulate Sealant", group: "Anti-Microbial Technology"}
                ]
            }
        ],
        selectedOverviewScope: [],
        specializedExpert: [
            {
                subheading:"Category Two & Three Remediation, Regulated, HMR, Mold",
                sublist: [
                    {label:"Cat 2 & 3 Water", group: "Category Two & Three Remediation, Regulated, HMR, Mold"},
                    {label:"Regulated Material", group: "Category Two & Three Remediation, Regulated, HMR, Mold"},
                    {label:"Mold", group: "Category Two & Three Remediation, Regulated, HMR, Mold"},
                    {label:"(IEP) Assessment Request", group: "Category Two & Three Remediation, Regulated, HMR, Mold"},
                    {label:"HMR Testing and Eval.", group: "Category Two & Three Remediation, Regulated, HMR, Mold"},
                    {label:"HMR Protocol Reporting", group: "Category Two & Three Remediation, Regulated, HMR, Mold"},
                    {label:"BIO Testing & Eval.", group: "Category Two & Three Remediation, Regulated, HMR, Mold"},
                    {label:"BIO Protocol Reporting", group: "Category Two & Three Remediation, Regulated, HMR, Mold"}
                ]
            }
        ],
        selectedExpert: [],
        scopeOfWork: [
            {
                subheading: "Itemization Scope of Work: Water Removal Equipment, and Tools",
                sublist: [
                    {label: "Submersible Pumps", group: "Itemization Scope of Work: Water Removal Equipment, and Tools"},
                    {label: "Surface Pump", group: "Itemization Scope of Work: Water Removal Equipment, and Tools"},
                    {label: "Portable Extraction Unit", group: "Itemization Scope of Work: Water Removal Equipment, and Tools"},
                    {label: "Mounted Extraction Unit", group: "Itemization Scope of Work: Water Removal Equipment, and Tools"}
                ]
            },
            {
                subheading: "Itemization Scope of Work: Air Moving Equipment",
                sublist: [
                    {label: "Centrifugal Airmovers", group: "Itemization Scope of Work: Air Moving Equipment"},
                    {label: "Axil Airmovers", group: "Itemization Scope of Work: Air Moving Equipment"},
                    {label: "Cavity Drying Equipment", group: "Itemization Scope of Work: Air Moving Equipment"},
                    {label: "Pressure Attachments", group: "Itemization Scope of Work: Air Moving Equipment"}
                ]
            },
            {
                subheading: "Itemization Scope of Work: Air Filtration Filters (((Particle 1-2) (Micro – HEPA)) (Gasses & Vapors – Carbon))",
                sublist: [
                    {label: "Pre-Filter (1)", group: "Itemization Scope of Work: Air Filtration Filters (((Particle 1-2) (Micro – HEPA)) (Gasses & Vapors – Carbon))"},
                    {label: "Secondary Filter (2)", group: "Itemization Scope of Work: Air Filtration Filters (((Particle 1-2) (Micro – HEPA)) (Gasses & Vapors – Carbon))"},
                    {label: "HEPA Filter (3)", group: "Itemization Scope of Work: Air Filtration Filters (((Particle 1-2) (Micro – HEPA)) (Gasses & Vapors – Carbon))"},
                    {label: "Carbon Filter (3&4)", group: "Itemization Scope of Work: Air Filtration Filters (((Particle 1-2) (Micro – HEPA)) (Gasses & Vapors – Carbon))"}
                ]
            },
            {
                subheading: "Itemization Scope of Work: Air Filtration Devices",
                sublist: [
                    {label: "AFDs", group: "Itemization Scope of Work: Air Filtration Devices"},
                    {label: "NAMs", group: "Itemization Scope of Work: Air Filtration Devices"},
                    {label: "Scrubbers", group: "Itemization Scope of Work: Air Filtration Devices"},
                    {label: "Pressure Attachments", group: "Itemization Scope of Work: Air Filtration Devices"}
                ]
            },
            {
                subheading:"Itemization Scope of Work: Air Treatment Devices",
                sublist: [
                    {label: "Ozone Machine", group: "Itemization Scope of Work: Air Treatment Devices"},
                    {label: "Hydroxyl Generators", group: "Itemization Scope of Work: Air Treatment Devices"},
                    {label: "Electrostatic Precipitators", group: "Itemization Scope of Work: Air Treatment Devices"},
                    {label: "Ultraviolet Lamps", group: "Itemization Scope of Work: Air Treatment Devices"}
                ]
            },
            {
                subheading: "Itemization Scope of Work: Dehumidification Equipment",
                sublist: [
                    {label: "Conventional Refrigerant", group: "Itemization Scope of Work: Dehumidification Equipment"},
                    {label: "Low-Grain Refrigerant", group: "Itemization Scope of Work: Dehumidification Equipment"},
                    {label: "Desiccant Dehumidifier", group: "Itemization Scope of Work: Dehumidification Equipment"},
                    {label: "Pressure Attachments", group: "Itemization Scope of Work: Dehumidification Equipment"}
                ]
            },
            {
                subheading: "Itemization Scope of Work: Heat-Drying Systems",
                sublist: [
                    {label: "Electric Heater", group: "Itemization Scope of Work: Heat-Drying Systems"},
                    {label: "Hydronic Heaters", group: "Itemization Scope of Work: Heat-Drying Systems"},
                    {label: "Radiant Heat Device", group: "Itemization Scope of Work: Heat-Drying Systems"},
                    {label: "Fired-Heat Device", group: "Itemization Scope of Work: Heat-Drying Systems"}
                ]
            },
            {
                subheading: "Itemization Scope of Work: Detection and Monitoring Tools",
                sublist: [
                    {label: "Thermometers", group: "Itemization Scope of Work: Detection and Monitoring Tools"},
                    {label: "Hygrometers", group: "Itemization Scope of Work: Detection and Monitoring Tools"},
                    {label: "Psychrometers", group: "Itemization Scope of Work: Detection and Monitoring Tools"},
                    {label: "Manometers", group: "Itemization Scope of Work: Detection and Monitoring Tools"},
                    {label: "Gas Detectors", group: "Itemization Scope of Work: Detection and Monitoring Tools"},
                    {label: "Particle Counters", group: "Itemization Scope of Work: Detection and Monitoring Tools"},
                    {label: "Moisture Meters", group: "Itemization Scope of Work: Detection and Monitoring Tools"},
                    {label: "Thermal Imaging Cameras", group: "Itemization Scope of Work: Detection and Monitoring Tools"},
                    {label: "Psychrometric Charts", group: "Itemization Scope of Work: Detection and Monitoring Tools"},
                    {label: "Psychrometric Calculators", group: "Itemization Scope of Work: Detection and Monitoring Tools"},
                    {label: "Data Logging Devices", group: "Itemization Scope of Work: Detection and Monitoring Tools"},
                    {label: "Remote Monitoring System", group: "Itemization Scope of Work: Detection and Monitoring Tools"}
                ]
            },
            {
                subheading: "Itemization Scope of Work: Antimicrobial (biocide) Technology",
                sublist: [
                    {label: "Antimicrobial (Suppress)", group: "Itemization Scope of Work: Antimicrobial (biocide) Technology"},
                    {label: "Sporicide (Eliminate)", group: "Itemization Scope of Work: Antimicrobial (biocide) Technology"},
                    {label: "Bacteriostat (Retard)", group: "Itemization Scope of Work: Antimicrobial (biocide) Technology"},
                    {label: "Fungicides (Fungi)", group: "Itemization Scope of Work: Antimicrobial (biocide) Technology"}
                ]
            }
        ],
        selectedScope: [],
        projectWorkPlans:[
            {
                subheading: "Ongoing Inspections and Monitoring",
                sublist: [
                    {label: "Psychrometric Values", group: "Ongoing Inspections and Monitoring"},
                    {label: "Material Moisture Levels", group: "Ongoing Inspections and Monitoring"},
                    {label: "Progress Reporting", group: "Ongoing Inspections and Monitoring"},
                    {label: "Party Communications", group: "Ongoing Inspections and Monitoring"},
                    {label: "Evaluate Restorability", group: "Ongoing Inspections and Monitoring"},
                    {label: "Job Coordination", group: "Ongoing Inspections and Monitoring"},
                    {label: "Content Evaluations", group: "Ongoing Inspections and Monitoring"},
                    {label: "Cleaning Protocols", group: "Ongoing Inspections and Monitoring"},
                    {label: "Water Extraction", group: "Ongoing Inspections and Monitoring"},
                    {label: "Seepage Extraction", group: "Ongoing Inspections and Monitoring"},
                    {label: "Initial Clean", group: "Ongoing Inspections and Monitoring"},
                    {label: "Controlled Demo", group: "Ongoing Inspections and Monitoring"},
                    {label: "Detailed Clean - Wipe", group: "Ongoing Inspections and Monitoring"},
                    {label: "Detailed Clean - HEPA", group: "Ongoing Inspections and Monitoring"},
                    {label: "Final Cleaning", group: "Ongoing Inspections and Monitoring"},
                    {label: "HVAC Restoration", group: "Ongoing Inspections and Monitoring"},
                    {label: "Closed Drying System", group: "Ongoing Inspections and Monitoring"},
                    {label: "Open Saturated Pockets", group: "Ongoing Inspections and Monitoring"},
                    {label: "Maintain WVP", group: "Ongoing Inspections and Monitoring"},
                    {label: "Provide Continuous Airflow", group: "Ongoing Inspections and Monitoring"},
                    {label: "Air Flow Capacity", group: "Ongoing Inspections and Monitoring"},
                    {label: "Dehumidification Capacity", group: "Ongoing Inspections and Monitoring"},
                    {label: "Accelerated Energy", group: "Ongoing Inspections and Monitoring"},
                    {label: "AFD Capacity", group: "Ongoing Inspections and Monitoring"}
                ]
            }
        ],
        selectedWorkPlans: [],
        notes: "",
        evalLogsDialog: {
            dispatchToProperty: false,
            evalStart: false,
            evalEnd: false,
            evalTotalTime: false
        },
        dispatchToProperty: null,
        dispatchPropertyFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
        evalStart: new Date().toTimeString().substr(0, 5),
        evalStartFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
        evalEnd: new Date().toTimeString().substr(0, 5),
        evalEndFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
        verifySig: {
            data: '',
            isEmpty: true
        },
        workCompletedAfterHours: false,
        selectedJobId: ""
    }),
    mounted() {
        this.createGeocoder();
        this.checkStorage();
        this.mappingJobIds();
    },
    watch: {
        dispatchToProperty(val) {
            this.dispatchPropertyFormatted = this.formatTime(val)
        },
        evalStart(val) {
            this.evalStartFormatted = this.formatTime(val)
        },
        evalEnd(val) {
            this.evalEndFormatted = this.formatTime(val)
        }
    },
    computed: {
      ...mapGetters(["isLoggedIn", "getUser"]),
      duration() {
        let start = moment(this.date + 'T' + this.evalStart)
        let end = moment(this.date + 'T' + this.evalEnd)
        let duration = moment.duration(end.diff(start)).asMinutes()
        return duration + ' minutes'
      }
    },
    methods: {
      ...mapActions({
        addReport: 'indexDb/addReport',
        checkStorage: 'indexDb/checkStorage',
        mappingJobIds: 'mappingJobIds'
      }),
      formatDate(dateReturned) {
        if (!dateReturned) return null
        const [year, month, day] = dateReturned.split('-')
        return `${month}/${day}/${year}`
      },
      formatTime(timeReturned) {
        if (!timeReturned) return null
        
        const pieces = timeReturned.split(':')
        let hours
        let minutes
        if (pieces.length === 2) {
          hours = parseInt(pieces[0], 10)
          minutes = parseInt(pieces[1], 10)
        }
        const newFormat = hours >= 12 ? 'PM' : 'AM'
        hours = hours % 12
        // To display "0" as "12"
        hours = hours || 12
        minutes = minutes < 10 ? '0' + minutes : minutes
        return `${hours}:${minutes} ${newFormat}`
      },
      createGeocoder() {
        const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
        const accessToken = process.env.mapboxKey
        const geocoder = new MapboxGeocoder({
          accessToken: accessToken,
          types: 'region,place,postcode,address',
          placeholder: 'Search for address...',
        })
        geocoder.setTypes('address').addTo('.form__geocoder')
      },
      async submitForm() {
          this.message = ''
          const userNameObj = {
            first: this.getUser.name.split(" ")[0],
            last: this.getUser.name.split(" ")[1]
        }
          const reports = this.$store.state.jobids
          const evaluationLogs= [
            {label: 'Dispatch to Property', value: this.dispatchPropertyFormatted},
            {label: 'Start Time', value: this.evalStart},
            {label: 'End Time', value: this.evalEnd},
            {label: 'Total Time', value: this.duration}
        ]
          if (reports.includes(this.jobId)) {
              const post = {
                JobId: this.jobId,
                date: this.dateFormatted,
                location: this.location,
                contentCleaningInspection: this.selectedContentCleaning,
                waterRestorationInspection: this.selectedWaterRestoration,
                waterRemediationAssesment: this.selectedWaterRemediation,
                overviewScopeOfWork: this.selectedOverviewScope,
                specializedExpert: this.selectedExpert,
                scopeOfWork: this.selectedScope,
                projectWorkPlans: this.selectedWorkPlans,
                notes: this.notes,
                evaluationLogs: evaluationLogs,
                id: this.getUser.id,
                ReportType: 'case-file',
                CaseFileType: 'technician',
                teamMember: userNameObj,
                verifySig: this.verifySig.data,
                afterHoursWork: this.workCompletedAfterHours ? 'Yes' : 'No',
                notes: this.notes
              }
              this.$axios.$post("/api/case-file-report/new", post).then(() => {
                  this.message = "Report submitted"
                  this.submitted = true
                    setTimeout(() => {
                        this.message = ""
                        this.$router.push("/")
                    }, 2000)
              }).catch((err) => {
                  this.errorMessage = err
              })
          } else {
            this.submitted = false
            this.submitting = false
            this.errorMessage = "Job ID exsits"
          }
      }
    },
    created() {
      this.$nuxt.$on('location-updated', (event) => {
        const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
        const geocode = this.$refs.geocoder
        const accessToken = process.env.mapboxKey
        const g = new MapboxGeocoder({
          accessToken: accessToken,
          types: 'region,place,postcode,address',
        })
        const location = geocode.firstChild.childNodes[1].value.split(',', 3)

        const address = location[0].trim()
        let city
        let stateZip
        if (location[1] !== undefined && location[2] !== undefined) {
          city = location[1].trim()
          stateZip = location[2].trim()
          this.location.cityStateZip = city + ', ' + stateZip
        } else {
          city = ''
          stateZip = ''
        }
        this.location.address = address
        this.location.city = city
      })
    },
    beforeDestroy() {
      this.$nuxt.$off('location-updated')
    }
  }
</script>