"use strict";(self.webpackChunkwebpack=self.webpackChunkwebpack||[]).push([[520],{3993:function(e,t,a){a.d(t,{Z:function(){return m}});var l=a(7294),r=a(9342);var n=e=>l.createElement("div",{className:"shrink-0 snap-center w-full h-full flex snap-x snap-mandatory overflow-auto"},e.children);var s=e=>l.createElement("div",{className:"shrink-0 snap-center w-full h-full flex items-center justify-center"},l.createElement("div",{className:"w-full h-full max-w-[1024px] sm:max-h-[calc(100vh-20vh-70px-70px)] border bg-gray p-3 sm:rounded-md relative",onClick:e.onClick},e.children)),c=(a(3948),a(5966));var o=e=>{const t=(0,c.C)((e=>e.auth)),{userId:a}=t,[n,o]=(0,l.useState)(!1),{img:m,title:p,description:u,url:i,authorId:d,username:f,userImg:h}=e.appData;return l.createElement(s,{onClick:()=>{o((e=>!e))}},l.createElement("img",{src:"".concat("https://stevesan-mernapp.herokuapp.com/","/").concat(m),className:"w-full h-full object-contain"}),n&&l.createElement("div",{className:"absolute top-0 left-0 w-full h-full flex flex-col gap-5 justify-center items-center bg-black sm:rounded-md opacity-80"},l.createElement("div",{className:"flex flex-col items-center gap-3 cursor-default"},l.createElement("h2",{className:"text-2xl lg:text-3xl font-bold"},p),l.createElement("p",{className:"px-32"},u)),l.createElement("div",{className:"flex items-center gap-3"},l.createElement("img",{src:"".concat("https://stevesan-mernapp.herokuapp.com/","/").concat(h),className:"w-10 h-10 rounded-full"}),l.createElement("p",{className:"cursor-default"},"created by ",f)),l.createElement("div",{className:"flex gap-5"},l.createElement("a",{href:i,className:"border px-12 py-2 rounded-lg"},"Visit to Page"),a===d&&l.createElement(l.Fragment,null,l.createElement(r.rU,{to:"/app/".concat(e.id),className:"border px-3 p-2 rounded-lg"},"Edit App"),l.createElement("button",{className:"border px-3 p-2 rounded-lg",onClick:()=>e.onDelete(e.id,p)},"Delete")))))};var m=e=>{const{userId:t,username:a,userImg:c}=e.user;return 0===e.items.length?l.createElement(s,null,l.createElement("div",{className:"absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray sm:rounded-md"},l.createElement("div",{className:"flex flex-col items-center gap-10 cursor-default text-maroon"},l.createElement("h2",{className:"text-2xl lg:text-3xl font-bold"},"No app found. May be create one?"),l.createElement(r.rU,{to:"/app/new",className:"text-center bg-maroon text-gray w-1/2 sm:w-1/3  p-2 rounded-md hover:bg-orange hover:opacity-80"},"Share App")))):l.createElement(n,null,e.items.map((r=>l.createElement(o,{key:r._id,id:r._id,appData:{img:r.image,title:r.title,description:r.description,url:r.url,authorId:t,username:a,userImg:c},onDelete:e.onDelete}))))}},7111:function(e,t,a){var l=a(7294),r=a(6974),n=a(5966),s=a(1834),c=a(8649),o=a(6583),m=a(5261),p=a(1241),u=a(4086),i=a(4754),d=a(1042);t.Z=e=>{const t=(0,r.s0)(),a=(0,n.C)((e=>e.auth)),{token:f,userId:h}=a,{appId:E,title:x}=e.appData,{formData:g,inputHandler:v}=(0,s.Z)({title:{value:"",isValid:!1}},!1),{response:b,error:y,loading:N,sendRequest:w,clearError:k}=(0,c.Z)(!1);(0,l.useEffect)((()=>{null!=b&&b.data.app&&e.onClose()}),[b]);return l.createElement(l.Fragment,null,l.createElement(m.Z,{show:!!y,onClose:k,message:y}),N&&!y&&l.createElement(p.Z,null),l.createElement("div",{className:"flex justify-start items-center sm:px-10"},l.createElement(i.Z,{onClose:e.onClose}),l.createElement("h2",{className:"text-lg lg:text-xl font-bold "},"DELETE APP")),l.createElement("hr",{className:"my-2"}),l.createElement("form",{className:"text-sm lg:text-md",onSubmit:async e=>{e.preventDefault();try{await w({method:"delete",url:"".concat("https://stevesan-mernapp.herokuapp.com/","/api/app/").concat(E),headers:{Authorization:"Bearer ".concat(f)}}),t("0",{replace:!0}),setTimeout((()=>{t("/".concat(h,"/app"),{replace:!0})}))}catch(e){console.log(e)}}},l.createElement(d.Z,{label:"To delete the ".concat(x,", type the name to confirm."),inputId:"title",type:"text",inputSize:"sm",errorText:"please enter a valid title",onInput:v,validators:[(0,o.Xl)(),(0,o.KF)(x),(0,o.wO)(3),(0,o.nD)(30)]}),l.createElement("div",{className:"flex justify-center gap-3"},l.createElement(u.Z,{type:"button",btnStyle:"cancel_btn",btnSize:"sm",onClick:e.onClose},"CANCEL"),l.createElement(u.Z,{type:"submit",btnStyle:"submit_btn",btnSize:"sm",disabled:!g.formIsValid},"SUBMIT"))))}},520:function(e,t,a){a.r(t),a.d(t,{default:function(){return u}});a(3948);var l=a(7294),r=a(8649),n=a(708),s=a(5261),c=a(1241);var o=e=>l.createElement("div",{className:"w-screen h-[calc(100vh-70px-70px)] flex flex-col snap-y snap-mandatory overflow-auto"},e.children),m=a(3993),p=a(7111);var u=()=>{const[e,t]=(0,l.useState)(!1),[a,u]=(0,l.useState)({appId:"",title:""}),{response:i,error:d,loading:f,clearError:h}=(0,r.Z)(!0,{method:"get",url:"".concat("https://stevesan-mernapp.herokuapp.com/","/api/user")}),E=(e,a)=>{u({appId:e,title:a}),t(!0)},x=()=>{u({appId:"",title:""}),t(!1)};return l.createElement(l.Fragment,null,l.createElement(s.Z,{show:!!d,onClose:h,message:d}),l.createElement(n.Z,{show:e,onClose:x},l.createElement(p.Z,{onClose:x,appData:a})),l.createElement(o,null,f&&!d&&l.createElement(c.Z,null),!f&&!d&&(null==i?void 0:i.data.user)&&i.data.user.map((e=>{if(0!==e.apps.length)return l.createElement(m.Z,{key:e.username,user:{userId:e._id,username:e.username,userImg:e.image},items:e.apps,onDelete:E})}))))}}}]);