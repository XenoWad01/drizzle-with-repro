import{j as n}from"./jsx-runtime-bc5d6cf6.js";import"./index-c013ead5.js";import"./_commonjsHelpers-725317a4.js";const t=({text:e,onClick:s,disabled:c})=>n("button",{onClick:s,className:`button-secondary ${c?"disabled":""}`,children:n("p",{className:"button-text",children:e})});try{t.displayName="ButtonSecondary",t.__docgenInfo={description:"",displayName:"ButtonSecondary",props:{text:{defaultValue:null,description:"",name:"text",required:!0,type:{name:"string"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!0,type:{name:"(_: unknown) => void"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}}}}}catch{}const u={component:t},r={args:{disabled:!1,text:"LABEL"},render:e=>n(t,{...e})};var a,o,d;r.parameters={...r.parameters,docs:{...(a=r.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    disabled: false,
    text: "LABEL"
  },
  render: props => <ButtonSecondary {...props} />
}`,...(d=(o=r.parameters)==null?void 0:o.docs)==null?void 0:d.source}}};const m=["Secondary"];export{r as Secondary,m as __namedExportsOrder,u as default};
