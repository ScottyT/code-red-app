<template>
  <div class="form-wrapper">
    <h1 class="text-center">{{company}}</h1>
    <h2 class="text-center">ASSIGNMENT OF BENEFITS & MITIGATION CONTRACT</h2>
    <h2 class="text-center">THIS IS NOT AN AGREEMENT TO REPAIR/REBUILD/RESTORE ANY PROPERTY</h2>
    <ValidationObserver ref="form">
      <h2>{{message}}</h2>
      <!-- <ul>
        <li v-for="(error, i) in errors" :key="`error${i}`">
          {{error[0]}}
        </li>
      </ul> -->
     <h3 class="alert alert--error" v-for="(error, i) in errorMessage" :key="`server-errors-${i}`">{{error}}</h3>
      <form ref="form" class="form" @submit.prevent="submitForm" v-if="!submitted">
        <fieldset v-if="currentStep === 1">
          <div class="form__form-group">
            <ValidationProvider rules="required" name="Job ID" v-slot="{errors}">
              <label for="selectJobId" class="form__label">Job ID</label>
              <select class="form__select" v-model="selectedJobId">
                <option disabled value="">Please select a Job Id</option>
                <option v-for="(item, i) in $store.state.jobids" :key="`jobid-${i}`">{{item}}</option>
              </select>
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <div class="text-center">
            <p>
              This is not a contract to Repair/Rebuild/Restore any Property
              {{company}} {{abbreviation !== '' ? '('+abbreviation+')' : ''}} is an independent janitorial contractor.
              We are not affiliated, associated, endorsed by or in any way officially connected with any other company,
              agency or franchise.
            </p>
            <p>
              This Assignment of Claim Agreement (hereinafter referred to as “Assignment” and/or “Agreement”) and
              Mitigation
              Contract (hereinafter referred to as “Contract”) is entered into by and between:
            </p>
            <p>
              {{company}} (hereinafter referred to as “{{abbreviation}}” and/or “Insured”)
              and The Owner/Persons of legal authority (hereinafter referred to as “Property Representative”)
              of the property more commonly known as and identified by the following address:
            </p>
            <ValidationProvider rules="required" class="form__form-group" v-slot="{ errors }" name="Subject property">
              <input type="text" class="form__input" v-model="subjectProperty" /><br />
              <p>(hereinafter referred to as “Subject Property”)</p>
              <span class="form__input--error">{{ errors[0] }}</span>
            </ValidationProvider>
          </div>
          <ol class="form__form-group--listing-num">
            <li>
              <span class="font-weight-bold">Assignment of Claim to {{company}}:</span>
              <div class="form__form-group">
                <ValidationProvider rules="required" v-slot="{errors}" vid="initial1" name="Initial">
                  <label for="initial1">Initial:</label>
                  <input id="initial1" type="text" v-model="initial1" class="form__input" />
                  <span class="form__input--error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
              <ol>
                <li>
                  Property Representative understands and agrees to assign all insurance rights, benefits, proceeds
                  and any causes of action under applicable insurance policies to {{abbreviation}} for services rendered
                  or to
                  be rendered for said Subject Property identified above. Both parties understand and agree that
                  {{abbreviation}} will replace the Property Representative as the Insured on the applicable insurance
                  policies
                  and as such will be entitled to all insurance rights, benefits, proceeds and any causes of action
                  thereunder in its capacity as the legally recognized Insured.
                </li>
                <li>
                  By executing this document Property Representative agrees and intends for all rights, benefits, and
                  proceeds for services for said Subject Property identified above to be assigned solely and
                  exclusively to {{abbreviation}} in its capacity as the Insured.
                </li>
                <li>
                  In this regard, Property Representative waives all privacy rights if any related to all insurance
                  information and agrees to provide any and all such reasonable and necessary information and
                  documents to {{abbreviation}} to assist {{abbreviation}} in receiving payment for all services performed
                  pursuant to
                  this Agreement including but not limited to insurance policies, insurance policy numbers,
                  endorsements, riders, correspondence, invoices, proof of coverage, full disclosure of any previous
                  insurance claims if any and/or any other insurance policy information that {{abbreviation}} may need to
                  establish, pursue and perfect its rights as the Insured and so as to exercise its rights thereunder to
                  any benefits, proceeds, payments, causes of actions and/or any other related rights. Section III. of
                  this Agreement is hereby incorporated by reference.
                </li>
                <li>
                  The Property Representative makes this Assignment in consideration of and for {{abbreviation}}’s
                  agreement to perform labor, provide services, supply materials and perform such services under
                  this Contract and including the additional consideration of and for {{abbreviation}}’s not requiring
                  full
                  payment at the time of service.
                </li>
                <li>
                  Property Representative hereby unequivocally directs the insurance carrier(s) to release all
                  information requested by {{abbreviation}} in its capacity as the Insured, its representatives, and/or
                  its
                  attorney for the purpose of obtaining actual benefits to be paid by the insurance carrier(s) for
                  services rendered or to be rendered for the Subject Property identified above.
                </li>
              </ol>
            </li>
            <div class="form__form-group form__form-group--row">
                <div class="form__input--input-group">
                    <label class="form__label">Signature</label>
                    <lazy-signature-pad-modal :sigData="cusSign" sigRef="customerSig" name="Signature" />
                </div>
                <div class="form__input--input-group">
                    <label for="cusSignDate" class="form__label">Date:</label>
                    <v-dialog ref="dialogCusSign" v-model="cusSignDateModal" :return-value.sync="cusSignDate" persistent width="400px">
                        <template v-slot:activator="{ on, attrs }">
                          <input id="cusSignDate" v-model="cusSignDateFormatted" v-bind="attrs"
                                class="form__input form__input--short" readonly v-on="on" @blur="repDate = parseDate(cusSignDateFormatted)" />
                        </template>
                        <v-date-picker v-model="cusSignDate" scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="#fff" @click="cusSignDateModal = false">Cancel</v-btn>
                          <v-btn text color="#fff" @click="$refs.dialogCusSign.save(cusSignDate)">OK</v-btn>
                        </v-date-picker>
                      </v-dialog>
                </div>
            </div>
            <li>
              <span class="font-weight-bold">Direction of Payment to {{company}}:</span>
              <ol>
                <li>
                  I hereby authorize and unequivocally instruct direct payment of any benefits or proceeds
                  for services rendered by {{abbreviation}} to be made payable solely to {{abbreviation}} and sent
                  exclusively
                  to {{abbreviation}}.
                </li>
                <li>
                  Property Representative understands and agrees that any portion of work, deductible(s),
                  betterment, depreciation, or additional work requested by the Property Representative or
                  otherwise not covered by insurance is ultimately the Property Representative’s
                  responsibility and/or liability.
                </li>
              </ol>
              <div class="form__form-group">
                <ValidationProvider rules="required" v-slot="{errors}" vid="initial2" name="Initial">
                  <label for="initial2">Initial:</label>
                  <input id="initial2" type="text" v-model="initial2" class="form__input" />
                  <span class="form__input--error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </li>
            <li>
              <span class="font-weight-bold">Property Representative Cooperation Required:</span>
              <ol>
                <li>
                  To the extent reasonable and possible, the Property Representative will provide {{abbreviation}} with
                  all
                  reasonable and necessary documents covering the Subject Property and/or take any and all
                  reasonable steps to obtain if said documents are not currently in the possession of or otherwise
                  available to the Property Representative including but not limited to copies of all insurance policies,
                  endorsements, riders, correspondence, invoices and proof of coverage which may assist {{abbreviation}}
                  in
                  receiving payment for services performed.
                </li>
              </ol>
              <div class="form__form-group">
                <ValidationProvider rules="required" v-slot="{errors}" vid="initial3" name="Initial">
                  <label for="initial3">Initial:</label>
                  <input id="initial3" type="text" v-model="initial3" class="form__input" />
                  <span class="form__input--error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </li>
            <li>
              <span class="font-weight-bold">{{abbreviation}} is contracted to performing the below mitigation services
                from start to finish.</span>
              <ol class="form__form-group--listing">
                <li>
                  EVALUATION SERVICES: evaluate damages, scope, account, benefit and to obtain the Available
                  Proceeds (as defined below in Section VI. d.)
                </li>
                <li>
                  INSPECTION SERVICES: enter and inspect all aspects of the property including but not limited to
                  construction, materials, design, code compliance, debris removal, hazardous material, contents on
                  the premises, the potential of multiple claims, extent of damages and circumstances related to
                  damages
                </li>
                <li>
                  STRUCTURAL DRYING SERVICES: emergency stabilization, water extraction, demolition,
                  debris removal, structural drying, atmospheric remediation, anti-microbial/odor/bio-treatments,
                  building enveloping, dry material removal, monitoring, related sealants and any and all other
                  services that may help contain and mitigate further damages (“Mitigation”)
                </li>
                <li>
                  CONTENT SERVICES: content manipulation, content inventory, brick & stacking of content,
                  boxing & packing of content, loading and transport of content, off-site storage of content and all
                  other services related to handling, storing, and mitigating content damages
                </li>
                <li>
                  PROFESSIONAL SERVICES: consult, contract independent experts, schedule and hold
                  appointments with all other service providers and professionals as {{abbreviation}} deems necessary and
                  reasonable to provide restoration and mitigation services
                </li>
                <li>
                  ABILITY TO SUB-CONTRACT FOR SERVICES: sub-contract and or hire all other service
                  providers and professionals as {{abbreviation}} deems necessary and reasonable to perform any or all of
                  the
                  restoration and mitigation work or services hereunder of the work herein
                </li>
                <li>
                  IMMEDIATE: Time is of the essence under this Agreement for restoration and mitigation services.
                  As such the Property Representative understands and agrees that the actions and/or services
                  authorized in paragraphs IV. a.- f. typically require {{abbreviation}} to perform the services without
                  prior
                  communication with or input from the insurance company and/or before the insurance company is
                  notified about or contacted regarding the loss and/or property damage and/or before the insurance
                  company has an opportunity to inspect the Subject Property, hold adjustments and/or before the
                  insurance company is able to communicate with {{abbreviation}} and/or any other service providers
                  regarding
                  any authorization from the insurance company if applicable, the services to be performed, the
                  amount of insurance coverages, limits, etc..
                </li>
              </ol>
              <div class="form__form-group">
                <ValidationProvider rules="required" v-slot="{errors}" vid="initial4" name="Initial">
                  <label for="initial4">Initial:</label>
                  <input id="initial4" type="text" v-model="initial4" class="form__input" />
                  <span class="form__input--error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </li>
            <li>
              <span class="font-weight-bold">{{abbreviation}} is contracted for its services including equipment rental
                services as set forth herein:</span>
              <ol class="form__form-group--listing">
                <li>
                  In consideration of the mutual covenants and promises in this Agreement, the receipt and sufficiency
                  of which consideration is hereby acknowledged, {{abbreviation}} leases equipment to the Property
                  Representative and the Property Representative leases the equipment from {{abbreviation}}.
                </li>
                <li>
                  {{abbreviation}} and the Property Representative understand and authorize this Equipment Rental
                  Agreement
                  to commence immediately upon the execution of the Equipment Rental Agreement and the
                  Equipment Rental Agreement will continue on a day-to-day basis including and until the day the
                  equipment is removed by and only by {{abbreviation}} from the Subject Property. This period is herein
                  referred to as the “Term”.
                </li>
                <li>
                  The rent and damage deposit inclusive of sales tax will be equal to the most recent geographical
                  Xactimate price available applying IICRC Methods and Protocols commencing immediately upon
                  the date of execution of this Equipment Rental Agreement and will be paid at the time of execution
                  of this Equipment Rental Agreement. This payment is herein referred to as the “Deposit”.
                </li>
                <li>
                  The Property Representative agrees to pay {{abbreviation}} rent (herein referred to as “Rent”) for the
                  use of
                  the equipment. The rent inclusive of sales tax will be equal to the most recent geographical
                  Xactimate price available applying IICRC Methods and Protocols and will commence immediately
                  upon the date of execution of this Equipment Rental Agreement and will be paid on the agreed
                  day(s) throughout the Term.
                </li>
                <li>
                  The Property Representative will use the equipment in a good and careful manner and will comply
                  with all the manufacturer’s requirements and recommendations respecting the equipment and with
                  any applicable law, whether local, state, or federal.
                </li>
                <li>
                  Unless the Property Representative obtains prior written consent of {{abbreviation}}, the Property
                  Representative will not alter or change its power source, program, reset, modify, attach anything to
                  the equipment or remove the equipment from its placement in/around/or from the Subject Property.
                </li>
                <li>
                  If the equipment is not in good repair, appearance and condition when it is returned to
                  {{abbreviation}}, {{abbreviation}}
                  may make such repairs or may cause such repairs to be made as necessary to put the equipment in
                  a state of good repair, appearance and condition. {{abbreviation}} will make the said repairs within a
                  reasonable time of taking possession of the equipment and will give the Property Representative
                  written notice of the invoices for the said repairs. Upon receipt of the invoices the Property
                  Representative will immediately reimburse {{abbreviation}} for the actual expense of those repairs.
                </li>
                <li>
                  The Property Representative may, but is not obligated to, enforce any warranty that {{abbreviation}} has
                  against the supplier or manufacturer of the equipment. The Property Representative will enforce
                  such warranty or indemnity in its own name and at its own expense.
                </li>
                <li>
                  To the extent permitted by law, the Property Representative will be responsible for the risk of loss,
                  theft, damage, or destruction to the equipment from any and every cause.
                </li>
                <li>
                  If the equipment is lost or damaged the Property Representative will continue paying Rent, will
                  provide {{abbreviation}} with prompt written notice of such loss or damage and will, if the equipment is
                  repairable, put or cause the equipment to be put in a state of good repair, appearance and condition.
                </li>
                <li>
                  In the event of a total loss of the equipment the Property Representative will provide {{abbreviation}}
                  with
                  prompt written notice of such loss and will pay to {{abbreviation}} all unpaid Rent for the Term plus
                  casualty
                  value of the equipment at which point ownership of the equipment passes to the Property
                  Representative.
                </li>
                <li>
                  The equipment is the property of {{abbreviation}} and will remain the property of {{abbreviation}}
                  unless otherwise provided herein.
                </li>
                <li>
                  The Property Representative will not encumber the equipment or allow the equipment to be encumbered or
                  pledge the equipment as security in any manner.
                </li>
                <li>
                  {{abbreviation}} warrants that the Property Representative has the right to lease the equipment
                  according to the terms of this Equipment Rental Agreement.
                </li>
                <li>
                  {{abbreviation}} warrants that as long as no event of default has occurred {{abbreviation}} will not
                  disturb the Property
                  Representative’s quiet and peaceful possession of the equipment or the Property Representative’s
                  use of the equipment for the purpose for which the equipment was designed.
                </li>
                <li>
                  No insurance coverage for the equipment is required under this Equipment Rental Agreement.
                </li>
                <li>
                  The Property Representative will indemnify and reimburse {{abbreviation}} for damages and expenses
                  incurred by {{abbreviation}} arising from or related to the Property Representative’s failure to pay any
                  tax, fee
                  or charge regardless of whether the Property Representative is contesting the validity of the same or
                  not.
                </li>
                <li>
                  If the Property Representative fails to pay any and all taxes, fees and charges mentioned in this
                  Equipment Rental Agreement and {{abbreviation}}, on behalf of the Property Representative, pays the
                  same,
                  the Property Representative will reimburse {{abbreviation}} for the cost upon notification from
                  {{abbreviation}} of the
                  amount.
                </li>
                <li>
                  The Property Representative will indemnify and hold harmless {{abbreviation}} against any and all
                  claims,
                  actions, suits, proceedings, costs, expenses, damages and liabilities, including attorney’s fees and
                  costs, arising out of or related to the Property Representative’s and/or {{abbreviation}}’s use of the
                  equipment.
                </li>
              </ol>
              <div class="form__form-group">
                <ValidationProvider rules="required" v-slot="{errors}" vid="initial5" name="Initial">
                  <label for="initial5">Initial:</label>
                  <input id="initial5" type="text" v-model="initial5" class="form__input" />
                  <span class="form__input--error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </li>
            <li>
              <span class="font-weight-bold">Terms and Conditions:</span>
              <ol class="form__form-group--listing">
                <li>
                  AUTHORITIES OF PARTIES:
                  Property Representative is the owner of or the duly authorized agent of the owner with
                  authority to bind the owner of the Subject Property for this Agreement. Property
                  Representative covenants that {{abbreviation}} can rely on this authority and this appointment in all
                  dealings with the insurance company, insurance agents, insurance adjusters, tenants and
                  invitees of the Property Representative and the Subject Property and contractors and
                  vendors of {{abbreviation}}.
                </li>
                <li>
                  CERTIFICATE OF COMPLETION:
                  Property Representative agrees to sign the {{abbreviation}} Certificate of Completion upon the
                  conclusion of the {{abbreviation}} quality control evaluation.
                </li>
                <li>
                  DIRECTION:
                  Property Representative will advise the insurance company (and each agent, adjuster,
                  independent adjuster, building consultant, expert, engineer or any other party acting on
                  behalf thereof) of this Agreement, and will formally direct the insurance company to the
                  proper party if contacted regarding actions and/or services authorized in this Agreement.
                </li>
                <li>
                  <p>GOOD FAITH:
                    It is the responsibility of the Property Representative to act in “good faith”. To the extent
                    that any of the Property Representative’s actions or behaviors are deemed inappropriate
                    {{abbreviation}} reserves its right to the Available Proceeds as defined herein in addition to the
                    assignment of the Property Representative’s insurance claim; said assignment already
                    being provided for herein in this Assignment. Property Representative agrees that Code
                    Red Analytics Incorporated retains the right to document, scope and independently account
                    on its own and/or alongside the insurance company concerning the replacement cost and/or
                    actual cost value of the work, replacements and/or losses and damages and/or services to
                    the Subject Property.</p>
                  <p>As used herein “Available Proceeds” is defined as the maximum potential amount of
                    funds Code Red Analytics Incorporated (a third party claims management
                    corporation/company) estimates to be the replacement cost value performing the
                    American Standard IICRC (best practices) while applying the most recent geographical
                    Xactimate 28 (fair market value) price available including: the deductible minus (-)
                    interest and depreciation equal (=) the Available Proceeds. This amount can vary greatly
                    depending on the skills and thoroughness of the adjustor, analyst and {{abbreviation}}. The goal is
                    to make {{abbreviation}} whole.</p>
                </li>
                <li>
                  FRAUD:
                  In most statesthe Property Representative is legally required to pay its deductible. Property
                  Representative understands that Available Proceeds as defined and calculated herein in this
                  Agreement include the Representative’s deductible. Property Representative understands
                  and acknowledges that it may be able to find another contractor less expensive than {{abbreviation}};
                  however, for purposes of this Agreement any settlements must reflect {{abbreviation}}’s cost. Any
                  use by the Property Representative of {{abbreviation}}’s accounting, estimates, monetary
                  calculations, or the like for its own personal gain or for any and all types of secondary gain
                  is a misrepresentation of the Property Representative’s true cost to the insurance company
                  and may constitute fraud. The Property Representative understands that it is illegal to
                  misrepresent information to an insurance company and that any misrepresentation may
                  constitute fraudulent activity or other illegal activity. {{abbreviation}} reserves the right to notify all
                  legal authorities of any misrepresentations, fraudulent activity and/or any other illegal
                  activity and {{abbreviation}} reserves the right to pursue any and all legal action if necessary.
                </li>
                <li>
                  NO GUARANTEE OF COVERAGE:
                  {{abbreviation}} is not able to guarantee, warrant, assure, state or represent as to the sufficiency of
                  the amount of the Property Representative’s insurance coverage and whether such
                  insurance coverage is or will be sufficient to cover the amount due to {{abbreviation}} for all
                  mitigation, services, repair, restoration and renovation work needed and/or performed. The
                  amounts and types of coverage are determined under the contract that exists between the
                  insurance company and the Property Representative. {{abbreviation}} has no control over this
                  contract and therefore cannot guarantee that any loss or damage is covered by insurance or
                  that the amount of coverage available will permit needed services. Property Representative
                  understands and agrees that Property Representative is and will be responsible for payment
                  of all services performed pursuant to this Agreement and which are not covered either
                  partially or in full by the insurance coverage.
                </li>
                <li>
                  LIABILITY:
                  The Property Representative understands this Agreement is not to repair, renovate or
                  rebuild any property. The Property Representative understands {{abbreviation}} is not responsible for
                  and/or liable for prior conditions or damages resulting therefrom including but not limited
                  to mold, asbestos, lead, pollutants, hazardous materials and structural damage before,
                  during or after authorization of this Agreement and/or any conditions or damages caused
                  either indirectly or directly by {{abbreviation}} and/or anyone else performing services for and/or on
                  behalf of {{abbreviation}}.
                </li>
                <li>
                  INDEMNIFICATION:
                  The Property Representative will hold harmless and indemnify {{abbreviation}} and/or anyone else 
                  performing services for and/or on behalf of {{abbreviation}} against any and all claims and actions 
                  arising out of the performance of any services pursuant to this Agreement including, 
                  without limitation, expenses, judgments, fines, settlements and other amounts actually and 
                  reasonably incurred in connection with any liability, suit, action, loss, or damage arising
                  out of or resulting therefrom. Under this Agreement indemnification will be unlimited as 
                  to the amount. 
                </li>
                <li>
                  <p>
                    AGREED MONETARY MINIMUM AND AGREED MONETARY MAXIMUM:
                    Property Representative understands and agrees that {{abbreviation}} is solely and exclusively
                    entitled to a minimum of $7.00 per square foot or $7,000.00 whichever is greater for the
                    services performed at the Subject Property.
                  </p>
                  <p>
                    “Square Foot” is defined as the total affected square footage determined by {{abbreviation}}
                    applying the IICRC “BEST PRACTICES” of protocols pertaining to damages,
                    contamination, aerosolizing and believe of dry material on the Subject Property.
                  </p>
                </li>
                <li>
                  AGREED LIQUIDATED AND ASCERTAINED DAMAGES:
                  If this Agreement is cancelled or breached by the Property Representative more than
                  twenty-four (24) hours after the execution of this Agreement, then {{abbreviation}} is entitled to
                  payment for the entire scope of its services. {{abbreviation}}’s services include company expertise,
                  research, inventory, investigation, calculations, software, and other services necessary to
                  obtain accurate estimates and provide all said services. The value of these services is not
                  separately invoiced and is beyond simple estimation. The parties agree that the provision
                  of these services entitles {{abbreviation}} to compensation of an amount not yet known but for
                  simplicity and to resolve uncertainty the parties further agree to liquidated damages in the
                  amount of $30.00 per square foot as defined above. Furthermore, the parties understand
                  and agree that the amount paid pursuant to this paragraph of the Agreement are liquidated
                  damages and that such payments do not constitute a penalty whatsoever. {{abbreviation}} agrees to
                  accept such payments as a reasonable and just compensation for said cancellation or breach
                  of the Agreement.
                </li>
                <li>
                  CANCELLATION PERIOD:
                  Both parties have the right to cancel this Agreement up to but no later than twenty-four
                  (24) hours following its execution. This Agreement cannot be cancelled once work is
                  commenced except by the written agreement of both parties.
                </li>
                <li>
                  <p>
                    INTEREST:
                    If {{abbreviation}} is not paid by the Property Representative within three (3) days of receipt of the
                    Available Proceeds Property Representative agrees that all unpaid amounts will bear
                    interest. Entitlement to the interest will commence three (3) days following Property
                    Representative’s receipt of the Available Proceeds from the insurance company. Interest
                    charges of 1.5% monthly are charged to all unpaid balances.
                  </p>
                  <p>
                    ATTORNEY FEES
                    {{abbreviation}} shall be entitled to reimbursement for costs of collection (including reasonable
                    attorney’s fees and costs) of unpaid amounts by owner/Agent. {{abbreviation}} shall also be entitled
                    to reimbursement and for reasonable attorney’s fees and costs for the breach or
                    enforcement of any terms of this entire Agreement.
                  </p>
                </li>
                <li>
                  PAYMENT:
                  The Property Representative is responsible for payment of all services, fees, rentals,
                  treatments, betterments, and service minimums provided regardless of insurance company
                  coverage or non-coverage and regardless of whether the Available Proceeds are made
                  payable to the Property Representative, to {{abbreviation}} and the Property Representative or to
                  {{abbreviation}} and the bank holding a mortgage on the Subject Property. Property Representative
                  agrees that to the extent possible the insurance company shall deliver the Available
                  Proceeds to {{abbreviation}}. If the Available Proceeds are not delivered to {{abbreviation}}, Property
                  Representative agrees to pay the payment to {{abbreviation}} within three (3) days of Property
                  Representative’s receipt of the Available Proceeds. Property Representative will within
                  three (3) days of receipt of the Available Proceeds endorse the Available Proceeds to {{abbreviation}}
                  for payment and {{abbreviation}} will return any excess payments of the Available Proceeds, if
                  applicable, to the Property Representative.
                </li>
              </ol>
              <div class="form__form-group">
                <ValidationProvider rules="required" v-slot="{errors}" vid="initial6" name="Initial">
                  <label for="initial6">Initial:</label>
                  <input id="initial6" type="text" v-model="initial6" class="form__input" />
                  <span class="form__input--error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </li>
            <li>
              <span class="font-weight-bold">Entire Agreement and Jurisdiction:</span>
              <p>Except as set forth in this Agreement entered into by the parties, this Agreement is the entire
                agreement between {{abbreviation}} and the Property Representative with respect to the subject matter
                hereof and replaces any prior agreements between them whether verbal or written. Should any
                provision of this Agreement be deemed invalid or unenforceable the parties request any court
                making such a determination to revise the provision at issue so that it will be valid and
                enforceable to the broadest extent possible and so that all the remaining provisions will remain
                valid and in full force and effect. This Agreement can only be amended or changed in writing
                signed by an officer of {{abbreviation}}. No waiver hereunder will be binding unless in writing signed by
                the waiving party. Any representation, statements or other communications not written in this
                Agreement are agreed to be immaterial and are not to be relied on by either party and are deemed
                to not have survived the execution of this Agreement. This Agreement may not be assigned
                except with the written permission of {{abbreviation}}.</p>
              <div class="form__form-group">
                <ValidationProvider rules="required" v-slot="{errors}" vid="initial7" name="Initial7">
                  <label for="initial7">Initial:</label>
                  <input id="initial7" type="text" v-model="initial7" class="form__input" />
                  <span class="form__input--error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
            </li>
          </ol>
          <h3 class="font-weight-bold">RETAINER AND RESERVE PAYMENT RELATED TO THE ABOVE AGREEMENT</h3>
          <ol class="form__form-group--listing">
            <li>
              Insured Property<br />
              The Subject Property is insured properly. The Property Representative agrees to pay $500.00 or
              50% of the “Available Proceeds” deductible whichever is greater upon the authorization of this
              Agreement. The Property Representative agrees to pay the remaining sum of the “Available
              Proceeds” deductible in its entirety within five (5) days of the authorization of this Agreement
              and/or when the last piece of equipment is picked up by {{abbreviation}} from the Subject Property
              whichever comes first. This payment is to retain, and reserve said services and equipment herein
              per this Agreement. This payment will be applied to the balance of the Available Proceeds as
              defined above.
            </li>
            <li>
              Pending Insurance<br />
              If insurance coverage is in question on the Subject Property by the Property Representative, then
              the Property Representative agrees to pay a minimum of $750.00 if insurance coverage is secured
              timely. The Property Representative agrees to pay the sum of the Available Proceeds’ deductible
              in its entirety within five (5) days of the authorization of this Agreement and/or when the last
              piece of equipment is picked up by {{abbreviation}} from the Subject Property whichever comes first. Once
              insurance coverage is confirmed or denied the project will then proceed following the above
              Insured Property provision as it relates to the amount of the retainer for a project for which there
              is insurance coverage. If insurance coverage is not obtained or if it is denied the project will then
              proceed following the below Non-Insured Property provision as it relates to the amount of the
              retainer for a project for which there is not insurance coverage. This payment is to retain, and
              reserve said services and equipment herein per this Agreement. This payment will be applied to
              the balance of the Available Proceeds as defined above.
            </li>
            <li>
              Non-Insured<br />
              If there is not any insurance coverage on the Subject Property, then Property Representative
              agrees to pay a minimum of $750.00 upon the authorization of this Agreement. The Property
              Representative agrees to pay a second sum of $750.00 for a total payment of $1,500.00 within
              five (5) days of the authorization of this Agreement and/or when the last piece of equipment is
              picked up by {{abbreviation}} from the Subject Property whichever comes first. This payment is to retain,
              and reserve said services and equipment herein per this Agreement. This payment will be applied
              to the balance of the Available Proceeds as defined above.
            </li>
            <div class="form__form-group form__form-group--inline">
                <ValidationProvider rules="required" v-slot="{errors}" vid="initial8" name="Initial">
                  <label for="initial8">Initial:</label>
                  <input id="initial8" type="text" v-model="initial8" class="form__input" />
                  <span class="form__input--error">{{ errors[0] }}</span>
                </ValidationProvider>
              </div>
          </ol>
          <div class="form__form-group form__form-group--inline form__form-group--info-box form__form-group--column">
              <h3 class="font-weight-bold">INSURED RETAINER & RESERVE</h3>
            <span>
              <label for="InsuredEndDate" class="form__label">Insured: Agreed “Term” End Date:</label>
              <v-dialog ref="dialogEndDate" v-model="insuredEndDateModal" :return-value.sync="insuredEndDate" persistent width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <input id="InsuredEndDate" v-model="insuredEndDateFormatted" v-bind="attrs" class="form__input form__input--short" v-on="on" @blur="insuredEndDate = parseDate(insuredEndDateFormatted)" readonly />
                </template>
                <v-date-picker v-model="insuredEndDate" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="#fff" @click="insuredEndDateModal = false">Cancel</v-btn>
                  <v-btn text color="#fff" @click="$refs.dialogEndDate.save(insuredEndDate)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </span>
            <span>
              <div>
                <label for="insuredPayment1" class="form__label">Insured Payment 1) = ($500.00 or 50% of Deductible):</label>
                <span class="form__input--currency">
                  $<input type="text" class="form__input form__input--short" v-model="insuredPay1" />
                </span>
              </div>
              <div class="form__form-group--inline">
                <label for="insuredDay1" class="form__label">Day (1) Date:</label>
                <v-dialog ref="insuredPayDay1" v-model="insuredPayment.day1Modal"
                          :return-value.sync="insuredPayment.day1Date" persistent width="400px">
                  <template v-slot:activator="{ on, attrs }">
                    <input id="insuredDay1" v-model="insuredPayment.day1DateFormatted" v-bind="attrs" readonly class="form__input form__input--short" v-on="on" 
                        @blur="insuredPayment.day1Date = parseDate(insuredPayment.day1DateFormatted)" />
                  </template>
                  <v-date-picker v-model="insuredPayment.day1Date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="insuredPayment.day1Modal = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.insuredPayDay1.save(insuredPayment.day1Date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </div>
            </span>
            <span>
              <div>
                <label for="insuredPayment2" class="form__label">Insured Payment 2) = (Remaining 50% of Deductible):</label>
                <span class="form__input--currency">
                  $<input id="insuredPayment2" type="text" class="form__input form__input--short" v-model="insuredPay2" />
                </span>
              </div>
              <div class="form__form-group--inline">
                <label for="insuredDay5" class="form__label">Day (5) Date:</label>
                <v-dialog ref="insuredPayDay5" v-model="insuredPayment.day5Modal"
                          :return-value.sync="insuredPayment.day5Date" persistent width="400px">
                  <template v-slot:activator="{ on, attrs }">
                    <input id="insuredDay5" v-model="insuredPayment.day5DateFormatted" v-bind="attrs" readonly
                          class="form__input form__input--short" v-on="on" @blur="insuredPayment.day5Date = parseDate(insuredPayment.day5DateFormatted)" />
                  </template>
                  <v-date-picker v-model="insuredPayment.day5Date" scrollable>
                    <v-spacer></v-spacer>
                    <v-btn text color="#fff" @click="insuredPayment.day5Modal = false">Cancel</v-btn>
                    <v-btn text color="#fff" @click="$refs.insuredPayDay5.save(insuredPayment.day5Date)">OK</v-btn>
                  </v-date-picker>
                </v-dialog>
              </div>
            </span>
          </div>
          <div class="form__form-group form__form-group--inline form__form-group--info-box form__form-group--column">
              <h3 class="font-weight-bold">NON-INSURED OR STILL PENDING COVERAGE RETAINER & RESERVE</h3>
            <span>
              <label for="NonInsuredEndDate" class="form__label">Non-Insured or Still Pending Coverage: Agreed “Term” End Date:</label>
              <v-dialog ref="dialognoninsuredEndDate" v-model="nonInsuredPayment.endDateModal"
                        :return-value.sync="nonInsuredPayment.endDate" persistent width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <input id="NonInsuredEndDate" v-model="nonInsuredPayment.endDateFormatted" v-bind="attrs"
                        class="form__input form__input--short" readonly v-on="on" @blur="nonInsuredPayment.endDate = parseDate(nonInsuredPayment.endDateFormatted)" />
                </template>
                <v-date-picker v-model="nonInsuredPayment.endDate" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="#fff" @click="nonInsuredPayment.endDateModal = false">Cancel</v-btn>
                  <v-btn text color="#fff" @click="$refs.dialognoninsuredEndDate.save(nonInsuredPayment.endDate)">OK
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </span>
            <span>
              <label for="NonInsuredDay1Date" class="form__label">Non-Insured or Still Pending Coverage: Payment 1) =
                $750.00 Day (1) Date:</label>
              <v-dialog ref="nonInsuredDay1" v-model="nonInsuredPayment.day1Modal"
                        :return-value.sync="nonInsuredPayment.day1Date" persistent width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <input id="NonInsuredDay1Date" v-model="nonInsuredPayment.day1DateFormatted" v-bind="attrs"
                        class="form__input form__input--short" readonly v-on="on" @blur="nonInsuredPayment.day1Date = parseDate(nonInsuredPayment.day1DateFormatted)" />
                </template>
                <v-date-picker v-model="nonInsuredPayment.day1Date" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="#fff" @click="nonInsuredPayment.day1Modal = false">Cancel</v-btn>
                  <v-btn text color="#fff" @click="$refs.nonInsuredDay1.save(nonInsuredPayment.day1Date)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </span>
            <span>
              <label for="NonInsuredDay5Date" class="form__label">Non-Insured or Still Pending Coverage: Payment 2) =
                $750.00 Day (5) Date:</label>
              <v-dialog ref="nonInsuredDay5" v-model="nonInsuredPayment.day5Modal"
                        :return-value.sync="nonInsuredPayment.day5Date" persistent width="400px">
                <template v-slot:activator="{ on, attrs }">
                  <input id="NonInsuredDay5Date" v-model="nonInsuredPayment.day5DateFormatted" v-bind="attrs"
                        class="form__input form__input--short" readonly v-on="on" @blur="nonInsuredPayment.day5Date = parseDate(nonInsuredPayment.day5DateFormatted)" />
                </template>
                <v-date-picker v-model="nonInsuredPayment.day5Date" scrollable>
                  <v-spacer></v-spacer>
                  <v-btn text color="#fff" @click="nonInsuredPayment.day5Modal = false">Cancel</v-btn>
                  <v-btn text color="#fff" @click="$refs.nonInsuredDay5.save(nonInsuredPayment.day5Date)">OK</v-btn>
                </v-date-picker>
              </v-dialog>
            </span>
          </div>
          <div class="form__form-group form__form-group--info-box">
              <div class="form__form-group--left-side">
                  <ValidationProvider rules="required" class="form__input--input-group" v-slot="{errors}" name="Address">
                      <label for="address" class="form__label">Address</label>
                      <input id="address" type="text" class="form__input" v-model="location.address" />
                      <span class="form__input--error">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider rules="required" class="form__input--input-group" v-slot="{errors}" name="City">
                      <label for="city" class="form__label">City:</label>
                      <input id="city" type="text" v-model="location.city" class="form__input" />
                      <span class="form__input--error">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider rules="required" class="form__input--input-group" v-slot="{errors}" name="State">
                      <label for="state" class="form__label">State:</label>
                      <input id="state" class="form__input" type="text" v-model="location.state" />
                      <span class="form__input--error">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider rules="required|numeric" class="form__input--input-group" v-slot="{errors}" name="Zip">
                      <label for="zip" class="form__label">Zip:</label>
                      <input type="text" id="zip" class="form__input" v-model="location.zip" />
                      <span class="form__input--error">{{ errors[0] }}</span>
                  </ValidationProvider>
              </div>
              <div class="form__form-group--right-side">
                  <ValidationProvider rules="required|alpha" v-slot="{errors}" name="First name" class="form__input--input-group">
                      <label for="firstname" class="form__label">First Name:</label>
                      <input type="text" id="firstname" class="form__input" v-model="firstName" />
                      <span class="form__input--error">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider rules="required|alpha" v-slot="{errors}" name="Last name" class="form__input--input-group">
                      <label for="lastname" class="form__label">Last Name:</label>
                      <input type="text" id="lastname" class="form__input" v-model="lastName" />
                      <span class="form__input--error">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <ValidationProvider rules="required|alpha_num|length:9" v-slot="{errors}" class="form__input--input-group" name="Drivers license number">
                      <label for="driverslicense" class="form__label">Driver's License #:</label>
                      <input type="text" id="driverslicense" class="form__input" v-model="driversLicense" />
                      <span class="form__input--error">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <div class="form__input--input-group">
                      <label for="relation" class="form__label">Relation:</label>
                      <input id="relation" type="text" class="form__input" v-model="relation" />
                  </div>
              </div>
          </div>
          <div class="form__form-group form__form-group--inline">
              <ValidationProvider rules="required|numeric" name="Square foot" v-slot="{errors}">
                  <label class="form__label">Minimum believed Square Foot as defined above:</label>
                  <input type="text" v-model="sqft" class="form__input" />
                  <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>
          </div>
          <p>{{abbreviation}} is solely and exclusively entitled to a minimum of $7.00 per square foot or $7,000.00</p>
          <p class="text-center">Property Representative understands {{company}} is not affiliated, associated, endorsed by, or in any way officially connected with any other company, agency or franchise.</p>
          <div class="form__form-group form__form-group--inline form__form-group--column">
              <span>
                  <label class="form__label">Driver's License #:</label>
                  <input type="text" readonly v-model="driversLicense" class="form__input form__input--input-group" />
              </span>
              <ValidationProvider rules="required|alpha_spaces" name="Name" v-slot="{errors}">
                  <label for="repPrint" class="form__label">Property Representative Print:</label>
                  <input type="text" id="repPrint" class="form__input form__input--input-group" v-model="repPrint" />
                  <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>
              <span>
                  <label class="form__label">Property Representative Signature:</label>
                  <lazy-signature-pad-modal :sigData="repSign" sigRef="repSignPad" name="Representative signature" />
              </span>
              <span>
                  <ValidationProvider class="form__input--input-group" name="Representative of" rules="required" v-slot="{errors}">
                      <label for="repOf" class="form__label">Property Representative of:</label>
                      <input type="text" id="repOf" class="form__input" v-model="representativeOf" />
                      <span class="form__input--error">{{ errors[0] }}</span>
                  </ValidationProvider>
                  <div class="form__input--input-group">
                      <label for="repOfDate" class="form__label">Date:</label>
                      <v-dialog ref="dialogRepDate" v-model="repDateModal" :return-value.sync="repDate" persistent width="400px">
                        <template v-slot:activator="{ on, attrs }">
                          <input id="repOfDate" v-model="repDateFormatted" v-bind="attrs"
                                class="form__input form__input--short" readonly v-on="on" @blur="repDate = parseDate(repDateFormatted)" />
                        </template>
                        <v-date-picker v-model="repDate" scrollable>
                          <v-spacer></v-spacer>
                          <v-btn text color="#fff" @click="repDateModal = false">Cancel</v-btn>
                          <v-btn text color="#fff" @click="$refs.dialogRepDate.save(repDate)">OK</v-btn>
                        </v-date-picker>
                      </v-dialog>
                  </div>
              </span>
              <span>
              <ValidationProvider rules="required" name="Witness" v-slot="{errors}" class="form__input--input-group">
                  <label for="witness" class="form__label">Witness</label>
                  <input type="text" id="witness" class="form__input" v-model="witness" />
                  <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>
              <ValidationProvider rules="required" name="Witness date" v-slot="{errors}" class="form__input--input-group">
                  <label for="witnesslabel" class="form__label">Witness date:</label>
                  <input type="hidden" v-model="witnessDate" />
                  <v-dialog ref="dialogWitnessDate" v-model="witnessDateModal" :return-value.sync="witnessDate" persistent width="400px">
                    <template v-slot:activator="{ on, attrs }">
                      <input id="witnesslabel" v-model="witnessDateFormatted" v-bind="attrs"
                            class="form__input form__input--short" readonly v-on="on" @blur="witnessDate = parseDate(witnessDateFormatted)" />
                    </template>
                    <v-date-picker v-model="witnessDate" scrollable>
                      <v-spacer></v-spacer>
                      <v-btn text color="#fff" @click="witnessDateModal = false">Cancel</v-btn>
                      <v-btn text color="#fff" @click="$refs.dialogWitnessDate.save(witnessDate)">OK</v-btn>
                    </v-date-picker>
                  </v-dialog>
                  <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>
              </span>
          </div>
          <div class="form__form-group form__form-group--inline form__form-group--column">
              <ValidationProvider class="form__input--input-group" rules="numeric" v-slot="{errors}">
                  <label for="numberOfRooms" class="form__label">Number of Rooms:</label>
                  <input id="numberOfRooms" type="text" class="form__input" v-model="numberOfRooms" />
                  <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>
              <ValidationProvider class="form__input--input-group" rules="numeric" v-slot="{errors}">
                  <label for="numberOfFloors" class="form__label">Number of Floors:</label>
                  <input type="text" id="numberOfFloors" class="form__input" v-model="numberOfFloors" />
                  <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>
              <ValidationProvider name="Payment option" rules="required" v-slot="{errors}" class="form__input--input-group">
                <p class="form__label">Which payment method will you use?</p>
                <ul class="form__form-group--inline">
                  <li v-for="(item, i) in paymentOptions" :key="`payment-${i}`" class="form__input--radio">
                    <label :for="item">{{item}}</label>
                    <input :id="item" type="radio" v-model="paymentOption" :value="item" />
                  </li>
                </ul><br />
                <span class="form__input--error">{{ errors[0] }}</span>
              </ValidationProvider>
          </div>
          <!-- <div class="form__form-group ">
            <VueSignaturePad class="form__input" width="100%" height="100%" id="sketch" ref="sketchPad" :options="{onBegin}" />
          </div> -->
        </fieldset>
        <div v-if="currentStep >= 2 && paymentOption == 'Credit Card'">
          <lazy-credit-card-form ref="creditCardForm" :partOfLastSection="true" :jobId="selectedJobId" :repPrint="repPrint"
            @submit="submitForm" @cardSubmit="cardSubmittedValue" />
        </div>
        <v-btn type="submit" v-if="currentStep === 1 && paymentOption == 'Credit Card'">Next</v-btn>
        <v-btn type="submit" :class="cardSubmitted || paymentOption !== 'Credit Card' ? 'button' : 'button--disabled'">{{ submitting ? 'Submitting' : 'Submit' }}</v-btn>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'
import goTo from 'vuetify/es5/services/goto'
import {mapGetters, mapActions} from 'vuex'
  export default {
    name: "AOBContractForm",
    props: ['company', 'abbreviation'],
    computed: {
        ...mapGetters(['getReports', 'getUser']),
        insuredDay1() {
            return this.insuredPayment.day1Date;
        },
        insuredDay5() {
            return this.insuredPayment.day5Date
        },
        nonInsuredEndDate() {
            return this.nonInsuredPayment.endDate;
        },
        nonInsuredDay1() {
            return this.nonInsuredPayment.day1Date;
        },
        nonInsuredDay5() {
            return this.nonInsuredPayment.day5Date;
        },
        aobContracts() {
          return this.getReports.filter((v) => {
            return v.ReportType === "aob"
          })
        }
    },
    data: (vm) => ({
      message: '',
      errorMessage: null,
      submitted: false,
      submitting: false,
      subjectProperty: '',
      cusSign: {
          data: '',
          isEmpty: true
      },
      cusSignDate: new Date().toISOString().substr(0, 10),
      cusSignDateModal: false,
      cusSignDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
      initial1: '',
      initial2:'',
      initial3:'',
      initial4:'',
      initial5:'',
      initial6:'',
      initial7:'',
      initial8: '',
      insuredEndDateModal: false,
        insuredEndDate: new Date().toISOString().substr(0, 10),
        insuredEndDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        insuredPayment: {
            day1Modal: false,
            day5Modal: false,
            firstStep: null,
            day1Date: new Date().toISOString().substr(0, 10),
            day1DateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            day5Date: new Date().toISOString().substr(0, 10),
            day5DateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10))
        },
        nonInsuredPayment: {
            endDateModal: false,
            day1Modal: false,
            day5Modal: false,
            endDate: new Date().toISOString().substr(0, 10),
            endDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            day1Date: new Date().toISOString().substr(0, 10),
            day1DateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
            day5Date: new Date().toISOString().substr(0, 10),
            day5DateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        },
        insuredPay1: '',
        insuredPay2: '',
        location: {
            address: null,
            city: null,
            state: null,
            zip: null
        },
        firstName:'',
        lastName:'',
        driversLicense: '',
        relation:'',
        sqft: '',
        repSign: {
            data: '',
            isEmpty: true
        },
        representativeOf: '',
        repPrint: '',
        repDateModal: false,
        repDate: new Date().toISOString().substr(0, 10),
        repDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        witness: '',
        witnessDate: new Date().toISOString().substr(0, 10),
        witnessDateModal:false,
        witnessDateFormatted: vm.formatDate(new Date().toISOString().substr(0, 10)),
        selectedJobId: "",
        selectActive: false,
        numberOfRooms: '',
        numberOfFloors: '',
        sketchData: {
          data: '',
          isEmpty: true
        },
        cardSubmitted: false,
        currentStep: 1,
        paymentOptions: ["Cash", "Credit Card", "Thrive"],
        paymentOption: ""
    }),
    watch: {
        insuredEndDate(val) {
            this.insuredEndDateFormatted = this.formatDate(val)
        },
        insuredDay1(val) {
            this.insuredPayment.day1DateFormatted = this.formatDate(val)
        },
        insuredDay5(val) {
            this.insuredPayment.day5DateFormatted = this.formatDate(val)
        },
        nonInsuredEndDate(val) {
            this.nonInsuredPayment.endDateFormatted = this.formatDate(val)
        },
        nonInsuredDay1(val) {
            this.nonInsuredPayment.day1DateFormatted = this.formatDate(val)
        },
        nonInsuredDay5(val) {
            this.nonInsuredPayment.day5DateFormatted = this.formatDate(val)
        },
        repDate(val) {
            this.repDateFormatted = this.formatDate(val)
        },
        witnessDate(val) {
            this.witnessDateFormatted = this.formatDate(val)
        },
        cusSignDate(val) {
            this.cusSignDateFormatted = this.formatDate(val)
        }
    },
    methods: {
        ...mapActions({
            addReport: 'indexDb/addReport',
            checkStorage: 'indexDb/checkStorage',
            mappingJobIds: 'mappingJobIds'
        }),
        cardSubmittedValue(params) {
          this.cardSubmitted = params
        },
        onBegin() {
          const {
            isEmpty
          } = this.$refs.sketchPad.saveSignature();
          this.sketchData.isEmpty = isEmpty
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
        parseDate(date) {
            if (!date) return null
            const [month, day, year] = date.split('/')
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
        },
        submitForm() {
            this.errorMessage = []
            const contracts = this.aobContracts.map((v) => {
              return v.JobId
            })
            this.$refs.form.validate().then(success => {
              if (!success) {
                this.submitting = false
                this.submitted = false
                return goTo(0)
              }
              if (!contracts.includes(this.selectedJobId)) {
                if ((this.currentStep === 1 && this.paymentOption !== 'Credit Card') || this.currentStep === 2) {
                  this.onSubmit()
                  return;
                }
                this.currentStep++;
              } else {
                this.errorMessage.push("Duplicate Job ID is not allowed")
                return goTo(0)
              }
            })
        },
        onSubmit() {
          const userNameObj = {
            first: this.getUser.name.split(" ")[0],
            last: this.getUser.name.split(" ")[1]
          }
          this.message = ''
          this.errorMessage = []
          const post = {
            JobId: this.selectedJobId,
            ReportType: 'aob',
            subjectProperty: this.subjectProperty,
            cusSign: this.cusSign.data,
            cusSignDate: this.cusSignDateFormatted,
            initial1: this.initial1,
            initial2: this.initial2,
            initial3: this.initial3,
            initial4: this.initial4,
            initial5: this.initial5,
            initial6: this.initial6,
            initial7: this.initial7,
            initial8: this.initial8,
            insuredTermEndDate: this.insuredEndDateFormatted,
            insuredPay1: this.insuredPay1,
            insuredPayDay1: this.insuredPayment.day1DateFormatted,
            insuredPay2: this.insuredPay2,
            insuredPayDay5: this.insuredPayment.day5DateFormatted,
            nonInsuredTermEndDate: this.nonInsuredPayment.endDateFormatted,
            nonInsuredDay1: this.nonInsuredPayment.day1DateFormatted,
            nonInsuredDay5: this.nonInsuredPayment.day5DateFormatted,
            location: this.location,
            firstName: this.firstName,
            lastName: this.lastName,
            driversLicense: this.driversLicense,
            relation: this.relation,
            minimumSqft: this.sqft,
            representativePrint: this.repPrint,
            repSignature: this.repSign.data,
            propertyRepOf: this.representativeOf,
            repDateSign: this.repDateFormatted,
            witness: this.witness,
            witnessDate: this.witnessDateFormatted,
            numberOfRooms: this.numberOfRooms,
            numberOfFloors: this.numberOfFloors,
            teamMember: userNameObj
          };
          if (this.$nuxt.isOffline) {
            this.addReport(post).then(() => {
              this.message = "AOB & Mitigation Contract was saved successfully to be submitted later."
              this.submitted = true
              setTimeout(() => {
                this.message = ""
              }, 2000)
            }).catch((err) => {
              this.errorMessage.push(err)
            })
          } else {
            this.$axios.$post("/api/aob/new", post).then((res) => {
              if (res.errors) {
                this.errorMessage = res.errors
                return
              }
              this.message = "AOB & Mitigation Contract submitted!"
              this.submitted = true
              setTimeout(() => {
                this.message = ""
                this.$router.push("/")
              }, 2000)
            }).catch((err) => {
              this.errorMessage.push(err)
            })
          }
        }
    },
    mounted() {
        this.checkStorage()
        this.mappingJobIds()
    }
  }
</script>
<style lang="scss">
#sketchPad {
  max-width:800px;
  height:600px;
}
</style>