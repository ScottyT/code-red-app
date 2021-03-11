<template>
  <div class="form-wrapper form-wrapper__rapid-form">
    <h1 class="text-center">Water Emergency Services Incorporated</h1>
    <h2 class="text-center">Rapid Response Evaluation Report</h2>
    <ValidationObserver ref="form" v-slot="{ errors }">
      <v-dialog width="400px" v-model="errorDialog">
        <div class="modal__error">
          <div v-for="(error, i) in errors" :key="`error-${i}`">
            <h2 class="form__input--error">{{ error[0] }}</h2>
          </div>
        </div>
      </v-dialog>
      <h2 class="alert alert--success">{{ successMessage }}</h2>
      <h2 class="alert alert--error">{{errorMessage}}</h2>
      <form v-if="!submitted" class="form" enctype="multipart/form-data" @submit.prevent="submitForm">
        <div class="form__form-group">
          <ValidationProvider name="Team lead id" rules="required|numeric"
            class="form__input--input-group">
            <label class="form__label">Team Lead ID #</label>
            <input v-model="id" name="teamLeadId" class="form__input" type="text" />
          </ValidationProvider>
          <div class="form__input--input-group">
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
          <div class="form__input--input-group">
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
          <ValidationProvider v-slot="{ errors }" name="Job ID" rules="required" class="form__input--input-group">
            <label for="jobId" class="form__label">Job ID</label>
            <input v-model="jobId" id="jobId" name="jobId" class="form__input" type="text" />
           
            <span class="form__input--error">{{ errors[0] }}</span>
          </ValidationProvider>
          <div class="form__input--input-group">
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
              <span class="button--normal button" @click="$refs.idfile.click()">Add Photo ID</span>
              <input type="file" name="idfile" accept="image/*" ref="idfile" capture="user" @change="filesChange" />
              <div class="file-listing"><img class="file-listing__preview" v-bind:ref="`idimage`" /></div>
              <span class="form__input--error">{{ errors[0] }}</span>
              <v-btn @click="submitFiles(idImage, $refs.photoid)" v-if="idImage.length > 0 && $nuxt.isOnline">{{ uploading ? 'Uploading' : 'Upload'}}</v-btn>
              
              <p aria-label="Upload message goes here" name="Photo ID" id="photoId" ref="photoid"></p>
            </ValidationProvider>
            <div class="form__input--upload-group">
              <label class="form__label">Debit/Credit Card</label>
              <keep-alive><ValidationProvider ref="front" v-if="currentUploadStep === 1" name="Front Side" rules="image" v-slot="{validate, errors}" class="card-upload--front">
                <p>Front side:</p>
                <input type="hidden" v-model="frontCardImage" @click="validate" />
                <span class="button button--normal" @click="$refs.frontCard.click()">Add image</span>
                <input type="file" name="frontCard" accept="image/*" ref="frontCard" capture="user" @change="filesChange" />
                <span class="form__input--error">{{ errors[0] }}</span>
                <div class="file-listing"><img class="file-listing__preview" v-bind:ref="`frontcardimage`" /></div>
              </ValidationProvider></keep-alive>
              <keep-alive><ValidationProvider ref="back" v-if="currentUploadStep === 2" name="Back Side" rules="image" v-slot="{validate, errors}" class="card-upload--back">
                <p>Back side:</p>
                <input type="hidden" v-model="backCardImage" @click="validate" />
                <span class="button button--normal" @click="$refs.backCard.click()">Add image</span>
                <input type="file" name="backCard" accept="image/*" ref="backCard" capture="user" @change="filesChange" />
                <span class="form__input--error">{{ errors[0] }}</span>
                <div class="file-listing"><img class="file-listing__preview" v-bind:ref="`backcardimage`" /></div>          
              </ValidationProvider></keep-alive>
              <div class="buttons-wrapper">
                <v-btn @click="goToStep(currentUploadStep - 1)">Previous</v-btn>
                <v-btn @click="goToStep(currentUploadStep + 1)" v-if="currentUploadStep === 1">Next</v-btn>
                <v-btn @click="submitFiles(cardImages, $refs.cardimage)" v-if="cardImages.length === 2 && currentUploadStep === 2 && $nuxt.isOnline">{{ uploading ? 'Uploading' : 'Upload'}}</v-btn>
              </div>
              <p aria-label="Upload message goes here" name="Debit/Credit card " ref="cardimage"></p>
            </div>
            <ValidationProvider v-slot="{errors}" rules="numeric|required" name="Zip code" class="form__input--upload-group" v-if="cardImages.length === 2">
              <label for="cardZip" class="form__label">Zip code on card</label>
              <input id="cardZip" class="form__input" v-model="cardZip" name="cardZip" type="text" />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form__form-group--left-side form__section">
            <label for="contactName" class="form__label">Contact Name</label>
            <input id="contactName" v-model="contactName" name="contactName" type="text"
              class="form__input form__input--long" />
            <label for="PropertyOwner" class="form__label">Property Owner</label>
            <input id="PropertyOwner" v-model="propertyOwner" name="PropertyOwner" type="text"
              class="form__input form__input--long" />

            <label class="form__label">City, State, Zip</label>
            <input v-model="location.cityStateZip" name="cityStateZip" type="text" class="form__input form__input--long"
              readonly />
            <label class="form__label">Address</label>
            <input
              v-model="location.address"
              name="Address"
              type="text"
              class="form__input form__input--long"
              readonly
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
            <input id="phone" v-model="phoneNumber" name="Phone" class="form__input" type="phone"
              @input="acceptNumber" />
            <ValidationProvider v-slot="{ errors }" name="Email" rules="email">
              <label for="email" class="form__label">Email Address</label>
              <input v-model="emailAddress" id="email" type="email" class="form__input" name="Email" />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="form__form-group--right-side form__section">
            <h3>Inital Response, Inspection, and Preliminary Determination</h3>
            <div class="form__checkbox-wrapper--long">
              <div class="form__input--checkboxes" v-for="item in picturesCheck" :key="item.id">
                <input type="checkbox" :id="item.id" v-model="selectedPictures" :value="item.text" />
                <label :for="item.id">{{item.text}}</label>
              </div>
            </div>
            
            <ValidationProvider rules="ext:doc,pdf,xlsx,docx,jpg,png,gif,jpeg" ref="jobimages" name="Photographs" v-slot="{ errors, validate }">
              <input type="hidden" v-model="uploadedFiles" @click="validate" />
              <div class="file-listing-wrapper">
                <div v-for="(file, key) in uploadedFiles" class="file-listing" :key="`jobfiles-${key}`">
                  <img class="file-listing__preview" v-bind:ref="'image'+parseInt(key)" v-if="file.type == 'image/png' || file.type == 'image/jpeg' || file.type == 'image/gif'" />
                  <p v-else>{{file.name}}</p>
                  <v-icon class="file-listing__remove-file" @click="removeFile(key, file)" tag="i" large>mdi-close-circle</v-icon>
                </div>
              </div>
              <input type="file" name="files" ref="files" accept="image/*,.doc,.docx,.xls,.xlsx,.pdf" capture="user" @change="filesChange" multiple />
              <v-btn @click="submitFiles(uploadedFiles, $refs.jobfiles)" v-if="uploadedFiles.length > 0 && errors.length <= 0 && $nuxt.isOnline">{{ uploading ? 'Uploading' : 'Upload'}}</v-btn>
              <span class="form__input--error">{{ errors[0] }}</span>
              <p aria-label="Upload message goes here" name="Job files" ref="jobfiles"></p>
            </ValidationProvider>
            <span class="button__add-files button" @click="addFiles()">Add Files</span>           
            <br />
            <span>{{ uploadSuccess }}</span>
            <h3>Source of Water Intrusion</h3>
            <div class="form__checkbox-wrapper--long">
              <div class="form__input--checkboxes" v-for="(type, i) in sourceOfIntrustion" :key="`loss-${i+1}`">
                <input type="checkbox" :id="`loss-${i+1}`" v-model="selectedTypes" :value="type.text" />
                <label :for="`loss-${i+1}`">{{type.text}}</label>
              </div>
            </div>
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
            </div>
          </div>
          <div class="form__form-group--left-side form__section">
            <h3>Preliminary Determination</h3>
            <div class="form__checkbox-wrapper--long form__checkbox-wrapper">
              <div class="form__input--checkboxes" v-for="item in preliminaryDetermination" :key="item">
                <input type="checkbox" :id="item" v-model="selectedPreliminary" :value="item" />
                <label :for="item">{{item}}</label>
              </div>
            </div>
          </div>
          <div class="form__form-group--right-side form__section">
            <h3>Inital Moisture Inspection</h3>
            <div class="form__checkbox-wrapper--long form__checkbox-wrapper">
              <div class="form__input--checkboxes" v-for="item in moistureInspection" :key="item">
                <input type="checkbox" :id="item" v-model="selectedInspection" :value="item" />
                <label :for="item">{{item}}</label>
              </div>
            </div>
          </div>
          <div class="form__form-group form__form-group--info-box form__section">
            <h3>Pre-Restoration Evaluation</h3>
            <div class="form__input-wrapper">
              <label for="emergencyRes" class="form__label">Emergency Response Actions Identified</label>
              <input id="emergencyRes" type="text" class="form__input" v-model="preRestoreEval.emergencyResAct" />
              <label for="buildingMat" class="form__label">Building Material Restorability</label>
              <input id="buildingMat" type="text" class="form__input" v-model="preRestoreEval.buildingMatRestore" />
              <label for="contentEval" class="form__label">Content Evaluation</label>
              <input id="contentEval" type="text" class="form__input" v-model="preRestoreEval.contentEval" />
              <label for="hvacEval" class="form__label">HVAC Evaluation</label>
              <input id="hvacEval" type="text" class="form__input" v-model="preRestoreEval.hvacEval" />
              <label for="substructure" class="form__label">Substructure & Unfinished Spaces</label>
              <input id="substructure" type="text" class="form__input" v-model="preRestoreEval.substructure" />
            </div>
          </div>
          <div class="form__form-group form__section">
            <h3>Develop Initial Project Work Plan & Communicate to Headquarters</h3>
            <div class="form__checkbox-wrapper--long form__checkbox-wrapper">
              <div class="form__input--checkboxes" v-for="(step, i) in steps" :key="`steps-${i+1}`">
                <input type="checkbox" :id="`steps-${i+1}`" v-model="selectedSteps" :value="step.text" />
                <label :for="`steps-${i+1}`">{{step.text}}</label>
              </div>
            </div>
          </div>
          <div class="form__form-group form__section">
            <ValidationProvider v-slot="{errors}" name="Insurance" rules="required" class="form__input--input-group">
              <label for="insurance" class="form__label">Insurance Company</label>
              <input type="text" id="insurance" class="form__input" name="insurance" v-model="insuranceCompany" />
              <br />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
            <ValidationProvider v-slot="{errors}" name="claimNumber" class="form__input--input-group">
              <label for="claimNumber" class="form__label">Claim Number</label>
              <input type="text" id="claimNumber" class="form__input" name="claimNumber" v-model="claimNumber" />
              <br />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
            <ValidationProvider v-slot="{errors}" name="policyNumber" class="form__input--input-group">
              <label for="policyNumber" class="form__label">Policy Number</label>
              <input type="text" id="policyNumber" class="form__input" name="policyNumber" v-model="policyNumber" />
              <br />
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
            <span class="form__input--input-group">
              <label for="adjusterName" class="form__label">Adjuster Name</label>
              <input id="adjusterName" type="text" class="form__input" v-model="adjusterName" />
            </span>
            <span class="form__input--input-group">
              <label for="adjusterPhone" class="form__label">Adjuster Phone</label>
              <input id="adjusterPhone" type="phone" class="form__input" v-model="adjusterName" @input="acceptNumber" />
            </span>
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
            <div class="form__input--checkboxes" v-for="item in verificationCheckboxes" :key="`item${item.id+1}`">
              <input type="checkbox" :id="`item${item.id+1}`" v-model="selectedVerification" :value="item.text" />
              <label :for="`item${item.id+1}`">{{item.text}}</label>
            </div>
          </div>
          <div class="form__form-group">
            <div class="form__input-wrapper">
              <label class="form__label">Customer (Print)</label>
              <ValidationProvider v-slot="{ errors }" name="Customer first name" rules="required" class="form__input--input-group">
                <input id="firstname" placeholder="First" type="text" class="form__input" v-model="customerName.first" />
                <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>
              <ValidationProvider v-slot="{ errors }" name="Customer last name" rules="required" class="form__input--input-group">
                <input id="lastname" placeholder="Last" type="text" class="form__input" v-model="customerName.last" />
                <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>            
              <lazy-signature-pad-modal :sigData="cusSignature" sigRef="cusSignaturePad" name="Customer signature" />          
            </div>
          </div>
          <div class="form__form-group">
            <div class="form__input-wrapper">
              <label class="form__label">Team Member (Signature)</label>
              <lazy-signature-pad-modal :sigData="teamMemberSig" sigRef="teamSignaturePad" name="Team member signature" />
            </div>
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
    name: 'RapidResponseForm',
    props: ['slice'],
    data: (vm) => ({
      errorDialog: false,
      sigDialog: false,
      uploading: false,
      successMessage: '',
      errorMessage: '',
      uploadSuccess: '',
      submitting: false,
      submitted: false,
      jobId: null,
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
        { label: 'Control Status of Intrusion', value: '', type: 'text' },
        { label: 'Structure Type', value: '', type: 'text' },
        { label: 'Use', value: '', type: 'text' },
        { label: 'History', value: '', type: 'text' },
        { label: 'Age', value: null, type: 'text' },
        { label: 'Approximate sqft', value: null, type: 'number' },
        { label: 'Number of Rooms', value: null, type: 'number' },
        { label: 'Number of Floors', value: null, type: 'number' }
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
          text: 'Is an electrician required?',
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
        { id: 23, text: 'Street View', checked: false },
        { id: 24, text: 'Address View', checked: false },
        { id: 25, text: 'Exterior Damages', checked: false},
        { id: 26, text: 'Interior Damages', checked: false},
        { id: 27, text: 'Full Room', checked: false},
        { id: 28, text: 'Personal Property', checked: false}
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
      signDateTime: new Date().toLocaleString()
    }),
    watch: {
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
      ...mapGetters(['getUser']),
      ...mapGetters(['getReports']),
      ...mapState('indexDb', [
        'reports'
      ]),
      id() {
        return this.$store.state.user ? this.$store.state.user.id : null
      }
    },
    methods: {
      ...mapActions({
        addReport: 'indexDb/addReport',
        checkStorage: 'indexDb/checkStorage',
        resetForm: 'indexDb/resetReport'
      }),
      
      submitForm() {
        this.successMessage = ""
        const evaluationLogs = []
        const user = this.getUser
        const reports = this.getReports.map((v) => { return v.JobId });
        const userNameObj = {
          first: user.name.split(" ")[0],
          last: user.name.split(" ")[1]
        }
        let scrollTo = 0
        evaluationLogs.push({label: 'Team Arrival at Property', value: this.arrivalFormatted}, {label: 'Evaluation Report Start Time', value: this.evalStartFormatted}, {label: 'Evaluation Report End Time', value: this.evalEndFormatted}, {label: 'Time of Contract Signing', value: this.contractFormatted}, {label: 'Time of Denail of Services', value: this.dosformatted}, {label: 'Team Departure of Property', value: this.departureTimeFormatted});
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
              PhoneNumber: this.phoneNumber,
              EmailAddress: this.emailAddress,
              ReportType: 'rapid-response',
              Pictures: this.filesUploading,
              TypesOfLoss: this.selectedTypes,
              Steps: this.selectedSteps,
              InsuranceCompany: this.insuranceCompany,
              ClaimNumber: this.claimNumber,
              PolicyNumber: this.policyNumber,
              adjusterName: this.adjusterName,
              adjusterEmail: this.adjusterEmail,
              adjusterPhone: this.adjusterPhone,
              EvaluationLogs: evaluationLogs,
              cusFirstName: this.customerName.first,
              cusLastName: this.customerName.last,
              customerSig: this.cusSignature.data,
              PicturesTypes: this.selectedPictures,
              id: user.id,
              uid: user.uid,
              signDate: this.signDate,
              teamMember: userNameObj,
              dateIntrusion: this.dateIntrusionFormatted,
              timeIntrusion: this.timeIntrusionFormatted,
              intrusionInfo: this.intrusionSection,
              selectedPreliminary: this.selectedPreliminary,
              selectedInspection: this.selectedInspection,
              preRestorationEval: this.preRestoreEval
            };
            if (this.$nuxt.isOffline) {
              const tempPost = {...post}
              tempPost.photoId = this.idImage
              tempPost.jobFiles =this.uploadedFiles
              tempPost.cardImages = this.cardImages
              this.addReport(tempPost).then(() => {
                this.message = "Report was saved successfully for submission later!"
                this.submitted = true
                setTimeout(() => {
                    this.message = ""
                    this.$router.push("/")
                }, 2000)
              })
            } else {
              this.$axios.$post("/api/rapid-response/new", post).then(() => {
                this.message = "Report submitted"
                this.submitted = true
                setTimeout(() => {
                    this.message = ""
                    this.$router.push("/")
                }, 2000)
              }).catch((err) => {
                this.errorMessage = err
              }) 
            }
          } else {
            this.submitted = false
            this.submitting = false
            this.errorMessage = "Duplicate Job ID can't exist"
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
      async filesChange(e) {
        const fileList = e.target.files
        const uploadarea = e.target.name
        if (!fileList.length) return
        const job = this.jobId
             
        switch (uploadarea) {
          case "idfile":
            var {valid} = await this.$refs.idprovider.validate(e);
            
            
            if (valid) {
              for (let i = 0; i < this.$refs.idfile.files.length; i++) {
                var filetype = this.$refs.idfile.files[i].type
                console.log("ref:", this.$refs.idfile.files)
                var image = this.$refs.idfile.files[i]
                var blob = image.slice(0, image.size, image.type)
                console.log(blob)
                var filetype = image.name.substring(image.name.lastIndexOf('.'), image.name.length)
                var newFile = new File([blob], `id-photo-${job}${filetype}`, {
                  type: image.type
                })
                this.idImage[0] = newFile
              }
              this.getSinglePreview(this.idImage, 'idimage')
            }
            break;
          case "frontCard":
            var {valid} = await this.$refs.front.validate(e);
            
            if (valid) {
              for (var i=0; i<this.$refs.frontCard.files.length; i++) {
                var filetype = this.$refs.frontCard.files[i].type
                var file = this.$refs.frontCard.files[i]
                var blob = file.slice(0, file.size, file.type)
                var filetype = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
                var newFile = new File([blob], `front-card-${job}${filetype}`, {type: file.type})
                this.frontCardImage[0] = newFile
                this.cardImages[0] = newFile
              }
              this.getSinglePreview(this.frontCardImage, 'frontcardimage');
            }            
            break;
          case "backCard":
            var {valid} = await this.$refs.back.validate(e);
            
            if (valid) {
              for (var i=0; i<this.$refs.backCard.files.length; i++) {
                var filetype = this.$refs.backCard.files[i].type
                var file = this.$refs.backCard.files[i]
                var blob = file.slice(0, file.size, file.type)
                var filetype = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
                var newFile = new File([blob], `back-card-${job}${filetype}`, {type: file.type})
                this.backCardImage[0] = newFile
                this.cardImages[1] = newFile
              }
              this.getSinglePreview(this.backCardImage, 'backcardimage');
            }         
            break;
          case "files":
            var {valid} = await this.$refs.jobimages.validate(e)
            if (valid) {
              for (var i = 0; i < this.$refs.files.files.length; i++) {
                var file = this.$refs.files.files[i]
                this.uploadedFiles.push(file)
              }
              this.getImagePreviews(this.uploadedFiles, 'image');
            }           
        }       
      },
      getSinglePreview(files, usekey) {
        if (/\.(jpe?g|png|gif)$/i.test(files[0].name)) {
          const reader = new FileReader();
          reader.onload = e => {
            this.$refs[usekey].src = reader.result;
          }
          reader.readAsDataURL(files[0])
        }
      },
      getImagePreviews(filesarr, usekey) {
        for (let i = 0; i < filesarr.length; i++) {
          if (/\.(jpe?g|png|gif)$/i.test(filesarr[i].name)) {
            const reader = new FileReader();
            reader.addEventListener("load", () => {
              console.log(usekey)
              this.$refs[usekey + i][0].src = reader.result;
            }, false);
            reader.readAsDataURL(filesarr[i])
          }
        }
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
      submitFiles(uploadarr, element) {
        const today = new Date()
        const date = (today.getMonth() + 1)+'-'+today.getDay()+'-'+today.getFullYear();
        if (!this.jobId) {
          this.errorMessage = "Job ID is required"
          return;
        }
        uploadarr.forEach((file) => {
          var storageRef = this.$fire.storage.ref()
          var field = element.getAttribute('name')
          console.log("field:", field)
          switch (field) {
            case "Job files":
              var uploadRef = storageRef.child(`${this.jobId}/${date}/${file.name}`)
              var uploadTask = uploadRef.put(file)
              break;
            default:
              var uploadRef = storageRef.child(`${this.jobId}/${file.name}`)
              var uploadTask = uploadRef.put(file)
          }
          uploadTask.on('state_changed',
          (snapshot) => {
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              if (progress < 100) {
                this.uploading = true
              }
              if(progress == 100) {
                this.uploading = false
                
                var uploadMessage = `${field} uploaded successfully`
                element.innerHTML = uploadMessage
                uploadarr = []
              }
            },
            (error) => {
              console.log(error.message)
            },
            () => {
              uploadRef.getDownloadURL().then((url) => {
                var fileName = file.name.substring(0, file.name.lastIndexOf('.'))
                var fileType = file.name.substring(file.name.lastIndexOf('.'), file.name.length)
                const fileObj = {
                  name: fileName,
                  url: url,
                  type: fileType
                }
                this.filesUploading.push(fileObj)
              })
            }
          )
        })
      },
      addFiles() {
        this.$refs.files.click()
      },
      removeFile(key, removedFile) {
        this.uploadedFiles.splice(key, 1);
        this.getImagePreviews(this.uploadedFiles, 'image')
        this.$refs.files.value = null
      }
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
</style>