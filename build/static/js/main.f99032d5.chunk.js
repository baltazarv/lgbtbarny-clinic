(this["webpackJsonplgbtbarny-clinic"]=this["webpackJsonplgbtbarny-clinic"]||[]).push([[0],{168:function(e,t,a){e.exports={cardContainer:"InquirerForm_cardContainer__3A_X-"}},172:function(e,t,a){e.exports=a.p+"static/media/logo.27bb8508.webp"},176:function(e,t,a){e.exports=a(357)},354:function(e,t,a){},356:function(e,t,a){},357:function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),o=a(11),i=a.n(o),s=a(108),l=a(66),c=a(67),u=a(76),m=a(68),p=a(77),d=a(28),f=a(39),h=a(30),b=a(16),y=a(185);y.configure({endpointUrl:"https://api.airtable.com",apiKey:"keyX3YmCaFefmaOdz"});var g,E=y.base("appLFz5YfXTDslp2U"),v="Annual Household Income",O="Lawyer",N="Inquirer",w="Inquirer's Situation",I="Disposition",C="Referral Summary",S="Type Of Law",P=function(e){return{type:"INIT_LAWYERS",lawyers:e}},j=function(e){return{type:"INIT_INQUIRERS",inquirers:e}},D=function(e){return{type:"SET_CURRENT_INQUIRERS",currentInquirers:e}},k=function(e){return{type:"INIT_LAW_TYPES",lawTypes:e}},T=function(e){return{type:"CONSULTATION_CREATED",newConsultion:e}},R=a(171),q=a(52),F=a(33),L=a(53),x=a(6),B=a(51),_=a(50),A=a(35),M=a(44),U=a(78),G=a(168),Y=a.n(G);function V(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function H(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?V(a,!0).forEach((function(t){Object(b.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):V(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var z="No further action required or available. Info/counsel provided.",W="Fee-based - Lawyer Referral Network (LRN) - limited availability",Q="Pro Bono Panel (PBP) - VERY limited availability!",X="Highly compelling/impact litigation",J=(g={},Object(b.a)(g,"Type","Clinic"),Object(b.a)(g,"Date",(new Date).toISOString().substr(0,10)),g),K=function(e){return r.a.createElement(M.a,Object.assign({},e,{size:e.size,"aria-labelledby":"contained-modal-title-vcenter",centered:!0}),r.a.createElement(M.a.Header,{closeButton:!0},r.a.createElement(M.a.Title,{id:"contained-modal-title-vcenter"},e.title)),r.a.createElement(M.a.Body,null,r.a.createElement("h4",null,e.heading),r.a.createElement("p",null,e.body)),r.a.createElement(M.a.Footer,null,r.a.createElement(B.a,{onClick:e.onHide},e.buttonsecondlabel),r.a.createElement(B.a,{onClick:e.onHide},e.buttoncloselabel)))},$=function(e){function t(e){var a;return Object(l.a)(this,t),(a=Object(u.a)(this,Object(m.a)(t).call(this,e))).showConsultModal=function(){a.setState({showConsultModal:!0})},a.hideConsultModal=function(){a.setState({showConsultModal:!1})},a.formatName=function(e){var t=e.firstName,a=e.middleName,n=e.otherNames,r=e.lastName;return(t||"")+(a?" "+a:"")+" "+(r||"")+(n?" ("+n+")":"")},a.handleLawyerSelectChange=function(e){var t=e.reduce((function(e,t){return e.push(t.value),e}),[]);a.setState((function(a,n){var r=H({},a.submitFields);return r[O]=t,{submitFields:r,lawyers:e}}))},a.handleInquirerSelectChange=function(e){var t=e.reduce((function(e,t){return e.push(t.value),e}),[]);a.setState((function(a,n){var r=H({},a.submitFields);return r[N]=t,{submitFields:r,inquirers:e}}));var n=[];e.length>0&&e.forEach((function(e){var t=a.props.inquirers.find((function(t){return t.id===e.value}));n=[].concat(Object(h.a)(n),[t])})),a.props.initCurrentInquirers(n)},a.handleInputChange=function(e){var t=e.target,n="checkbox"===t.type?t.checked:t.value,r=t.name,o=H({},a.state.submitFields);switch(r){case"situation":o[w]=n;break;case"refSummary":o[C]=n}a.setState((function(e,t){return Object(b.a)({submitFields:o},r,n)}))},a.dispoRadioOnChange=function(e){if("formDispositionFeeBased"===e.currentTarget.id||"formDispositionProBono"===e.currentTarget.id?a.setState({isReferralDispositionChecked:!0}):a.setState({isReferralDispositionChecked:!1}),e.target.checked){var t=e.target.value;a.setState((function(e,a){var n=H({},e.submitFields);return n[I]=[t],{submitFields:n}}))}},a.handleTypeOfLawSelectChange=function(e){var t=e.reduce((function(e,t){return e.push(t.value),e}),[]);a.setState((function(a,n){var r=H({},a.submitFields);return r[S]=t,{submitFields:r,lawTypes:e}}))},a.handleSubmit=function(e){e.preventDefault(),e.stopPropagation(),!0===e.currentTarget.checkValidity()&&a.props.createConsultation(a.state.submitFields),a.setState({validated:!0})},a.clearForm=function(){a.inquirerForm.current.reset(),a.formDispositionNoFurther.current.checked=!1,a.formDispositionFeeBased.current.checked=!1,a.formDispositionProBono.current.checked=!1,a.formDispositionImpact.current.checked=!1,a.setState({lawyers:[],inquirers:[],situation:"",dispositions:[],refSummary:"",lawTypes:[],submitFields:J,submitButtonLabel:"Submit Another",validated:!1,isReferralDispositionChecked:!1}),a.props.setCurrentInquirers([])},a.inquirerForm=r.a.createRef(),a.formDispositionNoFurther=r.a.createRef(),a.formDispositionFeeBased=r.a.createRef(),a.formDispositionProBono=r.a.createRef(),a.formDispositionImpact=r.a.createRef(),a.state={isInquirerInfoOpen:!1,formDispositionNoFurther:!1,isReferralDispositionChecked:!1,formDispositionProBono:!1,formDispositionImpact:!1,showConsultModal:!1,lawyers:[],inquirers:[],situation:"",refSummary:"",lawTypes:[],submitFields:J,validated:!1,submitButtonLabel:"Submit"},a}return Object(p.a)(t,e),Object(c.a)(t,[{key:"componentDidMount",value:function(){this.props.getLawyers(),this.props.getInquirers(),this.props.getLawTypes()}},{key:"componentDidUpdate",value:function(e){"success"===this.props.consultSubmitStatus.status&&(this.clearForm(),this.props.consultationInProgress())}},{key:"render",value:function(){var e=this;console.log("state",this.state,"consultSubmitStatus");var t=this.props.inquirers.reduce((function(t,a){if(a.firstName||a.lastName){var n={value:a.id,label:e.formatName(a)};return[].concat(Object(h.a)(t),[n])}return t}),[]),a=this.props.lawyers.reduce((function(t,a){if(a.firstName||a.lastName){var n={value:a.id,label:e.formatName(a)};return[].concat(Object(h.a)(t),[n])}return t}),[]),n=this.props.lawTypes.reduce((function(e,t){return[].concat(Object(h.a)(e),[{value:t.id,label:t.type}])}),[]),o="Loading...";return this.props.currentInquirers&&(o=this.props.currentInquirers.map((function(t){return r.a.createElement("div",{key:t.id},r.a.createElement(L.a.Footer,null,r.a.createElement("strong",null,"Information for:")," ",e.formatName(t)),r.a.createElement(A.a,{className:"mb-3"},r.a.createElement(A.a.Item,{variant:"light"},r.a.createElement("strong",null,"Gender Pronouns",":")," ",t.pronouns?t.pronouns[0]:"no answer"),r.a.createElement(A.a.Item,{variant:"light"},r.a.createElement("strong",null,v,":")," ",t.income?t.income:"no answer"),r.a.createElement(A.a.Item,{variant:"light"},r.a.createElement("dl",{className:"row mb-0"},r.a.createElement("dt",{className:"col-sm-3"},"Intake Notes",":"),r.a.createElement("dd",{className:"col-sm-9 mb-0"},t.intakeNotes?t.intakeNotes:"none"))),"Yes"===t.repeatVisit?r.a.createElement(A.a.Item,{variant:"light"},r.a.createElement("strong",null,"Repeat Visit(s):")," Yes"):null,t.consultationsExp?r.a.createElement(A.a.Item,null,r.a.createElement("strong",null,"Previous Consultations:"),r.a.createElement("ul",{className:"mb-0"},t.consultationsExp.map((function(t){return r.a.createElement("li",{key:t.id},r.a.createElement(B.a,{onClick:e.showConsultModal,variant:"link",size:"sm"},t.name))})))):null))}))),r.a.createElement(r.a.Fragment,null,r.a.createElement(R.a,null,r.a.createElement(L.a,{className:Y.a.cardContainer},r.a.createElement(L.a.Header,null),r.a.createElement(L.a.Body,null,r.a.createElement(x.a,{noValidate:!0,validated:this.state.validated,onSubmit:this.handleSubmit,ref:this.inquirerForm},r.a.createElement("h1",{className:"h1"},"Clinic Consultation"),r.a.createElement("div",{className:"mb-3 small"},"Please insert the information you collected for each client that you spoke to. Give a summary of the client's issue and indicate whether or not they need a referral."),r.a.createElement("p",{className:"text-danger small"},"*Required"),r.a.createElement(x.a.Group,{as:q.a,controlId:"inquirerPulldown"},r.a.createElement(x.a.Label,{column:!0,sm:3,className:"text-md-right"},"Lawyer(s)",r.a.createElement("span",{className:"text-danger"},"*")),r.a.createElement(F.a,{sm:9},r.a.createElement(x.a.Text,{className:"text-muted"},"Add your name."),r.a.createElement(U.a,{options:a,isMulti:!0,required:!0,value:this.state.lawyers,onChange:function(t){return e.handleLawyerSelectChange(t)}}),r.a.createElement(x.a.Control.Feedback,{type:"invalid"},"Please choose a visitor."))),r.a.createElement(x.a.Group,{as:q.a,controlId:"inquirerPulldown"},r.a.createElement(x.a.Label,{column:!0,sm:3,className:"text-md-right"},"Visitor(s)",r.a.createElement("span",{className:"text-danger"},"*")),r.a.createElement(F.a,{sm:9},r.a.createElement(x.a.Text,{className:"text-muted"},"Choose visitor or multiple visitors if relevant."),r.a.createElement(U.a,{options:t,isMulti:!0,required:!0,value:this.state.inquirers,onChange:function(t){return e.handleInquirerSelectChange(t)}}),r.a.createElement(x.a.Control.Feedback,{type:"invalid"},"Please choose a visitor."))),r.a.createElement(_.a,{in:this.state.isInquirerInfoOpen,className:"mb-4"},r.a.createElement("div",{id:"visitor-info",className:"small"},o)),r.a.createElement(x.a.Group,{controlId:"notes"},r.a.createElement(x.a.Label,{className:"bold mb-0"},"Notes"),r.a.createElement(x.a.Text,{className:"text-muted mt-0 mb-1"},"Please describe the factual situation as well as the legal assessment."),r.a.createElement(x.a.Control,{as:"textarea",rows:"5",value:this.state.situation,name:"situation",onChange:this.handleInputChange})),r.a.createElement("fieldset",{className:"mb-4"},r.a.createElement(x.a.Group,{as:q.a},r.a.createElement(x.a.Label,{as:"legend",column:!0,sm:3,className:"bold text-md-right"},"Disposition",r.a.createElement("span",{className:"text-danger"},"*")),r.a.createElement(F.a,{sm:9},r.a.createElement(x.a.Check,{type:"radio",label:z,value:z,name:"formDispositionRadios",required:!0,id:"formDispositionNoFurther",ref:this.formDispositionNoFurther,onChange:function(t){return e.dispoRadioOnChange(t)}}),r.a.createElement(x.a.Check,{type:"radio",label:W,value:W,name:"formDispositionRadios",id:"formDispositionFeeBased",ref:this.formDispositionFeeBased,onChange:function(t){return e.dispoRadioOnChange(t)}}),r.a.createElement(x.a.Check,{type:"radio",label:Q,value:Q,name:"formDispositionRadios",id:"formDispositionProBono",ref:this.formDispositionProBono,onChange:function(t){return e.dispoRadioOnChange(t)}}),r.a.createElement(x.a.Check,{type:"radio",label:X,value:X,name:"formDispositionRadios",id:"formDispositionImpact",ref:this.formDispositionImpact,onChange:function(t){return e.dispoRadioOnChange(t)}})))),r.a.createElement(_.a,{in:this.state.isReferralDispositionChecked},r.a.createElement("div",{id:"referrals"},r.a.createElement("div",{className:"mb-2"},r.a.createElement("em",null,"If LRN or PBP is chosen above, please fill out the following for to allow for this case to be referred.")),r.a.createElement(x.a.Group,{as:q.a,controlId:"typeOfLawPulldown"},r.a.createElement(x.a.Label,{column:!0,sm:4,className:"bold text-md-right"},"Type Of Law",r.a.createElement("span",{className:"text-danger"},"*")),r.a.createElement(F.a,{sm:8},r.a.createElement(x.a.Text,{className:"text-muted"},"Choose any relevant types of law."),r.a.createElement(U.a,{options:n,isMulti:!0,required:!0,value:this.state.lawTypes,onChange:function(t){return e.handleTypeOfLawSelectChange(t)}}),r.a.createElement(x.a.Control.Feedback,{type:"invalid"},"Please the type of law."))),r.a.createElement(x.a.Group,{controlId:"notes"},r.a.createElement(x.a.Label,{className:"bold mb-0"},"Referral Summary",r.a.createElement("span",{className:"text-danger"},"*")),r.a.createElement(x.a.Text,{className:"text-muted mt-0 mb-1"},"If LRN or PBP is chosen above, add a one- or two-sentence referral summary that can be used independently of the Notes above in order to make a referral to our network.",r.a.createElement("br",null),r.a.createElement("br",null),'Model: "Clinic visitor seeks attorney for representation in landlord-tenant matter.  Person is able to pay to retain a lawyer."'),r.a.createElement(x.a.Control,{as:"textarea",rows:"3",value:this.state.refSummary,name:"refSummary",onChange:this.handleInputChange})))),r.a.createElement(B.a,{variant:"primary",type:"submit"},this.state.submitButtonLabel))))),r.a.createElement(K,{size:"md",show:this.state.showConsultModal,onHide:function(){return e.hideConsultModal()},title:"Previous Consultation",heading:"Inquirer \u2013 Date",body:"Coming soon.",buttonsecondlabel:"Edit & Replace Current",buttoncloselabel:"Close"}))}}],[{key:"getDerivedStateFromProps",value:function(e,t){return e.currentInquirers.length>0?{isInquirerInfoOpen:!0}:{isInquirerInfoOpen:!1}}}]),t}(n.Component),Z=Object(f.b)((function(e){return{lawyers:e.people.lawyers,inquirers:e.people.inquirers,currentInquirers:e.people.currentInquirers,lawTypes:e.lawTypes.lawTypes,consultSubmitStatus:e.consultations.consultSubmitStatus}}),(function(e){return{getLawyers:function(){return e((function(e){var t=[];E("People").select({fields:["First Name","Middle Name","Last Name","Other Names"],view:"Lawyers"}).eachPage((function(e,a){e.forEach((function(e){t.push({id:e.id,firstName:e.get("First Name"),middleName:e.get("Middle Name"),lastName:e.get("Last Name"),otherNames:e.get("Other Names")})})),a()}),(function(a,n){a?console.log(a):e(P(t))}))}))},getInquirers:function(){return e((function(e){var t=[];E("People").select({view:"Inquirers",fields:["First Name","Middle Name","Last Name","Other Names","Gender Pronouns",v,"Intake Notes","Repeat Visit?","Consultations"]}).eachPage((function(e,a){e.forEach((function(e){t.push({id:e.id,firstName:e.get("First Name"),middleName:e.get("Middle Name"),lastName:e.get("Last Name"),otherNames:e.get("Other Names"),pronouns:e.get("Gender Pronouns"),income:e.get(v),intakeNotes:e.get("Intake Notes"),repeatVisit:e.get("Repeat Visit?"),consultations:e.get("Consultations")})})),a()}),(function(a,n){a?console.error(a):e(j(t))}))}))},initCurrentInquirers:function(t){return e(function(e){return function(t){if(e.every((function(e){return e.consultations&&e.consultationsExp})))t(D(e));else{var a="OR(";a+=e.reduce((function(e,t){return t.consultations&&!t.consultationsExp?[].concat(Object(h.a)(e),Object(h.a)(t.consultations)):e}),[]).map((function(e){return"RECORD_ID() = '".concat(e,"'")})).toString(),a+=")";var n=[];E("Consultations").select({filterByFormula:a,fields:["Name","Date",O,N,w,I,C,S,"Status"]}).eachPage((function(e,t){e.forEach((function(e){n.push({id:e.id,name:e.get("Name"),date:e.get("Date"),lawyers:e.get(O),inquirers:e.get(N),situation:e.get(w),dispositions:e.get(I),summary:e.get(C),lawTypes:e.get(S),status:e.get("Status")})})),t()}),(function(a){if(a)console.log("Airtable Error: ",a);else{var r=e.map((function(e){var t=null;return e.consultations&&!e.consultationsExp&&(t=e.consultations.map((function(e){return n.find((function(t){return e===t.id}))}))),e.consultationsExp=t,e}));t(D(r))}}))}}}(t))},setCurrentInquirers:function(t){return e(D(t))},getLawTypes:function(){return e((function(e){var t=[];E("Type Of Law").select().eachPage((function(e,a){e.forEach((function(e){t.push({id:e.id,type:e.get("Name")})})),a()}),(function(a){a?console.error(a):e(k(t))}))}))},createConsultation:function(t){return e((a=t,function(e){E("Consultations").create([{fields:a}],(function(t,a){t?console.log("Airtable Error: ",t):e(T(a[0]))}))}));var a},consultationInProgress:function(){return e({type:"CONSULTATION_IN_PROGRESS"})}}}))($),ee=a(81),te=a(82),ae=a(172),ne=a.n(ae),re=function(e){function t(){return Object(l.a)(this,t),Object(u.a)(this,Object(m.a)(t).apply(this,arguments))}return Object(p.a)(t,e),Object(c.a)(t,[{key:"render",value:function(){return r.a.createElement(r.a.Fragment,null,r.a.createElement(ee.a,{bg:"primary",variant:"dark"},r.a.createElement(ee.a.Brand,{href:"/"},r.a.createElement("img",{alt:"LGBT Bar NY",src:ne.a,width:"auto",height:"30",className:"d-inline-block align-top"})," Clinic Forms"),r.a.createElement(ee.a.Collapse,{className:"justify-content-end"},r.a.createElement(te.a,null,r.a.createElement(te.a.Link,{href:"/intake"},"Intake"),r.a.createElement(te.a.Link,{href:"/consultation"},"Consultation")))),r.a.createElement(d.d,null,r.a.createElement(d.b,{path:"/consultation",component:Z}),r.a.createElement(d.a,{to:"/consultation"})))}}]),t}(r.a.Component),oe=Object(f.b)((function(e){return{}}),(function(e){return{}}))(re),ie=a(42),se=a(174);function le(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function ce(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?le(a,!0).forEach((function(t){Object(b.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):le(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var ue={inquirers:[],currentInquirers:[],lawyers:[]},me=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ue,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"INIT_INQUIRERS":return ce({},e,{inquirers:t.inquirers});case"SET_CURRENT_INQUIRERS":return ce({},e,{currentInquirers:t.currentInquirers});case"INIT_LAWYERS":return ce({},e,{lawyers:t.lawyers});default:return e}};function pe(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function de(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?pe(a,!0).forEach((function(t){Object(b.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):pe(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var fe={consultations:[],consultSubmitStatus:{status:"in-progress",payload:null}},he=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:fe,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"CONSULTATION_CREATED":return de({},e,{consultSubmitStatus:{status:"success",payload:t.newConsultion}});case"CONSULTATION_IN_PROGRESS":return de({},e,{consultSubmitStatus:{status:"in-progress",payload:null}});case"INIT_CONSULTATIONS":return de({},e,{consultations:t.consultations});default:return e}};function be(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function ye(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?be(a,!0).forEach((function(t){Object(b.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):be(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}var ge={lawTypes:[]},Ee=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:ge,t=arguments.length>1?arguments[1]:void 0;switch(t.type){case"INIT_LAW_TYPES":return ye({},e,{lawTypes:t.lawTypes});default:return e}},ve=Object(ie.c)({people:me,consultations:he,lawTypes:Ee}),Oe=Object(ie.d)(ve,Object(ie.a)(se.a));Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));a(354),a(355),a(356);var Ne=r.a.createElement(f.a,{store:Oe},r.a.createElement(s.a,null,r.a.createElement(oe,null)));i.a.render(Ne,document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()}))}},[[176,1,2]]]);
//# sourceMappingURL=main.f99032d5.chunk.js.map