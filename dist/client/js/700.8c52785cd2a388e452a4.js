"use strict";(self.webpackChunkwebpack=self.webpackChunkwebpack||[]).push([[700],{3993:function(e,t,a){a.d(t,{Z:function(){return o}});var l=a(7294),r=a(9342);var n=e=>l.createElement("div",{className:"shrink-0 snap-center w-full h-full flex snap-x snap-mandatory overflow-auto"},e.children);var s=e=>l.createElement("div",{className:"shrink-0 snap-center w-full h-full flex items-center justify-center"},l.createElement("div",{className:"w-full h-full max-w-[1024px] sm:max-h-[calc(100vh-20vh-70px-70px)] border bg-gray p-3 sm:rounded-md relative",onClick:e.onClick},e.children)),c=(a(3948),a(5966));var m=e=>{const t=(0,c.C)((e=>e.auth)),{userId:a}=t,[n,m]=(0,l.useState)(!1),{img:o,title:u,description:p,url:i,authorId:d,username:f,userImg:h}=e.appData;return l.createElement(s,{onClick:()=>{m((e=>!e))}},l.createElement("img",{src:"".concat("https://stevesan-mernapp.herokuapp.com/","/").concat(o),className:"w-full h-full object-contain"}),n&&l.createElement("div",{className:"absolute top-0 left-0 w-full h-full flex flex-col gap-5 justify-center items-center bg-black sm:rounded-md opacity-80"},l.createElement("div",{className:"flex flex-col items-center gap-3 cursor-default"},l.createElement("h2",{className:"text-2xl lg:text-3xl font-bold"},u),l.createElement("p",{className:"px-32"},p)),l.createElement("div",{className:"flex items-center gap-3"},l.createElement("img",{src:"".concat("https://stevesan-mernapp.herokuapp.com/","/").concat(h),className:"w-10 h-10 rounded-full"}),l.createElement("p",{className:"cursor-default"},"created by ",f)),l.createElement("div",{className:"flex gap-5"},l.createElement("a",{href:i,className:"border px-12 py-2 rounded-lg"},"Visit to Page"),a===d&&l.createElement(l.Fragment,null,l.createElement(r.rU,{to:"/app/".concat(e.id),className:"border px-3 p-2 rounded-lg"},"Edit App"),l.createElement("button",{className:"border px-3 p-2 rounded-lg",onClick:()=>e.onDelete(e.id,u)},"Delete")))))};var o=e=>{const{userId:t,username:a,userImg:c}=e.user;return 0===e.items.length?l.createElement(s,null,l.createElement("div",{className:"absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray sm:rounded-md"},l.createElement("div",{className:"flex flex-col items-center gap-10 cursor-default text-maroon"},l.createElement("h2",{className:"text-2xl lg:text-3xl font-bold"},"No app found. May be create one?"),l.createElement(r.rU,{to:"/app/new",className:"text-center bg-maroon text-gray w-1/2 sm:w-1/3  p-2 rounded-md hover:bg-orange hover:opacity-80"},"Share App")))):l.createElement(n,null,e.items.map((r=>l.createElement(m,{key:r._id,id:r._id,appData:{img:r.image,title:r.title,description:r.description,url:r.url,authorId:t,username:a,userImg:c},onDelete:e.onDelete}))))}},7111:function(e,t,a){var l=a(7294),r=a(6974),n=a(5966),s=a(1834),c=a(8649),m=a(6583),o=a(5261),u=a(1241),p=a(4086),i=a(4754),d=a(1042);t.Z=e=>{const t=(0,r.s0)(),a=(0,n.C)((e=>e.auth)),{token:f,userId:h}=a,{appId:E,title:x}=e.appData,{formData:g,inputHandler:b}=(0,s.Z)({title:{value:"",isValid:!1}},!1),{response:v,error:N,loading:y,sendRequest:w,clearError:k}=(0,c.Z)(!1);(0,l.useEffect)((()=>{null!=v&&v.data.app&&e.onClose()}),[v]);return l.createElement(l.Fragment,null,l.createElement(o.Z,{show:!!N,onClose:k,message:N}),y&&!N&&l.createElement(u.Z,null),l.createElement("div",{className:"flex justify-start items-center sm:px-10"},l.createElement(i.Z,{onClose:e.onClose}),l.createElement("h2",{className:"text-lg lg:text-xl font-bold "},"DELETE APP")),l.createElement("hr",{className:"my-2"}),l.createElement("form",{className:"text-sm lg:text-md",onSubmit:async e=>{e.preventDefault();try{await w({method:"delete",url:"".concat("https://stevesan-mernapp.herokuapp.com/","/api/app/").concat(E),headers:{Authorization:"Bearer ".concat(f)}}),t("0",{replace:!0}),setTimeout((()=>{t("/".concat(h,"/app"),{replace:!0})}))}catch(e){console.log(e)}}},l.createElement(d.Z,{label:"To delete the ".concat(x,", type the name to confirm."),inputId:"title",type:"text",inputSize:"sm",errorText:"please enter a valid title",onInput:b,validators:[(0,m.Xl)(),(0,m.KF)(x),(0,m.wO)(3),(0,m.nD)(30)]}),l.createElement("div",{className:"flex justify-center gap-3"},l.createElement(p.Z,{type:"button",btnStyle:"cancel_btn",btnSize:"sm",onClick:e.onClose},"CANCEL"),l.createElement(p.Z,{type:"submit",btnStyle:"submit_btn",btnSize:"sm",disabled:!g.formIsValid},"SUBMIT"))))}},1700:function(e,t,a){a.r(t);a(3948);var l=a(7294),r=a(5966),n=a(8649),s=a(5261),c=a(708),m=a(1241),o=a(3993),u=a(7111);t.default=()=>{const e=(0,r.C)((e=>e.auth)),{userId:t}=e,[a,p]=(0,l.useState)(!1),[i,d]=(0,l.useState)({appId:"",title:""}),{response:f,error:h,loading:E,clearError:x}=(0,n.Z)(!0,{method:"get",url:"".concat("https://stevesan-mernapp.herokuapp.com/","/api/app/user/").concat(t)}),g=()=>{d({appId:"",title:""}),p(!1)};return l.createElement(l.Fragment,null,l.createElement(s.Z,{show:!!h,onClose:x,message:h}),l.createElement(c.Z,{show:a,onClose:g},l.createElement(u.Z,{onClose:g,appData:i})),l.createElement("div",{className:"w-screen h-[calc(100vh-70px-70px)] flex"},E&&!h&&l.createElement(m.Z,null),!E&&!h&&(null==f?void 0:f.data.user)&&l.createElement(o.Z,{key:f.data.user.username,user:{userId:f.data.user._id,username:f.data.user.username,userImg:f.data.user.image},items:f.data.user.apps,onDelete:(e,t)=>{d({appId:e,title:t}),p(!0)}})))}}}]);