<template>
  <div class="form-wrapper form-wrapper__rapid-form">
    <h1 class="text-center">{{company}}</h1>
    <h2 class="text-center">Rapid Response Evaluation Report</h2>
    <ValidationObserver ref="form" v-slot="{ errors }">
      <v-dialog width="400px" v-model="errorDialog">
        <div class="modal__error">
          <div v-for="(error, i) in errors" :key="`error-${i}`">
            <h3 class="form__input--error">{{ error[0] }}</h3>
          </div>
        </div>
      </v-dialog>
      <h2 class="alert alert--success">{{ successMessage }}</h2>
      <form v-if="!submitted" class="form" enctype="multipart/form-data" @submit.prevent="submitForm">
        <div class="form__form-group">
          <ValidationProvider name="Team lead id" rules="required|numeric" class="form__input-group form__input-group--normal">
            <label class="form__label">Team Lead ID #</label>
            <input v-model="id" name="teamLeadId" class="form__input" type="text" />
          </ValidationProvider>
          <div class="form__input-group form__input-group--normal">
            <label for="dateOfLoss" class="form__label">Date of Loss</label>
            <v-dialog ref="dolDialog" v-model="dolModal" :return-value.sync="dateOfLoss" persistent width="400px">
              <template v-slot:activator="{ on, attrs }">
                <input id="dateOfLoss" v-model="dolFormatted" v-bind="attrs" class="form__input" v-on="on" readonly
                  @blur="dateOfLoss = parseDate(dolFormatted)" />
              </template>
              <v-date-picker v-model="dateOfLoss" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="#fff" @click="dolModal = false">Cancel</v-btn>
                <v-btn text color="#fff" @click="$refs.dolDialog.save(dateOfLoss)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </div>
          <div class="form__input-group form__input-group--normal">
            <label for="timeOfDispatch" class="form__label">Time of Dispatch</label>
            <v-dialog ref="todDialog" v-model="todModal" :return-value.sync="timeOfDispatch" persistent width="400px">
              <template v-slot:activator="{ on, attrs }">
                <input id="timeOfDispatch" v-model="timeOfDispatchFormatted" v-bind="attrs" class="form__input" v-on="on" readonly />
              </template>
              <v-time-picker v-model="timeOfDispatch" scrollable full-width format="ampm">
                <v-spacer></v-spacer>
                <v-btn text color="#fff" @click="todModal = false">Cancel</v-btn>
                <v-btn text color="#fff" @click="$refs.todDialog.save(timeOfDispatch)">OK</v-btn>
              </v-time-picker>
            </v-dialog>
          </div>
          <div class="form__input-group form__input-group--normal">
            <label for="dateOfEval" class="form__label">Date of Evaluation</label>
            <v-dialog ref="doeDialog" v-model="doeModal" :return-value.sync="dateOfEval" persistent width="400px">
              <template v-slot:activator="{ on, attrs }">
                <input id="dateOfEval" v-model="doeFormatted" v-bind="attrs" class="form__input" v-on="on" readonly
                  @blur="dateOfEval = parseDate(doeFormatted)" />
              </template>
              <v-date-picker v-model="dateOfEval" scrollable>
                <v-spacer></v-spacer>
                <v-btn text color="#fff" @click="doeModal = false">Cancel</v-btn>
                <v-btn text color="#fff" @click="$refs.doeDialog.save(dateOfEval)">OK</v-btn>
              </v-date-picker>
            </v-dialog>
          </div>
          <ValidationProvider v-slot="{ errors }" vid="JobId" name="Job ID" rules="required" class="form__input-group form__input-group--normal">
            <label for="jobId" class="form__label">Job ID</label>
            <input v-model="jobId" id="jobId" name="jobId" class="form__input" @keydown.space.prevent type="text" />
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <div class="form__input-group form__input-group--long">
            <label for="location" class="form__label">Address</label>
            <div id="geocoder" ref="geocoder" class="form__geocoder form__input"
              @change="$nuxt.$emit('location-updated')"></div>
          </div>
        </div>
        <div class="form__form-group form__form-group--info-box" :class="{hidden: !jobId}">
          <div class="form__form-group form__form-group--images-upload-section form__section">
            <ValidationProvider  ref="idprovider" v-slot="{ validate, errors }" name="Photo ID" rules="required|image" class="form__input--upload-group">
              <label class="form__label">Photo ID</label>
              <input type="hidden" v-model="idImage" @click="validate" />
              <UiFilesUpload singleImage singleImageName="id-photo" :jobId="jobId" @sendImages="idImage = $event" />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
            <ValidationProvider v-slot="{errors}" rules="numeric|required" name="Zip code" class="form__input--upload-group" v-if="cardImages.length === 2">
              <label for="cardZip" class="form__label">Zip code on card</label>
              <input id="cardZip" class="form__input" v-model="cardZip" name="cardZip" type="text" />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form__form-group--left-side form__section">
            <label for="contactName" class="form__label">Contact Name</label>
            <input id="contactName" v-model="contactName" name="contactName" type="text" class="form__input form__input--long" />
            <label for="PropertyOwner" class="form__label">Property Owner</label>
            <input id="PropertyOwner" v-model="propertyOwner" name="PropertyOwner" type="text" class="form__input form__input--long" />
            <label class="form__label">City, State, Zip</label>
            <input v-model="location.cityStateZip" name="cityStateZip" type="text" class="form__input form__input--long" />
            <label class="form__label">Address</label>
            <input
              v-model="location.address"
              name="Address"
              type="text"
              class="form__input form__input--long"
            />
            <!-- <label class="form__label">City, State, Zip</label>
            <input
              v-model="location.cityStateZip"
              name="cityStateZip"
              type="text"
              class="form__input form__input--long"
              readonly
            /> -->
            <label class="form__label" for="phone">Phone Number</label>
            <input id="phone" v-model="phoneNumber" name="Phone" class="form__input form__input--short" type="phone"
              @input="acceptNumber" />
            <ValidationProvider v-slot="{ errors }" name="Email" rules="email|required">
              <label for="email" class="form__label">Email Address</label>
              <input v-model="emailAddress" id="email" type="email" class="form__input" name="Email" />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form__form-group--right-side form__section">
            <h4>Inital Response, Inspection, and Preliminary Determination</h4>
            <ul class="form__checkbox-wrapper--long">
              <div class="form__input--checkboxes" v-for="item in picturesCheck" :key="item.id">
                <input type="checkbox" :id="item.id" v-model="selectedPictures" :value="item.text" />
                <label :for="item.id">{{item.text}}</label>
              </div>
            </ul>
            
            <UiFilesUpload :singleImage="false" :subDir="`job-files-${date}`" :jobId="jobId" @sendImages="uploadedFiles = $event" />     
          </div>
          <div class="form__section">
            <h3>Source of Water Intrusion</h3>
            <ul class="form__checkbox-wrapper">
              <div class="form__input-wrapper--checkboxes" v-for="(type, i) in sourceOfIntrustion" :key="`loss-${i+1}`">
                <input type="checkbox" :id="`loss-${i+1}`" v-model="selectedTypes" :value="type.text" />
                <label :for="`loss-${i+1}`">{{type.text}}</label>
              </div>
            </ul>
          </div>
          <div class="form__form-group--block form__section">
            <div class="form__input-wrapper">
              <div class="form__input--input-group">
                <label for="dateOfIntrusion" class="form__label">Date of Intrusion</label>
                <v-dialog ref="dateIntrusionDialog" v-model="intrusionLogsDialog.dateIntrusion" persistent :return-value.sync="dateIntrusion" transition="scale-transition" max-width="320px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="dateOfIntrusion" v-model="dateIntrusionFormatted" class="form__input" v-bind="attrs" readonly v-on="on" />
                    <span class="button" @click="dateIntrusion = ''">clear</span>
                  </template>
                  <v-date-picker v-if="intrusionLogsDialog.dateIntrusion" v-model="dateIntrusion" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="intrusionLogsDialog.dateIntrusion = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.dateIntrusionDialog.save(dateIntrusion)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </div>
              <div class="form__input--input-group">
                <label for="timeIntrusion" class="form__label">Time of Intrusion</label>
                <v-dialog ref="timeIntrusion" v-model="intrusionLogsDialog.timeIntrusion" persistent
                  :return-value.sync="timeIntrusion" transition="scale-transition" max-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="timeIntrusion" v-model="timeIntrusionFormatted" class="form__input" readonly v-bind="attrs"
                      v-on="on" />
                    <span class="button" @click="timeIntrusion = ''">clear</span>
                  </template>
                  <v-time-picker v-if="intrusionLogsDialog.timeIntrusion" v-model="timeIntrusion" format="ampm" full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="intrusionLogsDialog.timeIntrusion = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.timeIntrusion.save(timeIntrusion)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </div>
              <div class="form__input--input-group" v-for="intrusion in intrusionSection" :key="intrusion.label">
                <label :for="intrusion.label" class="form__label">{{intrusion.label}}</label>
                <input :type="intrusion.type" :id="intrusion.label" v-model="intrusion.value" class="form__input" />
              </div>
              <div class="form__input--input-group">
                <div class="form__form-group">
                  <LazyUiSignaturePadModal :sigData="initialData" sigRef="initial1" inputId="initial1" name="Initial" width="200px" height="70px" initial />
                  <div class="form__input--initial" v-if="initialData.data !== ''">
                    <img :src="initialData.data" />
                  </div>
                  <!-- <ValidationProvider rules="required" v-slot="{errors}" vid="initial1" name="Initial">
                    <label class="form__label" for="initial1">Initial</label>
                    <input id="initial1" type="text" v-model="initial1" class="form__input form__input--short" v-uppercase />
                    <span class="form__input--error">{{ errors[0] }}</span>
                  </ValidationProvider> -->
                </div>
              </div>
            </div>
          </div>
          <div class="form__form-group--grid">
            <div class="form__section">
              <h3>Preliminary Determination</h3>
              <div class="form__checkbox-wrapper">
                <div class="form__input-wrapper--checkboxes" v-for="item in preliminaryDetermination" :key="item">
                  <input type="checkbox" :id="item" v-model="selectedPreliminary" :value="item" />
                  <label :for="item">{{item}}</label>
                </div>
              </div>
              <ValidationProvider rules="required" v-slot="{errors}" vid="initial2" name="Initial">
                <label class="form__label" for="initial2">Initial</label>
                <input id="initial2" type="text" v-model="initial2" class="form__input form__input--short" v-uppercase />
                <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
            <div class="form__section">
              <h3>Inital Moisture Inspection</h3>
              <div class="form__checkbox-wrapper">
                <div class="form__input-wrapper--checkboxes" v-for="item in moistureInspection" :key="item">
                  <input type="checkbox" :id="item" v-model="selectedInspection" :value="item" />
                  <label :for="item">{{item}}</label>
                </div>
              </div>
              <ValidationProvider rules="required" v-slot="{errors}" vid="initial3" name="Initial">
                <label class="form__label" for="initial3">Initial</label>
                <input id="initial3" type="text" v-model="initial3" class="form__input form__input--short" v-uppercase />
                <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>
            </div>
          </div>
          <div class="form__form-group form__form-group--info-box form__section">
            <label class="form__label">Initial Moisture Map</label>
            <p>An initial moisture inspection should be conducted to identify the full extent of water intrusion, including the
                identification of affected assemblies, building materials, and the edge of water mitigation. Normally, this process
                begins at the source of the water intrusion. The initial inspection process should continue in all directions from the
                source of water intrusion until the restorer identifies and documents the extent of migration. The extent of the
                moisture migration should be documented using one or more appropriate methods including at a minimum a
                moisture map. (i.e., a diagram of the structure indicating the areas affected by migrating water). IICRC S500 Pg 179</p>
            <div class="map-wrapper">
              <div class="map-wrapper__map">
                <div class="map-wrapper__map--row" v-for="n in 37" :key="n">
                  <div class="map-wrapper__map--col" v-for="n in 20" :key="n"></div>
                </div>
              </div>
              <VueSignaturePad width="100%" height="703px" ref="map" class="map-wrapper__canvas" :options="{ onBegin, minWidth: 1.5, maxWidth:3.5 }" />
              <div class="pt-3 pb-3">
                <button type="button" class="button--normal" @click="saveMap">{{ moistureMap.data !== '' ? 'Saved' : 'Save' }}</button>
                <button type="button" class="button--normal" @click="undoMap">Undo</button>
              </div>
            </div>
            <ValidationProvider rules="required" v-slot="{errors}" vid="initial4" name="Initial">
              <label class="form__label" for="initial4">Initial</label>
              <input id="initial4" type="text" v-model="initial4" class="form__input form__input--short" v-uppercase />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form__form-group form__section">
            <h3>Pre-Restoration Evaluation</h3>
            <div class="d-flex flex-wrap">
              <span class="form__input-group form__input-group--long">
                <label for="emergencyRes" class="form__label">Emergency Response Actions Identified</label>
                <input id="emergencyRes" type="text" class="form__input" v-model="preRestoreEval.emergencyResAct" />
              </span>
              <span class="form__input-group form__input-group--long">
                <label for="buildingMat" class="form__label">Building Material Restorability</label>
                <input id="buildingMat" type="text" class="form__input" v-model="preRestoreEval.buildingMatRestore" />
              </span>
              <span class="form__input-group form__input-group--long">
                <label for="contentEval" class="form__label">Content Evaluation</label>
                <input id="contentEval" type="text" class="form__input" v-model="preRestoreEval.contentEval" />
              </span>
              <span class="form__input-group form__input-group--long">
                <label for="hvacEval" class="form__label">HVAC Evaluation</label>
                <input id="hvacEval" type="text" class="form__input" v-model="preRestoreEval.hvacEval" />
              </span>
              <span class="form__input-group form__input-group--long">
                <label for="substructure" class="form__label">Substructure & Unfinished Spaces</label>
                <input id="substructure" type="text" class="form__input" v-model="preRestoreEval.substructure" />
              </span>
            </div>
          </div>
          <div class="form__section">
            <h3>Develop Initial Project Work Plan & Communicate to Headquarters</h3>
            <div class="form__checkbox-wrapper--long form__checkbox-wrapper">
              <div class="form__input-wrapper--checkboxes" v-for="(step, i) in steps" :key="`steps-${i+1}`">
                <input type="checkbox" :id="`steps-${i+1}`" v-model="selectedSteps" :value="step.text" />
                <label :for="`steps-${i+1}`">{{step.text}}</label>
              </div>
            </div>
          </div>
          <div class="form__form-group form__section">
            <ValidationProvider v-slot="{errors}" name="Insurance" rules="required" class="form__input-group form__input-group--normal">
              <label for="insurance" class="form__label">Insurance Company</label>
              <input type="text" id="insurance" class="form__input" name="insurance" v-model="insuranceCompany" />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
            <ValidationProvider v-slot="{errors}" name="claimNumber" class="form__input-group form__input-group--normal">
              <label for="claimNumber" class="form__label">Claim Number</label>
              <input type="text" id="claimNumber" class="form__input" name="claimNumber" v-model="claimNumber" />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
            <ValidationProvider v-slot="{errors}" name="policyNumber" class="form__input-group form__input-group--normal">
              <label for="policyNumber" class="form__label">Policy Number</label>
              <input type="text" id="policyNumber" class="form__input" name="policyNumber" v-model="policyNumber" />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
            <span class="form__input-group form__input-group--normal">
              <label for="adjusterName" class="form__label">Adjuster Name</label>
              <input id="adjusterName" type="text" class="form__input" v-model="adjusterName" />
            </span>
            <span class="form__input-group form__input-group--normal">
              <label for="adjusterPhone" class="form__label">Adjuster Phone</label>
              <input id="adjusterPhone" type="phone" class="form__input" v-model="adjusterPhone" v-mask="'(###) ###-####'" />
            </span>
            <ValidationProvider v-slot="{errors}" name="Adjuster email" rules="email" class="form__input-group form__input-group--normal">
              <label for="adjusterEmail" class="form__label">Adjuster Email</label>
              <input type="email" id="adjusterEmail" class="form__input" name="policyNumber" v-model="adjusterEmail" />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form__form-group--block form__section">
            <h3>Evaluation Logs</h3>
            <div class="form__input-wrapper">
              <div class="form__input--input-group">
                <label for="arrivalProperty" class="form__label">Team Arrival at Property</label>
                <v-dialog ref="dialogArrival" v-model="evalLogsDialog.arrivalAtProperty" persistent
                  :return-value.sync="arrivalAtProperty" transition="scale-transition" max-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="arrivalProperty" v-model="arrivalFormatted" class="form__input" readonly
                      v-bind="attrs" v-on="on" />
                    <span class="button" @click="arrivalAtProperty = ''">clear</span>
                  </template>
                  <v-time-picker v-if="evalLogsDialog.arrivalAtProperty" v-model="arrivalAtProperty" format="ampm"
                    full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="evalLogsDialog.arrivalAtProperty = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.dialogArrival.save(arrivalAtProperty)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </div>
              <div class="form__input--input-group">
                <label for="evalStart" class="form__label">Evaluation Report Start Time</label>
                <v-dialog ref="dialogEvalStart" v-model="evalLogsDialog.evalStart" persistent
                  :return-value.sync="evalStart" transition="scale-transition" max-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="evalStart" v-model="evalStartFormatted" class="form__input" v-bind="attrs" readonly
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
                <label for="evalEnd" class="form__label">Evaluation Report End Time</label>
                <v-dialog ref="dialogEvalEnd" v-model="evalLogsDialog.evalEnd" persistent :return-value.sync="evalEnd"
                  transition="scale-transition" max-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="evalEnd" v-model="evalEndFormatted" class="form__input" v-bind="attrs"
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
                <label for="contractSigning" class="form__label">Time of Contract Signing</label>
                <v-dialog ref="dialogContractSigning" v-model="evalLogsDialog.contractSigning" persistent
                  :return-value.sync="contractSigning" transition="scale-transition" max-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="contractSigning" v-model="contractFormatted" class="form__input"
                      v-bind="attrs" v-on="on" />
                    <span class="button" @click="contractSigning = ''">clear</span>
                  </template>
                  <v-time-picker v-if="evalLogsDialog.contractSigning" v-model="contractSigning" format="ampm"
                    full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="evalLogsDialog.contractSigning = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.dialogContractSigning.save(contractSigning)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </div>
              <!-- <div class="form__input--input-group">
                <label for="denialOfServices" class="form__label">Time of Denial of Services</label>
                <v-dialog ref="dialogDos" v-model="evalLogsDialog.denialOfServices" persistent
                  :return-value.sync="denialOfServices" transition="scale-transition" max-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="denialOfServices" v-model="dosformatted" class="form__input" v-bind="attrs"
                      v-on="on" />
                    <span class="button" @click="denialOfServices = ''">clear</span>
                  </template>
                  <v-time-picker v-if="evalLogsDialog.denialOfServices" v-model="denialOfServices" format="ampm"
                    full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="evalLogsDialog.denialOfServices = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.dialogDos.save(denialOfServices)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </div>
              <div class="form__input--input-group">
                <label for="departureOfProperty" class="form__label">Team Departure of Property</label>
                <v-dialog ref="dialogDepartureTime" v-model="evalLogsDialog.departureTime" persistent
                  :return-value.sync="departureTime" transition="scale-transition" max-width="290px">
                  <template v-slot:activator="{ on, attrs }">
                    <input type="text" id="departureOfProperty" v-model="departureTimeFormatted" class="form__input"
                      v-bind="attrs" v-on="on" />
                    <span class="button" @click="departureTime = ''">clear</span>
                  </template>
                  <v-time-picker v-if="evalLogsDialog.departureTime" v-model="departureTime" format="ampm" full-width>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="evalLogsDialog.departureTime = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.dialogDepartureTime.save(departureTime)">OK</v-btn>
                  </v-time-picker>
                </v-dialog>
              </div> -->
            </div>
          </div>
          <div class="form__section">
            <h3>Team Lead Document Verification</h3>
            <div class="form__input-wrapper--checkboxes" v-for="item in verificationCheckboxes" :key="`item${item.id+1}`">
              <input type="checkbox" :id="`item${item.id+1}`" v-model="selectedVerification" :value="item.text" />
              <label :for="`item${item.id+1}`">{{item.text}}</label>
            </div>
          </div>
          <div class="d-flex flex-column pt-4 pb-4">
            <label class="form__label">Customer (Print)</label>
            <div class="grid grid--three-column">
              <ValidationProvider v-slot="{ errors }" name="Customer first name" rules="required">
                <input id="firstname" placeholder="First" type="text" class="form__input" v-model="customerName.first" />
                <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="Customer last name" rules="required">
                <input id="lastname" placeholder="Last" type="text" class="form__input" v-model="customerName.last" />
                <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>
              <LazyUiSignaturePadModal inputId="cusSignature" :sigData="cusSignature" sigRef="cusSignaturePad" name="Customer signature" />
            </div>
          </div>
          <div class="form__form-group">            
            <ValidationProvider v-slot="{ errors }" name="Customer sign date" rules="required" class="form__input-group form__input-group--normal">
              <label class="form__label">Date</label>
              <input type="text" v-model="cusSignDate" v-mask="'##/##/####'" class="form__input" />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
            <LazyUiSignaturePadModal inputId="teamMemberSig" :sigData="teamMemberSig" sigRef="teamSignaturePad" name="Team member signature" />
          </div>
        </div>
        <div class="form__button-wrapper"><button type="submit" class="button form__button-wrapper--submit">{{ submitting ? 'Submitting' : 'Submit' }}</button></div>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
  import {mapGetters, mapState, mapActions} from 'vuex'
  import goTo from 'vuetify/es5/services/goto'
  import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
  export default {
    name: 'RapidResponse',
    props: ['slice', 'company', 'abbreviation'],
    data: (vm) => ({
      errorDialog: false,
      sigDialog: false,
      uploading: false,
      successMessage: '',
      errorMessage: [],
      uploadSuccess: '',
      submitting: false,
      submitted: false,
      jobId: null,
      timeOfDispatch: new Date().toTimeString().substr(0, 5),
      timeOfDispatchFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      dateOfLoss: new Date().toISOString().substr(0, 10),
      dolFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      dateOfEval: new Date().toISOString().substr(0, 10),
      doeFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      arrivalAtProperty: null,
      arrivalFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      evalStart: null,
      evalStartFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      evalEnd: null,
      evalEndFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      contractSigning: null,
      contractFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      denialOfServices: null,
      dosformatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      departureTime: null,
      departureTimeFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      evalLogsDialog: {
        arrivalAtProperty: false,
        evalStart: false,
        evalEnd: false,
        contractSigning: false,
        denialOfServices: false,
        departureTime: false
      },
      todModal: false,
      dolModal: false,
      doeModal: false,
      contactName: '',
      propertyOwner: '',
      phoneNumber: '',
      emailAddress: '',
      location: {
        address: null,
        cityStateZip: null,
      },
      sourceOfIntrustion: [{
          id: 1,
          text: 'Frozen Pipes',
          checked: false
        },
        {
          id: 2,
          text: 'Sump Pump Failure',
          checked: false
        },
        {
          id: 3,
          text: 'Broken Pipe',
          checked: false
        },
        {
          id: 4,
          text: 'Roof Leak',
          checked: false
        },
        {
          id: 5,
          text: 'Sprinkler System',
          checked: false
        },
        {
          id: 6,
          text: 'Outside Spicket',
          checked: false
        },
        {
          id: 7,
          text: 'Washer Line',
          checked: false
        },
        {
          id: 8,
          text: 'Toilet Overflow',
          checked: false
        },
        {
          id: 9,
          text: 'Sink Overflow',
          checked: false
        },
        {
          id: 10,
          text: 'Tub Overflow',
          checked: false
        },
        {
          id: 11,
          text: 'Sewage Backup',
          checked: false
        },
        {
          id: 12,
          text: 'Broken Valve',
          checked: false
        },
        {
          id: 13,
          text: 'Fire',
          checked: false
        },
        {
          id: 14,
          text: 'Hail',
          checked: false
        },
        {
          id: 15,
          text: 'Mold',
          checked: false
        },
        {
          id: 16,
          text: 'Vandalism',
          checked: false
        },
        {
          id: 17,
          text: 'Water',
          checked: false
        },
        {
          id: 18,
          text: 'Other',
          checked: false
        }
      ],
      intrusionLogsDialog: {
        dateIntrusion: false,
        timeIntrusion: false
      },
      intrusionSection: [
        { id:'statusOfIntrusion', label: 'Control Status of Intrusion', value: '', type: 'text' },
        { id:'structureType', label: 'Structure Type', value: '', type: 'text' },
        { id:'use', label: 'Use', value: '', type: 'text' },
        { id:'history', label: 'History', value: '', type: 'text' },
        { id:'age', label: 'Age', value: null, type: 'text' },
        { id:'appxSqft', label: 'Approximate sqft', value: null, type: 'number' },
        { id:'numberOfRooms', label: 'Number of Rooms', value: null, type: 'number' },
        { id:'numberOfFloors', label: 'Number of Floors', value: null, type: 'number' }
      ],
      dateIntrusion: new Date().toISOString().substr(0, 10),
      dateIntrusionFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      timeIntrusion: null,
      timeIntrusionFormatted: vm.formatTime(new Date().toTimeString().substr(0, 5)),
      preliminaryDetermination: [
        "Category 1 Water",
        "Category 2 Water",
        "Category 3 Water",
        "High Risk Occupents",
        "Public Health Issues Exist",
        "Risk of Adverse Health Effects",
        "Occupants Express Contaminates",
        "Believed Aerosolizing",
        "Stop & Determine Contaminates"
      ],
      moistureInspection: [
        "Free Water",
        "Bound Water",
        "Water Migration",
        "Affected Assemblies",
        "Establish a Dry Standard",
        "Instrument Documentation",
        "Class 2 (significant)",
        "Class 3 (more than 40%)",
        "Class 4 (Deeply Bound)"
      ],
      preRestoreEval:{
        emergencyResAct: '',
        buildingMatRestore: '',
        contentEval: '',
        hvacEval: '',
        substructure:''
      },
      selectedPreliminary: [],
      selectedInspection:[],
      selectedTypes: [],
      steps: [{
          id: 19,
          text: 'Is a TMP required?',
          checked: false
        },
        {
          id: 20,
          text: 'Is a containment tech required?',
          checked: false
        },
        {
          id: 21,
          text: 'Is a water tech required?',
          checked: false
        },
        {
          id: 23,
          text: 'Is a dumpster required?',
          checked: false
        },
        {
          id: 24,
          text: 'Is a moving truck required?',
          checked: false
        },
        {
          id: 25,
          text: 'Is a power supply required?',
          checked: false
        },
        {
          id: 26,
          text: 'Is a Remediation Tech required?',
          checked: false
        },
        {
          id: 27,
          text: 'Is a content tech required?',
          checked: false
        }
      ],
      selectedSteps: [],
      picturesCheck:[
        { id: 23, text: 'Arrival Photo of Entrance', checked: false },
        { id: 24, text: 'Address Photo of Property', checked: false },
        { id: 25, text: 'Site Specific Safety', checked: false}
      ],
      selectedPictures:[],
      insuranceCompany: '',
      claimNumber: '',
      policyNumber: '',
      adjusterName: '',
      adjusterPhone: '',
      adjusterEmail: '',
      verificationCheckboxes: [{
          id: 226,
          text: 'The Above property is insured properly and fully'
        },
        {
          id: 27,
          text: 'The individual, representative, or contact individual above has the authority to engage Mitigation Services'
        },
        {
          id: 29,
          text: 'Copy or Photo of Customer Photo ID'
        }
      ],
      uploadedFiles: [],
      filesUploading: [],
      selectedVerification: [],
      cusSignature: {
        data: '',
        isEmpty: true
      },
      customerName: {
        first: '',
        last: ''
      },
      uploadMessage: '',
      idImage:[],
      frontCardImage:[],
      backCardImage:[],
      cardImages: [],
      currentUploadStep: 1,
      cardZip:"",
      teamMemberSig: {
        data: '',
        isEmpty: true
      },
      signDate: new Date().toLocaleString(),
      cusSignDate: "",
      initialData: { data: '', isEmpty: true },
      initial1:"",
      initial2:"",
      initial3:"",
      initial4:"",
      moistureMap: {
        data: "",
        isEmpty: true
      }
    }),
    watch: {
      timeOfDispatch(val) {
        this.timeOfDispatchFormatted = this.formatTime(val)
      },
      dateOfLoss(val) {
        this.dolFormatted = this.formatDate(this.dateOfLoss)
      },
      dateOfEval(val) {
        this.doeFormatted = this.formatDate(this.dateOfEval)
      },
      arrivalAtProperty(val) {
        this.arrivalFormatted = this.formatTime(this.arrivalAtProperty)
      },
      evalStart(val) {
        this.evalStartFormatted = this.formatTime(this.evalStart)
      },
      evalEnd(val) {
        this.evalEndFormatted = this.formatTime(this.evalEnd)
      },
      contractSigning(val) {
        this.contractFormatted = this.formatTime(this.contractSigning)
      },
      denialOfServices(val) {
        this.dosformatted = this.formatTime(this.denialOfServices)
      },
      departureTime(val) {
        this.departureTimeFormatted = this.formatTime(this.departureTime)
      },
      dateIntrusion(val) {
        this.dateIntrusionFormatted = this.formatDate(val)
      },
      timeIntrusion(val) {
        this.timeIntrusionFormatted = this.formatTime(val)
      }
    },
    mounted() {
      this.createGeocoder()
      this.checkStorage()
    },
    created() {
      this.$nuxt.$on('location-updated', (event) => {
        const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
        const geocode = this.$refs.geocoder
        const g = new MapboxGeocoder({
          accessToken: process.env.mapboxKey,
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
      })
    },
    computed: {
      ...mapGetters({getUser: 'users/getUser'}),
      ...mapGetters({getReports: 'reports/getReports'}),
      ...mapState('indexDb', [
        'reports'
      ]),
      id() {
        return this.$store.state.users.user ? this.$store.state.users.user.id : null
      },
      date() {
        const today = new Date()
        return (today.getMonth() + 1)+'-'+today.getUTCDate()+'-'+today.getFullYear();
      }
    },
    methods: {
      ...mapActions({
        addReport: 'indexDb/addReport',
        checkStorage: 'indexDb/checkStorage',
        resetForm: 'indexDb/resetReport'
      }),
      undoMap() {
        this.$refs.map.undoSignature()
      },
      saveMap() {
        const { isEmpty, data } = this.$refs.map.saveSignature()
        this.moistureMap.data = data
        this.moistureMap.isEmpty = isEmpty
      },
      onBegin() {
        this.$nextTick(() => {
          this.$refs.map.resizeCanvas()
        })
      },
      submitForm() {
        this.successMessage = ""
        const evaluationLogs = []
        const user = this.getUser
        var rapidRep = this.getReports.filter((v) => {
          return v.ReportType === 'rapid-response'
        })
        this.submitting = true
        const reports = rapidRep.map((v) => { return v.JobId });
        let scrollTo = 0
        evaluationLogs.push({label: 'Team Arrival at Property', value: this.arrivalFormatted}, {label: 'Evaluation Report Start Time', value: this.evalStartFormatted}, {label: 'Evaluation Report End Time', value: this.evalEndFormatted}, {label: 'Time of Contract Signing', value: this.contractFormatted});
        this.$refs.form.validate().then(success => {
          if (!success) {
            this.errorDialog = true
            this.submitting = false;
            this.submitted = false;
            return goTo(scrollTo); 
          }
          if (!reports.includes(this.jobId)) {
            const post = {
              JobId: this.jobId,
              DateOfLoss: this.dolFormatted,
              DateOfEvaluation: this.doeFormatted,
              ContactName: this.contactName,
              PropertyOwner: this.propertyOwner,
              location: this.location,
              phoneNumber: this.phoneNumber,
              emailAddress: this.emailAddress,
              ReportType: 'rapid-response',
              sourceWaterIntrusion: this.selectedTypes,
              Steps: this.selectedSteps,
              InsuranceCompany: this.insuranceCompany,
              ClaimNumber: this.claimNumber,
              PolicyNumber: this.policyNumber,
              adjusterName: this.adjusterName,
              adjusterEmail: this.adjusterEmail,
              adjusterPhone: this.adjusterPhone,
              evaluationLogs: evaluationLogs,
              documentVerification: this.selectedVerification,
              cusFirstName: this.customerName.first,
              cusLastName: this.customerName.last,
              customerSig: this.cusSignature.data,
              PictureTypes: this.selectedPictures,
              id: user.id,
              initials: {
                initial1: this.initial1,
                initial2: this.initial2,
                initial3: this.initial3,
                initial4: this.initial4
              },
              moistureMap: this.moistureMap.data,
              signDate: this.signDate,
              cusSignDate: this.cusSignDate,
              teamMember: this.getUser,
              dateIntrusion: this.dateIntrusionFormatted,
              timeIntrusion: this.timeIntrusionFormatted,
              intrusionInfo: this.intrusionSection,
              selectedPreliminary: this.selectedPreliminary,
              selectedInspection: this.selectedInspection,
              preRestorationEval: this.preRestoreEval,
              teamMemberSig: this.teamMemberSig.data
            };
            if (this.$nuxt.isOffline) {
              const tempPost = {...post}
              tempPost.photoId = this.idImage
              tempPost.jobFiles =this.uploadedFiles
              this.addReport(tempPost).then(() => {
                this.successMessage = "Report was saved successfully for submission later!"
                this.submitting = false
                this.submitted = true
                setTimeout(() => {
                    this.successMessage = ""
                }, 2000)
              })
            } else {
              this.$axios.$post("/api/rapid-response/new", post).then((res) => {
                if (res.errors) {
                  this.errorDialog = true
                  this.submitting = false
                  this.$refs.form.setErrors({
                    JobId: res.errors.filter(obj => obj.param === 'JobId').map(v => v.msg),
                    teamMemberSig: res.errors.filter(obj => obj.param === 'teamMemberSig').map(v => v.msg),
                    cusSignature: res.errors.filter(obj => obj.param === 'cusSignature').map(v => v.msg)
                  })
                  return goTo(scrollTo)
                }
                this.successMessage = res.message
                this.submitting = false
                this.submitted = true
                setTimeout(() => {
                    this.successMessage = ""
                    window.location = "/"
                }, 2000)
              })
            }
          } else {
            this.submitting = false
            this.errorDialog = true
            this.$refs.form.setErrors({
              JobId: ["Duplicate Job ID can't exist"]
            })
            return goTo(0)
          }
        })
      },
      createGeocoder() {
        const MapboxGeocoder = require('@mapbox/mapbox-gl-geocoder')
        const geocoder = new MapboxGeocoder({
          accessToken: process.env.mapboxKey,
          types: 'region,place,postcode,address',
          placeholder: 'Search for address...',
        })
        geocoder.setTypes('address').addTo('.form__geocoder')
      },
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
      parseTime(time) {
        if (!time) return null
      },
      parseDate(date) {
        if (!date) return null
        const [month, day, year] = date.split('/')
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      },
      acceptNumber() {
        const x = this.phoneNumber
          .replace(/\D/g, '')
          .match(/(\d{0,3})(\d{0,3})(\d{0,4})/)
        this.phoneNumber = !x[2] ?
          x[1] :
          '(' + x[1] + ') ' + x[2] + (x[3] ? '-' + x[3] : '')
      },
      goToStep(step) {
        if (step < 1) {
          return
        }
        if (step > 2) {
          this.submitFiles(this.cardImages)
          return
        }
        this.currentUploadStep = step
      },
    },
    beforeDestroy() {
      this.$nuxt.$off('location-updated')
    }
  }
</script>
<style lang="scss">
  .signature-area {
    max-width: 700px;
  }
  .map-wrapper {
    position:relative;
    width:100%;
    max-width:660px;
    margin:auto;
    
    &__canvas {
      position:absolute;
      width:100%;
      height:100%;
      top:0;
      height:0;
      
    }
    &__map {
      border-left:1px solid $color-black;
      border-right:1px solid $color-black;
      height:100%;
      
      &--row {
        height:19px;
        border-top:1px solid $color-black;
        display:flex;
        flex-direction:row;
        
        &:not(:first-child) {
          border-top:0px solid $color-black;
          border-bottom:0;
        }
      }
      &--col {
        flex:1 0 auto;
        border:1px solid $color-black;
        height:100%;
      }
    }
  }
</style>