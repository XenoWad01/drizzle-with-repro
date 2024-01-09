import{j as a}from"./jsx-runtime-bc5d6cf6.js";import"./index-c013ead5.js";import"./_commonjsHelpers-725317a4.js";const t=({text:e,onClick:i,disabled:d})=>a("button",{onClick:i,className:`button-primary ${d?"disabled":""}`,children:a("p",{className:"button-text",children:e})});try{t.displayName="ButtonPrimary",t.__docgenInfo={description:"",displayName:"ButtonPrimary",props:{text:{defaultValue:null,description:"",name:"text",required:!0,type:{name:"string"}},onClick:{defaultValue:null,description:"",name:"onClick",required:!0,type:{name:"(_: unknown) => void"}},disabled:{defaultValue:null,description:"",name:"disabled",required:!1,type:{name:"boolean"}}}}}catch{}const m={component:t},r={args:{disabled:!1,text:"Label"},render:e=>a(t,{...e})};var n,o,s;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    disabled: false,
    text: "Label"
  },
  render: props => <ButtonPrimary {...props} />
}`,...(s=(o=r.parameters)==null?void 0:o.docs)==null?void 0:s.source}}};const u=["Primary"];export{r as Primary,u as __namedExportsOrder,m as default};
