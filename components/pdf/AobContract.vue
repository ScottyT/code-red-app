<template>
    <div class="report-details">
        <div class="report-details__content">
            <section slot="pdf-content">
                    
                    <div class="report-details__company-logo">
                        <img src="https://images.prismic.io/water-emergency-services/31b3f2ab-d44e-4f77-8072-faef63fcceb5_WESI+new+Shield+Graphic_800x800.png?auto=compress,format" />
                    </div>
                    <div class="text-center pdf-first-section">
                        <h1>{{company}}</h1>
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
                        <span class="text-decoration-underline pdf-detail">{{contracts.subjectProperty}}</span><br />
                        <label>(hereinafter referred to as “Subject Property”)</label>
                    </div>
                    <div class="report-details__section pdf-detail">
                        <ol class="report-details__listing">
                            <li>
                                <span class="font-weight-bold">Assignment of Claim to {{company}}:</span>
                                <div class="report-details__data-field">
                                    <label>Initial:</label>
                                    <span>{{contracts.initial1}}</span>
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
                                <div class="report-details__data report-details__data--row report-details__data-sig">
                                    <div class="report-details__data-field">
                                        <label>Signature:</label>
                                        <div class="report-details__data--sig"
                                            :style="'background-image:url('+contracts.cusSign+')'"></div>
                                    </div>
                                    <div class="report-details__data-field">
                                        <label>Date: </label>
                                        <div>{{contracts.cusSignDate}}</div>
                                    </div>
                                </div>
                            </li>
                            <!-- <div class="html2pdf__page-break"/> -->
                            <li>
                                <span class="font-weight-bold">Direction of Payment to {{company}}:</span>
                                <div class="report-details__data-field">
                                    <label>Initial:</label>
                                    <span>{{contracts.initial2}}</span>
                                </div>
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
                            </li>
                            
                            <li>
                                <span class="font-weight-bold">Property Representative Cooperation Required:</span>
                                <div class="report-details__data-field">
                                    <label>Initial:</label>
                                    <span>{{contracts.initial3}}</span>
                                </div>
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
                            </li>
                            <li>
                                <span class="font-weight-bold">{{abbreviation}} is contracted to performing the below mitigation services
                                from start to finish.</span>
                                <div class="report-details__data-field">
                                    <label>Initial:</label>
                                    <span>{{contracts.initial4}}</span>
                                </div>
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
                            </li>
                            <div class="html2pdf__page-break"/>
                            <li>
                                <span class="font-weight-bold">{{abbreviation}} is contracted for its services including equipment rental
                                services as set forth herein:</span>
                                <div class="report-details__data-field">
                                    <label>Initial:</label>
                                    <span>{{contracts.initial5}}</span>
                                </div>
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
                                    <div class="html2pdf__page-break"/>
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
                            </li>
                            
                            <li>
                                <span class="font-weight-bold">Terms and Conditions:</span>
                                <div class="report-details__data-field">
                                    <label>Initial:</label>
                                    <span>{{contracts.initial6}}</span>
                                </div>
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
                                <div class="html2pdf__page-break"/>
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
                                <!-- <div class="html2pdf__page-break"/> -->
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
                                <div class="html2pdf__page-break"/>
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
                                <!-- <div class="html2pdf__page-break"/> -->
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
                            </li>
                            <!-- <div class="html2pdf__page-break"/> -->
                            <li>
                                <span class="font-weight-bold">Entire Agreement and Jurisdiction:</span>
                                <div class="report-details__data-field">
                                    <label>Initial:</label>
                                    <span>{{contracts.initial7}}</span>
                                </div>
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
                                
                            </li>
                        </ol>
                    </div>
                   
                    <div class="report-details__section pdf-detail">
                        <ol class="report-details__listing">
                            <h3 class="font-weight-bold">RETAINER AND RESERVE PAYMENT RELATED TO THE ABOVE AGREEMENT</h3>
                            <div class="report-details__data-field">
                                <label>Initial:</label>
                                <span>{{contracts.initial7}}</span>
                            </div>
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
                            <div class="html2pdf__page-break"/>
                            <li style="margin-top:10px;">
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
                        </ol>
                    </div>
                     <!-- <div class="html2pdf__page-break"/> -->
                    <div class="report-details__bordered pdf-detail">
                        <div class="report-details__data report-details__data--row">
                            <div class="report-details__data-field">
                                <label>Insured: Agreed "Term" End Date:</label>
                                <span>{{contracts.insuredTermEndDate}}</span>
                            </div>
                        </div>
                        <div class="report-details__data report-details__data--row">
                            <div class="report-details__data-field">
                                <label>Insured Payment 1) = ($500.00 or 50% of Deductible)</label>
                                <span>${{contracts.insuredPay1}}</span>
                            </div>
                            <div class="report-details__data-field">
                                <label>Day (1) Date: </label>
                                <span>{{contracts.insuredPayDay1}}</span>
                            </div>
                        </div>
                        <div class="report-details__data report-details__data--row">
                            <div class="report-details__data-field">
                                <label>Insured Payment 2) = (Remaining 50% of Deductible)</label>
                                <span>${{contracts.insuredPay2}}</span>
                            </div>
                            <div class="report-details__data-field">
                                <label>Day (5) Date: </label>
                                <span>{{contracts.insuredPayDay5}}</span>
                            </div>
                        </div>
                    </div>
                    <div class="report-details__bordered pdf-detail">
                        <div class="report-details__data report-details__data--row">
                            <div class="report-details__data-field">
                                <label>Non-Insured or Still Pending Coverage: Agreed “Term” End Date:</label>
                                <div>{{contracts.nonInsuredTermEndDate}}</div>
                            </div>
                        </div>
                        <div class="report-details__data report-details__data--row">
                            <label>Non-Insured or Still Pending Coverage: Payment 1) = $750.00 Day (1) Date: </label>
                            <div>{{contracts.nonInsuredDay1}}</div>
                        </div>
                        <div class="report-details__data report-details__data--row">
                            <label>Non-Insured or Still Pending Coverage: Payment 1) = $750.00 Day (1) Date: </label>
                            <div>{{contracts.nonInsuredDay5}}</div>
                        </div>
                    </div>
                    
                    <div class="report-details__section">
                        <div class="report-details__data">
                            <label>Address:</label>
                            <div>{{contracts.location.address}}</div>
                        </div>
                        <div class="report-details__data">
                            <label>City:</label>
                            <div>{{contracts.location.city}}</div>
                        </div>
                        <div class="report-details__data">
                            <label>State:</label>
                            <div>{{contracts.location.state}}</div>
                        </div>
                        <div class="report-details__data">
                            <label>Zip:</label>
                            <div>{{contracts.location.zip}}</div>
                        </div>
                        <div class="report-details__data">
                            <label>First Name:</label>
                            <div>{{contracts.firstName}}</div>
                        </div>
                        <div class="report-details__data">
                            <label>Last Name:</label>
                            <div>{{contracts.lastName}}</div>
                        </div>
                        <div class="report-details__data">
                            <label>Drivers License #:</label>
                            <div>{{contracts.driversLicense}}</div>
                        </div>
                        <div class="report-details__data">
                            <label>Relation:</label>
                            <div>{{contracts.relation}}</div>
                        </div>
                    </div>
                    <div class="report-details__data--row">
                        <label>Minimum believed Square Foot as defined above: </label>
                        <div>{{contracts.minimumSqft}}</div>
                    </div>
                    <div class="html2pdf__page-break"/>
                    <div class="pdf-item">
                        <p class="text-center detail-margin-top">Property Representative understands Water Emergency Services Incorporated is not affiliated, associated, endorsed 
                            by, or in any way officially connected with any other company, agency or franchise.</p>
                    </div>
                    <div class="report-details__bordered">
                        <div class="report-details__data report-details__data--row">
                            <label>Driver's License Number:</label>
                            <div>{{contracts.driversLicense}}</div>
                        </div>
                        <div class="report-details__data report-details__data--row">
                            <label>Property Representative Print:</label>
                            <div>{{contracts.representativePrint}}</div>
                        </div>
                        <div class="report-details__data report-details__data--row report-details__data-sig" style="align-items:none;">
                            <div class="report-details__data-field">
                                <label>Property Representative Signature:</label>
                                <div class="report-details__data--sig pdf-sig"
                                    :style="'background-image:url('+contracts.repSignature+')'"></div>
                            </div>                       
                        </div>
                        <div class="report-details__data report-details__data--row">
                            <div class="report-details__data-field">
                                <label>Property Representative of:</label>
                                <div>{{contracts.propertyRepOf}}</div>
                            </div>
                            <div class="report-details__data-field">
                                <label>Date:</label>
                                <div>{{contracts.repDateSign}}</div>
                            </div>
                        </div>
                        <label>Witness:</label>
                        <div>{{contracts.witness}}</div>
                        <label>Witness date:</label>
                        <div>{{contracts.witnessDate}}</div>
                    </div>
                    <div class="html2pdf__page-break"/>
                    <div class="report-details__data data-section">
                        <div class="data-section__heading">Debit/Credit Cards</div>
                        <div class="data-section__data" v-for="card in cards" :key="card.cardNumber">
                            <div class="data-section__data--group">
                                <div class="data-section__subheading">Cardholder</div>
                                <div class="data-section__data--group-item">
                                    <label>Name:</label>
                                    <div>{{card.cardholderName}}</div>
                                </div>
                                <div class="data-section__data--group-item">
                                    <label>Email:</label>
                                    <div>{{card.cardholderInfo.email}}</div>
                                </div>
                                <div class="data-section__data--group-item">
                                    <label>Phone number:</label>
                                    <div>{{card.cardholderInfo.phoneNumber}}</div>
                                </div>
                                <div class="data-section__data--group-item">
                                    <label>Name of card:</label>
                                    <div>{{card.creditCard}}</div>
                                </div>
                                <div class="data-section__data--group-item">
                                    <label>Card Number:</label>
                                    <div>{{card.cardNumber}}</div>
                                </div>
                                <div class="data-section__data--group-item">
                                    <label>CVC Number:</label>
                                    <div>{{card.cvcNum}}</div>
                                </div>
                                <div class="data-section__data--group-item">
                                    <label>Expiration Date:</label>
                                    <div>{{card.expirationDate}}</div>
                                </div>
                            </div>
                            <div class="data-section__data--group">
                                <div class="data-section__subheading">Billing Address</div>
                                <div class="data-section__data--group-item">
                                    <label>Address 1:</label>
                                    <div>{{card.billingAddress.address1}}</div>
                                </div>
                                <div class="data-section__data--group-item" v-show="card.billingAddress.address2">
                                    <label>Address 2:</label>
                                    <div>{{card.billingAddress.address2}}</div>
                                </div>
                                <div class="data-section__data--group-item">
                                    <label>City: </label>
                                    <div>{{card.billingAddress.city}}</div>
                                </div>
                                <div class="data-section__data--group-item">
                                    <label>State: </label>
                                    <div>{{card.billingAddress.state}}</div>
                                </div>
                                <div class="data-section__data--group-item">
                                    <label>Zip: </label>
                                    <div>{{card.billingAddress.zip}}</div>
                                </div>
                            </div>
                            <div class="data-section__data--group data-section__signature">
                                <label>Card Owner Signature:</label>
                                <div class="data-section__data--group-item">                                  
                                    <div class="report-details__data--sig pdf-sig"
                                        :style="'background-image:url('+card.customerSig+')'"></div>
                                </div> 
                            </div>
                            <div class="data-section__card-images">
                                <div class="card-image" v-for="(image, i) in cardImages.filter(v => v.cardNumber == card.cardNumber)" :key="`card-${i}`">                                   
                                    <img :src="image.url" />
                                </div>
                            </div>
                            <div class="html2pdf__page-break"/>
                        </div>
                    </div>
            </section>
        </div>
    </div>
</template>
<script>
export default {
  name: "AobContractContent",
  props: ['contracts', 'company', 'abbreviation'],
  data() {
    return {
      cards: [],
      errorMessage: "",
      cardImages: []
    }
  },
  methods: {
    getCardImages(card) {
      var storageRef = this.$fire.storage.ref()
      var listRef = storageRef.child(card)
      listRef.listAll().then((res) => {
        res.items.forEach((itemRef) => {
          var itemPath = itemRef.fullPath;
          storageRef.child(itemPath).getDownloadURL().then((url) => {
            var fileName = itemPath.substring(itemPath.lastIndexOf('/') + 1, itemPath.length)
            var fileType = itemPath.substring(itemPath.lastIndexOf('.'), itemPath.length)
            const fileObj = {
              cardNumber: card,
              name: fileName,
              url: url,
              type: fileType
            }
            this.cardImages.push(fileObj)
          }).catch((err) => {
            this.errorMessage = err
          })
        })
      })
    }
  },
  mounted() {
    this.$nextTick(() => {
      setTimeout(() => {
        this.$emit("domRendered");
      }, 1000)
    })
  },
  created() {
    this.$axios.$get(`/api/reports/credit-card/${this.contracts.JobId}`).then((res) => {
      this.cards = res
      this.cards.forEach((card) => {
        this.getCardImages(card.cardNumber)
      })
    });
  }
}
</script>
<style lang="scss" scoped>
.data-section {
    margin: 20px 0;
    display:grid;
    grid-template-columns: 1fr;
    &__heading {
        font-size:1.4em;
        font-weight:bold;
        text-align:center;
    }
    &__subheading {
        font-size:1.2em;
        font-weight:bold;
        grid-row:1/2;
        text-decoration: underline;
    }
    &__data {
        width:100%;
        padding:5px;
        margin-top:5px;
        display:grid;
        grid-column:1 span;
        grid-template-columns:1fr;
        grid-template-rows:1fr 1fr 150px 210px;
        &--group {
            padding-bottom:20px;
            display:grid;
            grid-template-rows:50px 1fr;
            grid-template-columns:repeat(auto-fill, minmax(150px, 1fr));
        }
        &--group-item {
            height:100%;
            &:not(:last-child) {
                padding-bottom:5px;
            }
        }
    }
    &__signature {
        grid-template-columns:1fr;
    }
    &__card-images {
        position:relative;
        display:inline-flex;
        flex-direction:row;
        justify-content:space-between;
        height:200px;
        div:nth-child(2) {
            left:400px;
        }
    }
}
.card-image {
    max-width:300px;
    height:200px;
    position:absolute;
    top:0;
    display:inline-block;
}
.pdf-item {
    .detail-margin-top {
        margin-top:10px;
    }
    .pdf-detail {
        margin-top:20px;
        &:not(:last-child) {
          margin-bottom: 10px;
        }
    }
    .pdf-first-section {
        text-align:center;
        margin-bottom:10px;
    }
    .pdf-sig {
        width:500px;
        height:295px;
    }
    &.sig-row {
        height:400px;
    }
}
</style>